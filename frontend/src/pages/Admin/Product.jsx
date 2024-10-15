import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import axios from "axios";
import {
  InputNumber,
  Button,
  Input,
  Select,
  Table,
  Pagination,
  Form,
  Modal,
} from "antd";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

const { Option } = Select;

const Product = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm(); // Ant Design Form
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({}); // Stores selected color/size for each product
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);

  const getToken = () => localStorage.getItem("token");

  // Define a mapping between color names and Tailwind CSS color classes
  const colorClassMap = {
    Red: "bg-red-500",
    Blue: "bg-blue-500",
    Green: "bg-green-500",
    Yellow: "bg-yellow-500",
    Pink: "bg-pink-500",
    Black: "bg-black",
    White: "bg-white border",
    Gray: "bg-gray-500",
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        "https://ecom-app-mtio.onrender.com/api/products/get-products",
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (data.status === "success") {
        setProducts(data.data);
      } else {
        toast.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Something went wrong.");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("https://ecom-app-mtio.onrender.com/api/category", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Something went wrong.");
    }
  };

  // Fetch users for placing an order
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("https://ecom-app-mtio.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(data?.users || data?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchUsers();
  }, []);

  // Filter products by search term and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the current products to display based on pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Handle adding items to cart
  const handleAddToCart = (product) => {
    const { selectedColor, selectedSize } = selectedVariants[product._id] || {};

    if (!selectedColor || !selectedSize) {
      toast.error("Please select a color and size.");
      return;
    }

    const existingItem = selectedItems.find(
      (item) =>
        item.productId === product._id &&
        item.colorId === selectedColor &&
        item.sizeId === selectedSize
    );

    if (existingItem) {
      toast.error(`${product.name} in this variant is already in the cart.`);
      return;
    }

    const variant = product.variants.find(
      (v) => v.color._id === selectedColor && v.size._id === selectedSize
    );

    const updatedItems = [
      ...selectedItems,
      {
        productId: product._id,
        name: product.name,
        quantity: 1,
        price: variant.price,
        colorId: selectedColor, // Store color ID
        sizeId: selectedSize, // Store size ID
        colorName: variant.color.name, // Store color name for display
        sizeName: variant.size.name, // Store size name for display
      },
    ];

    setSelectedItems(updatedItems);
    setTotalAmount(totalAmount + variant.price);
    toast.success(`${product.name} added to cart.`);
  };

  // Handle removing items from cart
  const handleRemoveFromCart = (productId) => {
    const updatedItems = selectedItems.filter(
      (item) => item.productId !== productId
    );
    const removedItem = selectedItems.find(
      (item) => item.productId === productId
    );

    setSelectedItems(updatedItems);
    setTotalAmount(totalAmount - removedItem.price * removedItem.quantity);
    toast.success(`${removedItem.name} removed from cart.`);
  };

  // Update quantity in cart
  const handleUpdateQuantity = (productId, quantity) => {
    const updatedItems = selectedItems.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    const updatedTotal = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setSelectedItems(updatedItems);
    setTotalAmount(updatedTotal);
  };

  // Handle selecting color and size
  const handleSelectVariant = (productId, type, value) => {
    setSelectedVariants((prevState) => ({
      ...prevState,
      [productId]: {
        ...prevState[productId],
        [type]: value,
      },
    }));
  };

  const handlePlaceOrder = async () => {
    if (!selectedUser || selectedItems.length === 0 || totalAmount <= 0) {
      toast.error("Please fill all required fields.");
      return;
    }

    const orderData = {
      userId: selectedUser, // Send userId as 'user'
      items: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        color: item.colorId, // Send color ID
        size: item.sizeId, // Send size ID
      })),
      totalAmount,
    };

    try {
      const response = await axios.post(
        "https://ecom-app-mtio.onrender.com/api/order/admin/place-order",
        orderData,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.data.success) {
        toast.success("Order placed successfully by admin!");
        setSelectedItems([]);
        setTotalAmount(0);
      } else {
        toast.error(response.data.message || "Failed to place the order.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Function to handle Add/Edit user submission
  const handleUserSubmit = async (values) => {
    try {
      if (isEditing) {
        // Update existing user
        await axios.put(`/api/users/update/${currentUser._id}`, values);
        toast.success("User updated successfully!");
      } else {
        // Add new user
        await axios.post("/api/users/create", values);
        toast.success("User added successfully!");
      }
      setIsModalVisible(false);
      form.resetFields();
      // Refetch users after adding/editing
      const response = await axios.get("/api/users");
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  // Function to handle delete user
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/delete/${userId}`);
      toast.success("User deleted successfully!");
      setUsers(users.filter((user) => user._id !== userId)); // Update UI after delete
    } catch (error) {
      toast.error("Failed to delete user!");
    }
  };

  // Function to open the modal for adding/editing a user
  const showModal = (user = null) => {
    setIsEditing(!!user); // If user is provided, we're editing
    setCurrentUser(user); // Set the current user being edited
    if (user) {
      form.setFieldsValue(user); // Pre-fill form with user data if editing
    }
    setIsModalVisible(true);
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {/* Category Filter Dropdown */}
          <h1 className="text-xl instrument-sans">Categories</h1>
          <di className="flex gap-4">
            {categories.map((category) => (
              <div key={category._id} value={category._id}>
                <p className="bg-gray-100 px-2 rounded-lg py-1">
                  {category.name}
                </p>
              </div>
            ))}
          </di>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {currentProducts.map((product) => {
              const availableColors = [
                ...new Map(
                  product.variants?.map((variant) => [
                    variant.color._id,
                    variant.color,
                  ])
                ).values(),
              ];

              const availableSizes = [
                ...new Map(
                  product.variants?.map((variant) => [
                    variant.size._id,
                    variant.size,
                  ])
                ).values(),
              ];

              const selectedColor =
                selectedVariants[product._id]?.selectedColor;
              const selectedSize = selectedVariants[product._id]?.selectedSize;

              return (
                <div key={product._id} className="border">
                  <img
                    src={`https://ecom-app-mtio.onrender.com${product.images[0]?.url || ""}`}
                    alt={product.name}
                    className="w-full h-44 mb-2"
                  />

                  <div className="px-2 mb-2">
                    <div className="flex justify-between">
                      <h3 className="text-lg mb-2">
                        {product.name}
                      </h3>
                      
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-sm ">{product.variants[0]?.quantity} Pcs</h4>
                        <h4 className="text-sm ">${product.variants[0]?.price}</h4>
                      </div>
                      <div className="flex space-x-4 mt-2">
                        <span>Color:</span>
                        {availableColors.length > 0 ? (
                          availableColors.map((color, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                handleSelectVariant(
                                  product._id,
                                  "selectedColor",
                                  color._id
                                )
                              }
                              className={`w-6 h-6 rounded-full border ${
                                selectedColor === color._id
                                  ? "ring-2 ring-black"
                                  : ""
                              } ${colorClassMap[color.name] || "bg-gray-300"}`}
                            ></button>
                          ))
                        ) : (
                          <span>No colors available</span>
                        )}
                      </div>

                      <div className="flex space-x-4 mt-2">
                        <span>Size:</span>
                        {availableSizes.length > 0 ? (
                          availableSizes.map((size, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                handleSelectVariant(
                                  product._id,
                                  "selectedSize",
                                  size._id
                                )
                              }
                              className={`px-2 py-1 border rounded-md text-sm ${
                                selectedSize === size._id ? "border-black" : ""
                              }`}
                            >
                              {size.name}
                            </button>
                          ))
                        ) : (
                          <span>No sizes available</span>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full mt-2 bg-[#1f1f1f] text-white"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Component */}
          <div className="flex justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={productsPerPage}
              total={filteredProducts.length}
              onChange={handlePageChange}
            />
          </div>
        </div>

        {/* Right Sidebar: User, Cart, etc. */}
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-4">POS System</h2>
          <Input
            placeholder="Search products..."
            className="mb-4"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          />
          {/* User Selection */}
          <div className="mb-4 gap-3 flex">
            <Select
              placeholder="Select a user"
              style={{ width: "100%" }}
              onChange={(value) => setSelectedUser(value)}
            >
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.fullName}
                </Option>
              ))}
            </Select>
            <Button type="primary" className="mb-3" onClick={() => showModal()}>
              Add New User
            </Button>
          </div>

          {/* Cart Items */}
          <div className="">
            <h3 className="text-lg font-semibold mb-4">Cart</h3>
            {selectedItems.length > 0 ? (
              <div>
                <Table
                  dataSource={selectedItems}
                  columns={[
                    { title: "Product", dataIndex: "name", key: "name" },
                    // {
                    //   title: "Color",
                    //   dataIndex: "colorName", // Display color name in cart
                    //   key: "colorName",
                    // },
                    // {
                    //   title: "Size",
                    //   dataIndex: "sizeName", // Display size name in cart
                    //   key: "sizeName",
                    // },
                    {
                      title: "Price",
                      dataIndex: "price",
                      key: "price",
                      render: (text) => `₹${text}`,
                    },
                    {
                      title: "Quantity",
                      dataIndex: "quantity",
                      key: "quantity",
                      render: (text, record) => (
                        <InputNumber
                          min={1}
                          value={text}
                          onChange={(value) =>
                            handleUpdateQuantity(record.productId, value)
                          }
                        />
                      ),
                    },
                    {
                      title: "Total",
                      key: "total",
                      render: (_, record) =>
                        `₹${record.price * record.quantity}`,
                    },
                    {
                      title: "Action",
                      key: "action",
                      render: (_, record) => (
                        <Button
                          type="link"
                          onClick={() => handleRemoveFromCart(record.productId)}
                        >
                          <XMarkIcon className="h-5 w-5 text-black" />
                        </Button>
                      ),
                    },
                  ]}
                  rowKey="productId"
                  pagination={false}
                />
              </div>
            ) : (
              <p>No items in the cart.</p>
            )}

            <h3 className="text-xl font-semibold mt-4">
              Total: ₹{totalAmount}
            </h3>

            <Button
              className="mt-4 w-full bg-[#1f1f1f] text-white"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>

      {/* Modal for Adding/Editing Users */}
      <Modal
        title={isEditing ? "Edit User" : "Add New User"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()} // Trigger form submit on "OK"
        width="50vw"
      >
        <Form form={form} onFinish={handleUserSubmit} layout="vertical">
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please enter the first name" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: "Please enter the last name" },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter the username" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: !isEditing, message: "Please enter the password" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </div>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select>
              <Option value="customer">Customer</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default Product;

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import AdminLayout from "../../components/Layout/AdminLayout";
import { useForm } from "react-hook-form";
import { Table, Button, Input, Modal, Popconfirm } from "antd";
import toast from "react-hot-toast";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const CreateSize = () => {
  const { register, handleSubmit, reset } = useForm();
  const [sizes, setSizes] = useState([]);
  const [editingSize, setEditingSize] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  // Fetch token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Fetch all Sizes
  const fetchSizes = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:1000/api/size/get-sizes",
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (data.status === "success") {
        setSizes(data.data);
        console.log(data);
      } else {
        toast.error("Failed to fetch colors.");
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  // Handle form submit (Create or Update Color)
  const onSubmit = async (formData) => {
    try {
      const token = getToken();

      if (editingSize) {
        // Update existing color
        const { data } = await axios.put(
          `http://localhost:1000/api/size/update-size/${editingSize._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.status === "success") {
          toast.success("Size updated successfully");
          fetchSizes();
          reset();
          setIsModalVisible(false);
        } else {
          toast.error("Failed to update Size.");
        }
      } else {
        // Create new Size
        const { data } = await axios.post(
          "http://localhost:1000/api/size/create-size",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.status === "success") {
          toast.success("Size created successfully");
          fetchSizes();
          reset();
        } else {
          toast.error("Failed to create Size.");
        }
      }
    } catch (error) {
      console.error("Error creating/updating Size:", error);
      toast.error("Something went wrong.");
    }
  };

  // Handle edit color
  const handleEdit = (color) => {
    setEditingSize(color);
    setIsModalVisible(true);
  };

  // Handle delete color
  const handleDelete = async (id) => {
    try {
      const token = getToken();
      const { data } = await axios.delete(
        `http://localhost:1000/api/size/delete-size/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.status === "success") {
        toast.success("Size deleted successfully");
        fetchSizes();
      } else {
        toast.error("Failed to delete Size.");
      }
    } catch (error) {
      console.error("Error deleting Size:", error);
      toast.error("Something went wrong.");
    }
  };

  // Columns for the color table
  const columns = [
    {
      title: "Size Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="space-x-2">
          <Button
            
            onClick={() => handleEdit(record)}
          >
            <PencilSquareIcon class="h-5 w-5 text-blue-500" />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this Size?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
           <Button><TrashIcon class="h-5 w-5 text-red-500" /></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="dark:bg-gray-900">
        <form onSubmit={handleSubmit(onSubmit)} className="space-x-4">
          <label htmlFor="colorName">Size Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            defaultValue={editingSize ? editingSize.name : ""}
            className="mb-2 px-2 py-2 border rounded-md dark:bg-gray-900 "
          />
          <button type="submit">
            {editingSize ? "Update" : "Create"} Size
          </button>
        </form>

        <Table
          dataSource={sizes}
          columns={columns}
          rowKey="_id"
          loading={loading}
          className="mt-4 dark-table"
          pagination={{
            pageSize: 5,
          }}
        />

        {/* Edit Color Modal */}
        <Modal
          title="Edit Size"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="sizeName">Size Name</label>
            <Input
              type="text"
              {...register("name", { required: true })}
              defaultValue={editingSize ? editingSize.name : ""}
            />
            <Button htmlType="submit">Update Size</Button>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default CreateSize;

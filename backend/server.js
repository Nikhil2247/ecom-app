const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const addressRoutes = require('./routes/addressRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const sizeRoutes = require('./routes/sizeRoutes');
const colorRoutes = require('./routes/colorRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require('./routes/inventoryRoutes');
const navigationRoutes = require('./routes/navigationRoutes');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require ("cors");
// server.js (or app.js)

const _dirname = path.resolve();


dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.options('*', cors()); // Enable pre-flight for all routes
app.use(cors({
  origin: '*', // Frontend origin
  credentials: true,
}));
app.use(bodyParser.json({ limit: '10mb' }));

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('../uploads'));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', userRoutes)
app.use("/api", colorRoutes)
app.use("/api/size", sizeRoutes)
app.use("/api",inventoryRoutes)
app.use("/api/order",orderRoutes)
app.use('/api', navigationRoutes);


app.use(express.static(path.join(_dirname, "/frontend/build")));
app.get('*',(_,res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"));
})
// Connect to MongoDB
connectDB();


const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

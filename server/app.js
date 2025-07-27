import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { login, signup } from "./controllers/authController.js";
import authRoutes from "./routes/authRoutes.js"; 
import userRoutes from './routes/userRoutes.js';
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();  


app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/posts", express.static(path.join(__dirname, "posts")));

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
});

app.use("/api/auth", authRoutes);  
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error(err));

import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/dbConfig.js";
dotenv.config();
connectDatabase(app);

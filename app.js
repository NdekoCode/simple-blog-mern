import dotenv from "dotenv";
import express from "express";
import { resolve } from "path";
import { errrorHandle } from "./middlewares/error.mid.js";
import UserMDL from "./models/UserMDL.js";
import postsRouter from "./routes/posts.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { __dirname } from "./utils/utils.js";
import { isEmpty } from "./utils/validators.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(resolve(__dirname, "public")));
const baseUrl = process.env.BASE_URL;

app.use(async (req, res, next) => {
  const user = await UserMDL.findById("639eaa53f814f998385ce422");

  try {
    if (!isEmpty(user)) {
      req.user = new UserMDL(user);
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
app.get("/", (req, res) => {
  return res.send({ messages: "Invalid URL" });
});
app.use(errrorHandle);

app.use(baseUrl + "/auth", usersRoutes);
app.use(baseUrl + "/posts", postsRouter);
export default app;

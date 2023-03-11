import express from "express";
import { BASE_API } from "./libs/constants.js";
import postsRouter from "./routes/posts.routes.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res) => {
  res.send({
    message: "Invalide URL",
  });
});
app.use(BASE_API + "/posts", postsRouter);
export default app;

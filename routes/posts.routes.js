import { Router } from "express";
import { fakePosts } from "../libs/constants.js";
const postsRouter = Router();
postsRouter.get("/", (req, res) => {
  res.send(fakePosts);
});
postsRouter.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = fakePosts.filter((p) => p.id === id);
  res.send(post[0] || []);
});
export default postsRouter;

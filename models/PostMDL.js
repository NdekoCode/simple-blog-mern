import { model, Schema, Types } from "mongoose";
const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: [
      {
        type: Types.ObjectId,
        required: false,
        ref: "image",
      },
    ],
    tags: { type: [Types.ObjectId], ref: "Tag" },
  },
  {
    timestamps: true,
  }
);
class Post {
  static findBySlug(slug) {
    return this.findOne({ slug });
  }
}
PostSchema.loadClass(Post);
const PostMDL = new model("Post", PostSchema);
export default PostMDL;

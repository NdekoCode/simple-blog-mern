import { model, Schema } from "mongoose";
const UserSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
class User {
  getProfileUrl() {
    return "";
  }
  static findByEmail(email) {
    return this.findOne({ email });
  }
}
UserSchema.indexes();
UserSchema.loadClass(User);
const UserMDL = new model("User", UserSchema);

export default UserMDL;

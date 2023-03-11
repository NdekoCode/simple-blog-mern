import { connect, set } from "mongoose";
// import { fakePosts } from "../utils/fakeData.js";
const dbUrl = process.env.BD_URL;
export default async function connectDD() {
  try {
    set("strictQuery", false);
    await connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
    // fakePosts();
  } catch (error) {
    console.log("failed to connected to the database ", error.message);
  }
}

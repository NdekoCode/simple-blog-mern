import mongoose, { connect } from "mongoose";
export const connectDatabase = async (app) => {
  try {
    const BD_URL = process.env.BD_URL;
    mongoose.set("strictQuery", true);
    connect(BD_URL, {
      useUnifiedTopology: true,
    });
    console.info("Connected to the database");
    const PORT = process.env.PORT || 3500;
    app.listen(PORT, () => {
      console.info("Server is running at http://localhost:" + PORT);
    });
  } catch (error) {
    console.info("Failed to Connected to the database");
    console.error(error.message);
  }
};

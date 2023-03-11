import jwt from "jsonwebtoken";
import Alert from "../utils/Alert.js";
export const auth = (req, res, next) => {
  const alert = new Alert(req, res);
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.verify(token, process.env.SECRET_KEY || "RANDOM");
    const { userId, email } = decodeToken;
    req.auth = { userId, email };
    next();
  } catch (error) {
    alert.danger("Vous devez etre connecté pour acceder à cette page ", 401);
  }
};

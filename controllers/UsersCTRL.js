import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import UserMDL from "../models/UserMDL.js";
import Alert from "../utils/Alert.js";
import { consoleError } from "../utils/utils.js";
import Validator from "../utils/Validator.js";
import { varIsEmpty } from "../utils/validators.js";

export default class UsersCTRL {
  async getUsers(req, res) {
    const validator = new Validator();
    try {
      const users = await UserMDL.find({}).sort({ createdAt: -1 }).exec();
      if (!validator.isEmpty(users)) {
        return res.json({ users });
      }
      return res.json({ users: [] });
    } catch (error) {
      return new Alert(req, res).danger(error.message, 500);
    }
  }
  async getUser(req, res) {
    const validator = new Validator();
    const id = req.params.id;
    const alert = new Alert(req, res);
    try {
      const user = await UserMDL.findById(id);
      if (!validator.isEmpty(user)) {
        return res.json(user);
      }

      return alert.danger("L'utilisateur n'existe pas", 404);
    } catch (error) {
      console.log(error);
      return alert.danger(error.messsage, 500);
    }
  }
  async deleteUser(req, res) {
    const _id = req.params.id;
    const alert = new Alert(req, res);
    try {
      const user = await UserMDL.exists({ _id });
      if (user) {
        await UserMDL.findByIdAndDelete(_id);
        return alert.success("Utilisateur supprimer avec succes");
      }
      return alert.danger("L'Utilisateur n'existe pas");
    } catch (error) {
      return alert.danger(error.message, 500);
    }
  }
  async signin(req, res) {
    const alert = new Alert(req, res);
    const validator = new Validator();
    const bodyRequest = { ...req.body };
    const fielRequired = [
      "firstName",
      "lastName",
      "email",
      "password",
      "confpassword",
    ];
    validator
      .validateRequiredFields(bodyRequest, fielRequired)
      .validateFormBody(bodyRequest)
      .validatePassword(bodyRequest.password, bodyRequest.confpassword);
    try {
      if (validator.varIsEmpty(validator.errors)) {
        const testUser = await UserMDL.exists({ email: bodyRequest.email });
        if (testUser) {
          validator.errors["error"] = "L'utitlisateur existe déjà";
          return alert.danger(validator.errors["error"], 409);
        }
        return await UsersCTRL.addUser(alert, bodyRequest);
      }

      console.log(validator.errors);
      return alert.danger(validator.errors["error"], 400);
    } catch (error) {
      return alert.danger(error.messsage, 500);
    }
  }
  /**
   * @description Nous permet de verifier si un utilisateur existe dans notre base de donnée et si le mot de passe transmis par le client correspond à cet utilisateur
   * @author NdekoCode
   * @param {*} req
   * @param {*} res
   * @memberof UsersCTRL
   */
  async login(req, res) {
    const alert = new Alert(res, res);
    const validator = new Validator();
    try {
      const user = await UserMDL.findOne({ email: req.body.email });
      if (!validator.varIsEmpty(user)) {
        const valid = await compare(req.body.password, user.password);
        if (valid) {
          const userData = {
            userId: user._id,
            email: user.email,
            token: jwt.sign(
              { userId: user._id, email: user.email },
              process.env.SECRET_KEY || "RANDOM",
              { expiresIn: "24h" }
            ),
          };
          alert.setOtherData({ userData });
          return alert.success("Vous etes bien connecté");
        }
        return alert.danger("Email ou mot de passe invalide", 401);
      }
      return alert.danger("Email ou mot de passe invalide", 401);
    } catch (error) {
      console.log(error);
      return alert.danger(error.message, 500);
    }
  }
  static async addUser(alert, bodyRequest, update = {}) {
    const validator = new Validator();
    try {
      if (!validator.varIsEmpty(update)) {
        await UserMDL.updateOne(update, bodyRequest);
        return alert.success(
          "La modification de l'utilisateur a été faite avec succées",
          201
        );
      }

      bodyRequest.password = await hash(bodyRequest.password, 12);
      bodyRequest.slug = slugify(
        `${bodyRequest.firstName} ${bodyRequest.lastName}`.toLocaleLowerCase()
      );
      const user = new UserMDL(bodyRequest);
      await user.save();
      return alert.success("Utilisateur créer avec succées !", 201);
    } catch (error) {
      console.log(error);
      return alert.danger(error.message, 500);
    }
  }
  async updateUser(req, res) {
    const validator = new Validator();
    const _id = req.params.id;
    const alert = new Alert(req, res);
    const bodyRequest = { ...req.body };
    validator.validateFormBody(bodyRequest);
    if (!validator.varIsEmpty(validator.errors)) {
      return alert.danger("Veuiller entrer tous les change", 400);
    }
    try {
      const testUser = await UserMDL.exists({ _id });
      if (testUser) {
        console.log(bodyRequest);
        if (
          !varIsEmpty(bodyRequest.lastName) ||
          !varIsEmpty(bodyRequest.firstName)
        ) {
          bodyRequest.slug = slugify(
            `${bodyRequest.firstName} ${bodyRequest.lastName}`.toLowerCase()
          );
        }
        await UserMDL.updateOne({ _id }, bodyRequest);
        return alert.success("Utilisateur modifier avec succés", 201);
      }

      return alert.danger("L'utilisateur n'existe pas", 404);
    } catch (error) {
      consoleError(error);
      return alert.danger(error.messsage, 500);
    }
  }
}

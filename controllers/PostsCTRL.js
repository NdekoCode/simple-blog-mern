import slugify from "slugify";
import PostMDL from "../models/PostMDL.js";
import TagMDL from "../models/TagMDL.js";
import Alert from "../utils/Alert.js";
import Validator from "../utils/Validator.js";
import { isEmpty, varIsEmpty } from "../utils/validators.js";

export default class PostsCTRL {
  async getPosts(req, res) {
    try {
      /* const posts = await PostMDL.find().populate("autthor", [
        "email",
        "firstName",
        "lastName",
        "username",
        "image",
      ]); */
      const posts = await PostMDL.find().populate([
        "author",
        {
          path: "tags",
          model: TagMDL,
        },
      ]);
      if (!isEmpty(posts)) {
        return res.json({ posts });
      }

      return res.json({ posts: [] });
    } catch (error) {
      const alert = new Alert(req, res);
      return alert.danger(error.message, 500);
    }
  }
  async getPost(req, res) {
    const validator = new Validator();
    const _id = req.params.id;
    try {
      const post = await PostMDL.findById(_id).populate([
        "author",
        { path: "tags", model: TagMDL },
      ]);
      if (!validator.isEmpty(post)) {
        return res.json(post);
      }
      return res.json({});
    } catch (error) {
      const alert = new Alert(req, res);
      return alert.danger(error.message, 500);
    }
  }
  async addPost(req, res) {
    const validate = new Validator();
    const fieldRequired = ["title", "body"];
    const alert = new Alert(req, res);
    const bodyRequest = { ...req.body };
    validate
      .validateFormBody(bodyRequest)
      .validateRequiredFields(bodyRequest, fieldRequired);
    try {
      if (validate.varIsEmpty(validate.errors)) {
        bodyRequest.slug = slugify(bodyRequest.title.toLowerCase());
        bodyRequest.author = req.user._id;
        const post = new PostMDL(bodyRequest);

        await post.save();
        return alert.success("Post ajouter avec succés", 201);
      }
      alert.danger(validate.errors["error"], 400);
    } catch (error) {
      alert.danger(error.message, 500);
    }
  }
  async updatePost(req, res) {
    const _id = req.params.id;
    const bodyRequest = { ...req.body };
    const validate = new Validator();
    const alert = new Alert(req, res);
    if (!validate.varIsEmpty(bodyRequest)) {
      validate.validateFormBody(bodyRequest);
      try {
        if (validate.varIsEmpty(validate.errors)) {
          const testPost = await PostMDL.findById(_id);
          if (!validate.isEmpty(testPost)) {
            if (!validate.isEmpty(bodyRequest.title)) {
              bodyRequest.slug = slugify(bodyRequest.title.toLowerCase());
            }
            if (testPost.author.toString() === req.user._id.toString()) {
              await PostMDL.updateOne({ _id }, bodyRequest);
              return alert.success("Article modifier avec succés", 202);
            }

            return alert.danger(
              "Modifier un article dont vous etes le proprietaire",
              403
            );
          }

          return alert.danger("L'article n'existe pas", 403);
        }

        return alert.danger(validator.errors["error"], 400);
      } catch (error) {
        return alert.danger(error.message, 500);
      }
    }

    return alert.danger("Veuillez completer tous les champs", 403);
  }
  async deletePost(req, res) {
    const _id = req.params.id;
    const alert = new Alert(req, res);
    try {
      const post = await PostMDL.findById(_id);
      if (!varIsEmpty(post)) {
        if (post.author.toString() === req.user._id.toString()) {
          await PostMDL.deleteOne({ _id });
          return alert.success("Article supprimer avec succés", 202);
        }

        return alert.danger(
          "Supprimer un article dont vous etes propriétaire modifié",
          403
        );
      }
    } catch (error) {
      return alert.danger(error.message, 500);
    }
  }
}

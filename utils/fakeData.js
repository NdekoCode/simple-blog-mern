import { hash } from "bcrypt";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import slugify from "slugify";
import PostMDL from "../models/PostMDL.js";
import TagMDL from "../models/TagMDL.js";
import UserMDL from "../models/UserMDL.js";
import { __filename } from "./utils.js";
export async function fakeUser() {
  const userFile = await readFile(__filename + "/fakeDataJSON/users.json", {
    encoding: "utf-8",
  });
  const userFileData = JSON.parse(userFile);
  const password = await hash("7288ndeko", 12);
  const firstUser = {
    slug: slugify("Arick Bulakali".toLocaleLowerCase()),
    firstName: "Arick",
    lastName: "Bulakali",
    email: "arickbulakali@gmail.com",
    username: "ndekocode",
    password,
  };

  const user = new UserMDL(firstUser);
  await user.save();
  for (const item of userFileData) {
    const userData = {
      slug: slugify(`${item.firstName} ${item.lastName}`.toLocaleLowerCase()),
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      username: item.username,
      password,
    };
    const user = new UserMDL(userData);
    await user.save();
    console.log("add user ", `${item.firstName} ${item.lastName}`);
  }
}
export async function fakePosts() {
  const postsFile = await readFile(
    join(__filename, "fakeDataJSON", "posts.json"),
    {
      encoding: "utf-8",
    }
  );
  const postData = JSON.parse(postsFile);
  const users = await UserMDL.find({});
  const tags = await TagMDL.find({});
  for (let item of postData) {
    const randomItem = parseInt(Math.random() * users.length);
    const postData = {
      slug: slugify(item.title.toLowerCase()),
      title: item.title,
      body: item.body,
      author: users[randomItem]._id,
      tags: [
        ...new Set([
          tags[parseInt(Math.random() * tags.length)]._id.toString(),
          tags[parseInt(Math.random() * tags.length)]._id.toString(),
          tags[parseInt(Math.random() * tags.length)]._id.toString(),
        ]),
      ],
    };
    const post = new PostMDL(postData);
    await post.save();
    console.log(`Article ${post.title} ajouter`);
  }
}
export async function fakeTags() {
  const singleFile = await readFile(
    join(__filename, "fakeDataJSON", "tags.json"),
    {
      encoding: "utf-8",
    }
  );
  const singleTags = JSON.parse(singleFile);
  for (let item of singleTags) {
    item.slug = slugify(item.title.toLowerCase());
    const tag = new TagMDL(item);
    await tag.save();
    console.log("tag ", item.title, " Ajouter");
  }
}

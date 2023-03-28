const express = require("express");
const jwt = require("jsonwebtoken");
const { PostModel } = require("../Models/post.model");
const PostRouter = express.Router();

//get-all
PostRouter.get("/", async (req, res) => {
  const { device, min, max } = req.query;
  const query = {};
  const { userID } = req.body;
  let posts = [];
  try {
    if (min != null && max != null) {
      posts = await PostModel.find({
        $and: [
          { userID },
          { device: { $regex: device || "", $options: "i" } },
          { no_of_comments: { $gt: min, $lt: max } },
        ],
      });
    } else {
      posts = await PostModel.find({
        $and: [
          { userID },
          { device: { $regex: device || "", $options: "i" } },
          //   { no_of_comments: { $gt: min, $lt: max } },
        ],
      });
    }

    res.status(200).json({ msg: "success", posts });
  } catch (error) {
    console.log("error: ", error);
    res.status(400).send({ msg: error.message });
  }
});

//get-top
PostRouter.get("/top", async (req, res) => {
  const userID = req.body.userID;
  try {
    let posts = await PostModel.find({ userID }).sort({
      no_of_comments: "desc",
    });
    res.status(200).send(posts);
  } catch (error) {
    res.status(400).send({ msg: "Cannot get the post" });
  }
});

//create
PostRouter.post("/add", async (req, res) => {
  const data = req.body;
  try {
    const posts = new PostModel(data);
    await posts.save();
    res.status(200).send({ msg: "Post is Successfully Added" });
  } catch (error) {
    console.log("error:", error);
    res.status(400).send({ msg: error.message });
  }
});

//update
PostRouter.patch("/update/:postID", async (req, res) => {
  payload = req.body;
  const userID = req.body.userID;
  const { postID } = req.params;
  try {
    await PostModel.findByIdAndUpdate({ _id: postID }, payload);
    res.status(200).send({ msg: "Post is Updated Successfully" });
  } catch (error) {
    console.log("error:", error);
    res.status(400).send({ msg: error.message });
  }
});

//delete
PostRouter.delete("/delete/:postID", async (req, res) => {
  const userID = req.body.userID;
  const { postID } = req.params;
  try {
    await PostModel.findByIdAndDelete({ _id: postID });
    res.status(200).send({ msg: "Post is Deleted Successfully" });
  } catch (error) {
    console.log("error:", error);
    res.status(400).send({ msg: error.message });
  }
});

module.exports = {
  PostRouter,
};

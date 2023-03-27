const express = require("express");
const cors = require("cors");
const { connection } = require("./Configs/db");
const { UserRouter } = require("./Routes/user.router");
const { Authentication } = require("./Middlewares/authentication");
const { PostRouter } = require("./Routes/post.router");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

//Users-router
app.use("/users", UserRouter);
//auth
app.use(Authentication);
//Posts-router
app.use("/posts", PostRouter);

app.get("/", async (req, res) => {
  res.send("Home Page");
});

const port = process.env.PORT;

app.listen(port, async () => {
  try {
    await connection;
    console.log(`Server is running at port ${port}`);
  } catch (error) {
    console.log("error", error);
  }
});

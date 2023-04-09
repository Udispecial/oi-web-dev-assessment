import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
// import bodyParser from "body-parser";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import categoryRouter from "./routes/category.routes.js";
import tagRouter from "./routes/tag.routes.js";
import commentRouter from "./routes/comment.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send({ message: "Running!!!" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/categories", categoryRouter);

const startServer = async () => {
  try {
    // connect to database
    connectDB(process.env.MONGODB_URL);

    app.listen(8080, () =>
      console.log("server has started on port http://localhost/8080")
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();

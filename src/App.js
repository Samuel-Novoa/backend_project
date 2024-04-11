import routes from "./routes/router";
import pkj from "../package.json";
import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(morgan("tiny"));
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    name: pkj.name,
    author: pkj.author,
    version: pkj.version,
    description: pkj.description,
  });
});

routes(app);

export default app;

import express from "express";
import cors from "cors";
import router from "./routes/roulette";
const app = express();
app.set("port", process.env.PORT || 4000);
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(app.get("port"), () => {
  console.log("server port", app.get("port"));
});

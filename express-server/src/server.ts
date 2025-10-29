require("dotenv").config();
import app from "./app";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";

const port = config.get("port");

app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);

  connectToDb();
});

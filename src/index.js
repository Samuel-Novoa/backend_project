import app from "./app";
import "./database/mysql";
import { getConfig } from "./config";

const config = getConfig();

const port = config.conection.PORT;

app.listen(port, console.log(`Server online, http://localhost:${port}`));
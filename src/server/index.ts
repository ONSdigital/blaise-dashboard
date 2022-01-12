import NewServer from "./server";

const port: string = process.env.PORT || "5000";
const app = NewServer();

app.listen(port);

console.log("App is listening on port " + port);
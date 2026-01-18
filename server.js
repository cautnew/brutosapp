const express = require("express");
const { resolve } = require("path");

const app = express();
app.use("/", express.static(resolve(__dirname, "./build")));
console.log(resolve(__dirname, "./build"));
console.log(resolve(__dirname, "build", "index.html"));
app.get("*", (req, res) => {
  res.sendFile(resolve(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 3000, (err) =>
  err ? console.error(err) : console.log("Sucess!")
);

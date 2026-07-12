const express = require("express");
const chalk = require("chalk");

const app = express();

app.listen(process.env.PORT, () => {
  console.log(
    chalk.greenBright(`Server is running on port ${process.env.PORT}`),
  );
});

const express = require("express");
const chalk = require("chalk");
const dotenv = require('dotenv');

const path = require('path');

const app = express();

dotenv.config({
path: path.join(__dirname, 'configs', 'config.env')
})

app.listen(process.env.PORT, () => {
  console.log(
    chalk.greenBright(`Server is running on port ${process.env.PORT}`),
  );
});

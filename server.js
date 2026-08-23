const express = require("express");
const chalk = require("chalk");

const userRoute = require("./routes/userRoute");

const app = express();

app.use("/user", userRoute);

app.listen(process.env.PORT, () => {
  console.log(
    chalk.greenBright(`Server is running on port ${process.env.PORT}`),
  );
});

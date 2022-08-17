const express = require("express");
const app = express();
const cors = require("cors");
const { parse } = require("./utils/parser");

app.use(cors());

app.get("/link/v1", (req, res) => {
  let url = req.query.url;

  parse(url)
    .then((data) => {
      // console.log("data", data);
      return res.status(200).json({
        success: true,
        data,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        err,
      });
    });
});

const port = process.env.PORT || 5050;

app.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});

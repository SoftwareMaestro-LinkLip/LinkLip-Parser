const express = require("express");
const app = express();
const cors = require("cors");
const { parse } = require("./utils/parser");

app.use(cors());

app.get("/link/v1", (req, res) => {
  let url = req.query.url;

  parse(url).then((data) => {
    return res.status(200).json({
      success: true,
      data,
    });
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});

const express = require("express");
const app = express();
const cors = require("cors");
const { parser } = require("./utils/parser");

const bodyParser = require("body-parser");
app.use(cors());

// application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게함
//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// application/jason 을 분석해서 가져올 수 있게함
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());

// // 라우팅
// app.use("/api/users", require("./routes/users"));

app.get("/link/v1", (req, res) => {
  let url = req.query.url;

  console.log("url: ", url);

  parser(url).then((data) => {
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

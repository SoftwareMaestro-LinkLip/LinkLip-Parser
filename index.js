const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { parse } = require('./utils/parser');

// application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게함
app.use(bodyParser.urlencoded({ extended: true }));
// application/jason 을 분석해서 가져올 수 있게함
app.use(bodyParser.json());

app.use(cors());

app.post('/link/v1', (req, res) => {
  let url = req.query.url;

  parse(req.body.url).then((data) => {
    return res.status(200).json({
      success: true,
      data,
    });
  });
});

const port = process.env.PORT || 5050;

app.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});

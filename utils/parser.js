const axios = require("axios");

const getFullURL = (url) => {
  let res = url;
  if (!/^(https?:\/\/)/g.test(url)) {
    res = "https://" + res;
  }
  return res;
};

const parse = async (url) => {
  const response = await axios.get(encodeURI(getFullURL(url)).replace(/^([^?#]*).*/, "$1")).catch((err) => {
    console.log(err);
  });

  console.log("hji");

  if (response.status >= 400) {
    throw response;
  }

  const res = { linkImg: "", title: "", text: "", url: encodeURI(getFullURL(url)) };
  const html = response.data;

  const textArr = html.match(
    /<(p|h1|h2|h3|h4|h5|td|b|span|a)[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/(p|h1|h2|h3|h4|h5|td|b|span|a)>/gim
  );
  if (!!textArr && !!textArr.length) {
    res.text = textArr
      .join(" ")
      .replaceAll(/<[^>]*>/gim, "")
      .replaceAll(/(  +)|(\r)|(\n)|(\t)|(\\+r)|(\\+n)|(\\+t)|/gim, "");
  }

  const OGImgTags = html.match(/<meta[^>]+og:image[^>]+>/gim);
  if (!!OGImgTags && !!OGImgTags.length) {
    const imgURLs = OGImgTags[0].match(/(https?:\/\/)[^("|')]+("|')/g);

    if (!!imgURLs) {
      const imgURL = imgURLs[0].slice(0, -1);

      const response = await axios
        .get(encodeURI(imgURL).replace(/^([^?#]*).*/, "$1"))
        .then(() => {
          res.linkImg = imgURL;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    if (!!imgTags && !!imgTags.length) {
      const imgTags = html.match(/<img[^>]*\/?>/gim);

      for (let imgTag of imgTags) {
        const imgURLs = imgTag.match(/(https?:\/\/)[^("|')]+("|')/g);

        if (!!imgURLs) {
          const imgURL = imgURLs[0].slice(0, -1);
          const response = await axios
            .get(encodeURI(imgURL).replace(/^([^?#]*).*/, "$1"))
            .then(() => {
              res.linkImg = imgURL;
            })
            .catch((err) => {
              console.log(err);
            });
          if (!!res.linkImg) {
            break;
          }
        }
      }
    }
  }

  const titles = html.match(/<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim);

  if (!!titles) {
    res.title = titles[0].replace(/<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim, "$1");
  }

  return res;
};

module.exports = { parse };

const axios = require("axios");

const getFullURL = (url) => {
  let res = url;
  if (!/^(https?:\/\/)/g.test(url)) {
    res = "https://" + res;
  }
  return res;
};

const parse = async (url) => {
  const response = await axios.get(encodeURI(getFullURL(url)).replace(/^([^?#]*).*/, "$1"));

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

  const linkImgTags = html.match(/<meta[^>]+og:image[^>]+>/gim);

  if (!!linkImgTags && !!linkImgTags.length) {
    const imgURLs = linkImgTags[0].match(/(https?:\/\/)[^("|')]+("|')/g);

    if (!!imgURLs) {
      res.linkImg = imgURLs[0].slice(0, -1);
    }
  }

  const titles = html.match(/<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim);

  if (!!titles) {
    res.title = titles[0].replace(/<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim, "$1");
  }

  return res;
};

module.exports = { parse };

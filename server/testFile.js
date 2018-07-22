var WordPOS = require('wordpos');
var wordpos = new WordPOS();

var paragraphs = "House bottle watch";

var getParts = (paragraph) => {
  wordpos.getPOS(paragraph, (result) => {
    return result;
  });
}

var object = wordpos.getPOS("House Bottle Watch", (result) => {
  return result;
});
object.then((result) => {
  console.log(result);
});

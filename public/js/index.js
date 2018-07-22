var socket = io();
var p = document.getElementById('question');

var words = ["nouns", "adjectives", "verbs", "adverbs"];

var question = "nouns", beginning = true;
p.innerHTML = `Enter a noun`;

function input () {
  if(beginning) {
    var partOfSentence = words[Math.floor(Math.random() * 4)];
    console.log(partOfSentence);
    printQuestion(partOfSentence);
    var word = jQuery('#input').val();
    socket.emit('input', {word, question});
    question = partOfSentence;
    jQuery('#input').val();
    return beginning = false;
  }
  partOfSentence = words[Math.floor(Math.random() * 4)];
  printQuestion(partOfSentence);
  console.log(partOfSentence);
  word = jQuery('#input').val();
  socket.emit('input', {word, question});
  question = partOfSentence;
  jQuery('#input').val();
}

socket.on('result', function (string) {
  var h3 = jQuery('#h3');
  var h2 = jQuery('#h2');
  h2.html(string.title)
  h3.html(string.newString);
});

function printQuestion(partOfSentence) {
  if(partOfSentence === 'nouns') {
    return p.innerHTML = `Enter a noun`;
  } else if (partOfSentence === 'verbs') {
    return p.innerHTML = 'Enter a verb';
  } else if (partOfSentence === 'adverbs') {
    return p.innerHTML = 'Enter an adverb';
  } else if (partOfSentence === 'adjectives') {
    return p.innerHTML = 'Enter an adjective';
  }
}

jQuery('#submit').on('click', input);

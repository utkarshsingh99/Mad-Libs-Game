const express = require('express');
var WordPOS = require('wordpos');
var wordpos = new WordPOS();
const socketIO = require('socket.io');
const http = require('http');

var app = express();
app.use(express.static('public'));
var server = http.createServer(app);
var io = socketIO(server);
// app.use(bodyParser.text());

var paragraphs = [
  ["How to Shave",
"Choose disposable razors for convenience and price. While the skin is protected from all but the sharp edge of the blade, it's still important to use these carefully; nicks and cuts are common mistakes made by even the most experienced of men. Disposable razors are cheap and — no surprise here — disposable. They are best purchased in bulk and discarded after five or fewer uses, after which time the blade or blades become dull. hoose multi-blade razors for added efficiency. These razors are usually outfitted with interchangeable, disposable blade cartridges; sometimes, the entire razor (including the handle) can be thrown away after use."],
  ["How to flirt",
"Make eye contact. Eye contact is a key flirting technique which can be implemented anywhere, at any time, as long as your crush is in sight. Studies have shown that smiling actually makes you more attractive to other people, so work that to your advantage by flashing those pearly whites!Even if you haven't opened your mouth, you can say a great deal using just your body language. In order to flirt, you need to be around the object of your affection as often as possible. Make a conscious effort to put yourself in his path, without seeming too obvious. "],
  ["A Letter to Brother",
  "My dear brother, Aslam-o-Alaikum! I received your letter. I am glad to know that you are in good health. You have inquired me about my health. On the 10th of last month, I had a sudden attack of typhoid. Doctor Afzal Hashmi treated me for ten days. I took medicine regularly. After complete bed rest for 10 days I recovered. Now I am all right. I am taking good care of my diet and exercise. I am going to School regularly. You need not worry about me."],
  ["The giant panda",
  "The giant panda is a bear native to south central China. It is easily recognized by the large, distinctive black patches around its eyes, over the ears, and across its round body. Giant pandas in the wild will occasionally eat other grasses, wild tubers, or even meat in the form of birds, rodents, or carrion. In captivity, they may receive honey, eggs, fish, yams, shrub leaves, oranges, or bananas along with specially prepared food. While the dragon has often served as China's national symbol, internationally the giant panda appears at least as commonly. The giant panda has luxuriant black-and-white fur. Adults measure around 1.2 to 1.9 m"],
  ["To Kill a Mockingbird",
  "“Atticus said to Jem one day, “I’d rather you shot at tin cans in the backyard, but I know you’ll go after birds. Shoot all the blue jays you want, if you can hit ‘em, but remember it’s a sin to kill a mockingbird.” That was the only time I ever heard Atticus say it was a sin to do something, and I asked Miss Maudie about it. “Your father’s right,” she said. “Mockingbirds don’t do one thing except make music for us to enjoy. They don’t eat up people’s gardens, don’t nest in corn cribs, they don’t do one thing but sing their hearts out for us. That’s why it’s a sin to kill a mockingbird.”"],
  ["In Search of Lost Time",
  "“We believe that we can change the things around us in accordance with our desires—we believe it because otherwise we can see no favourable outcome. We do not think of the outcome which generally comes to pass and is also favourable: we do not succeed in changing things in accordance with our desires, but gradually our desires change. The situation that we hoped to change because it was intolerable becomes unimportant to us. We have failed to surmount the obstacle, as we were absolutely determined to do, but life has taken us round it, led us beyond it, and then if we turn round to gaze into the distance of the past, we can barely see it, so imperceptible has it become.”"]
];
var socketCalls = 0;

var inputWords = {
  nouns: [],
  adjectives: [],
  adverbs: [],
  verbs: []
}, words = ["nouns", "adjectives", "verbs", "adverbs"];
var newString;

var choosePara = () => {
  var num = Math.floor(Math.random() * 6);
  return paragraphs[num];
};

io.on('connection', (socket) => {
  socket.on('input', (data) => {
    inputWords[data.question].push(data.word);
    socketCalls++;
    console.log(socketCalls);
    if(socketCalls === 10){
      var chosenOne = choosePara();
      var object = wordpos.getPOS(chosenOne[1], (result) => {
        return result;
      });
      object.then((res) => {
        res.nouns = res.nouns.filter(val => !res.verbs.includes(val));          //Exclude common elements
        res.verbs = res.verbs.filter(val => !res.adjectives.includes(val));
        res.adjectives = res.adjectives.filter(val => !res.adverbs.includes(val));
        return res;
      }).then((res) => {
        console.log(inputWords);
        for(var j = 0; j < 4; j++){
          for(var i = 0; i < inputWords[words[j]].length; i++) {
            newString = chosenOne[1].replace(res[words[j]][i], inputWords[words[j]][i]);
            chosenOne[1]= newString;
          }
         }
         return socket.emit('result', {newString, title: chosenOne[0]});
      });
    }
  });
});

server.listen(3000, () => {
  console.log(`Port up & running`);
});

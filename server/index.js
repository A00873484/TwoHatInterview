const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const fs = require('fs');
const readline = require('readline');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

async function processLineByLine() {
  const fileStream = fs.createReadStream('server/data.json');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  let repeats = {}, arr = [], players = {}
  for await (const line of rl) {
    const inst = JSON.parse(line)

    // arr
    arr.push(inst)

    // repeats
    if(repeats[inst.simplified]){
      repeats[inst.simplified].push(inst)
    } else {
      repeats[inst.simplified] = []
      repeats[inst.simplified].push(inst)
    }

    // players
    if(players[inst.player]){
      players[inst.player].push(inst)
    } else {
      players[inst.player] = []
      players[inst.player].push(inst)
    }

  }
  return {repeats, arr, players}
}

let data = {}
processLineByLine().then((res => data = res));

app.get('/api/data', async (req, res) => {
  //console.log(Object.keys(data).reduce((compiled, key) => ({ ...compiled, ...data[key]})))
  res.setHeader('Content-Type', 'application/json');
  res.send(data.arr)
});

app.get('/api/player', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(data.players[req.query.player])
})

app.get('/api/search', (req, res) => {
  const keys = Object.keys(data.repeats)
  const search = req.query.search.toLowerCase()
  const results = keys.filter(inst => inst.toLowerCase().includes(search))

  var merged = [].concat.apply([], results.map(key=>data.repeats[key]));

  res.setHeader('Content-Type', 'application/json');
  res.send(merged)
})

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
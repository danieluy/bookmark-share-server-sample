const express = require('express');
const storage = require('./storage');
const app = express();
const bodyParser = require('body-parser');
const jsonWebToken = require('jsonwebtoken');
const expressBearerToken = require('express-bearer-token');
const PORT = process.env.PORT || 3003;
const NOT_A_REAL_SECRET = 'NOT_A_REAL_SECRET';

app.use(bodyParser.json());
app.use(expressBearerToken());

app.get('/', isAuth, (req, res) => {
  try {
    const stored = storage.get();
    res.status(200).json(stored);
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/', isAuth, (req, res) => {
  try {
    storage.set(req.body);
    res.status(200).send('Data successfully updated.');
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/login', (req, res) => {
  try {
    const { userName, password } = req.body;
    /**
     * Here is where you are supossed to authenticate your user's name and password
     * If not authorized respond with res.status(401).send('Unauthorized.');
     */
    const jwt = jsonWebToken.sign({ userName }, NOT_A_REAL_SECRET);
    res.status(200).json({ jwt });
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => console.log(`BookmarkSync Server Sample listening on: http://localhost:${PORT}`));

function isAuth(req, res, next) {
  // Token sould be on the header Authorization
  try {
    if (req.method === 'OPTIONS') {
      return res.send(200);
    }
    if (!req.token) {
      return res.status(401).send('Unauthorized.');
    }
    jsonWebToken.verify(req.token, NOT_A_REAL_SECRET, (err, user) => {
      if (err) {
        return res.status(500).send('Failed to authenticate token.');
      }
      req.user = user;
      next();
    });
  }
  catch (err) {
    return res.status(500).send('Failed to authenticate token.');
  }
}

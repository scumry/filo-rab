const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const md5 = require('md5');
const multer = require('multer');
const path = require('path');
const sqlite3 = require("sqlite3");
const cors = require("cors");
const db = new sqlite3.Database('user.db');
const jwt = require('jsonwebtoken');
const secret = 'users-auth';
const session = require('express-session');

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const jsonParser = express.json();

app.listen(8000, function () {
  console.log('Сервер запущен на 8000 порту');
});

app.post("/users/register", jsonParser, (req, res) => {
  const { email, login, password } = req.body;
  const createNewUser = () => {
    const token = jwt.sign({
      email: user.email
    }, secret, {
      expiresIn: 86400
    });
    db.run(`INSERT INTO users (login, password, email, token) VALUES("${login}", "${md5(password)}", "${email}", "${token}")`);

    db.get(`SELECT * FROM users WHERE login = "${login}"`, (err, data) => {
      res.status(201).json({
        data: {
          user: data,
          token
        }
      });
    });
  }

  db.get(`SELECT * FROM users WHERE email = "${email}"`, (err, data) => {
    if (err) {
      console.log('error:', err);
    }
    if (data) {
      return res.status(409).json({
        error: "Пользователь с таким email уже существует"
      });
    }

    createNewUser();
  });
});

app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${md5(password)}';`;

  db.get(sql, (err, row) => {
    if (err) {
      console.log(err.message);
      res.status(500).send('Ошибка входа.');
    } else if (row === undefined) {
      res.status(401).send('Неверная почта или пароль.');
    } else {
      const token = jwt.sign({
        email: user.email
      }, secret, {
        expiresIn: 86000
      });
      return res.json({
        data: {
          user,
          token
        }
      });
    }
  });
});

app.post('/login/checkpassword', (req, res) => {
  const { login, password } = req.body;

  db.get('SELECT * FROM users WHERE login = ? AND password = ?', [login, md5(password)], (err, row) => {
    if (err || !row) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

app.get('/users/:login', (req, res) => {
  const { login } = req.params;

  db.all(`SELECT token FROM users WHERE login = ?`, login, (err, row) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    res.send(row);
  });
});

app.get('/check/email/login', (req, res) => {
  db.all(`SELECT email, login, password, token FROM users`, (err, rows) => {
    res.json(rows);
  });
});
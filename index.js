const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();


// Middleware to parse JSON body
app.use(bodyParser.json());

// Serve home.html
router.get('/home', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});

// Return all details from user.json
router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading user data');
    }
    res.json(JSON.parse(data));
  });
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading user data');
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.json({ status: false, message: "User Name is invalid" });
    }

    if (user.password !== password) {
      return res.json({ status: false, message: "Password is invalid" });
    }

    res.json({ status: true, message: "User Is valid" });
  });
});

// Logout route
router.get('/logout/:username', (req, res) => {
  const { username } = req.params;
  res.send(`<b>${username} successfully logout.</b>`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

// Use the router
app.use('/', router);

// Start the server
app.listen(process.env.PORT || 8081, () => {
  console.log('Web Server is listening at port ' + (process.env.PORT || 8081));
});
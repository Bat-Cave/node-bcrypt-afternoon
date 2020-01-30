require('dotenv').config();
const express = require('express'),
      session = require('express-session'),
      massive = require('massive'),
      {CONNECTION_STRING, SESSION_SECRET} = process.env,
      authCtrl = require('./controllers/authController'),
      treasureCtrl = require('./controllers/treasureController'),
      auth = require('./middleware/authMiddleware'),
      app = express(),
      port = 4000;

app.use(express.json());

app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: SESSION_SECRET
}))

//ENDPOINTS
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);



massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
  console.log('Database connected.');
  app.listen(port, () => console.log(`Server running on ${port}`));
})



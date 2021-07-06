// adding express
const express = require("express");
const app = express();

// adding sqlite
const sqlite3 = require("sqlite3").verbose();

// setting up express
app.listen(3000, () => console.log("listening at localhost:3000"));
app.use(express.static("."));
app.use(express.json());

// connecting to database
let db = new sqlite3.Database("./Database/data.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

// checking if tables exist
db.run("SELECT * FROM USERS", (err, result) => {
  if (err) {
    //executing commands to create tables
    console.log("Tables are not present, creating tables");
    db.run(
      "create table users(username varchar(30), password varchar(30), email varchar(30), mobile varchar(13), subscription varchar(20), usertype varchar(6), primary key(username));"
    );
    db.run(
      "create table songs(songName varchar(20), songId integer, duration varchar(10), genre varchar(20), artistName varchar(30), views integer, likes integer, coverImageURL varchar(100), audioURL varchar(100), primary key(songId));"
    );
    db.run(
      "create table history(username varchar(20), songId varchar(20), timestamp varchar(20));"
    );
    db.run(
      "create table likedSongs(username varchar(30), songId varchar(20));"
    );
  } else {
    console.log("Tables exist");
  }
});

// login handling
app.post("/login", (request, response) => {
  console.log(request.body);
  response.send("Got login credentials");
});

// registration handling
app.post("/register", (request, response) => {
  let resp = { status: "Got register credentials", valid: false };

  let validUser = false;
  db.all(
    `select username from users where username= '${request.body.username}'`,
    (err, rows) => {
      if (rows.length == 0) {
        validUser = true;
      }
      resp.valid = validUser;
      response.send(resp);
      const insertQuery =
        "INSERT INTO USERS VALUES('" +
        request.body.username +
        "', '" +
        request.body.password +
        "', '" +
        request.body.email +
        "', '" +
        request.body.mobile +
        "', 'base' , '" +
        request.body.userType +
        "')";
      if (validUser) {
        db.run(insertQuery);
      }
    }
  );
});

// closing the database
// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Closed the database connection.");
// });

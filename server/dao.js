var mysql = require('mysql');
var fs = require('fs');

//Set up the connection to the database
var con = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "N1ch0l@s",
  database: "meme"
});

//Creates a meme table on the database to store all given memes
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  var createTable = "CREATE TABLE IF NOT EXISTS meme (id INT AUTO_INCREMENT, meme MEDIUMBLOB, name VARCHAR(256), PRIMARY KEY(id));";
  con.query(createTable, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

module.exports = {

  //Inserts a given meme into the database after encrypting it
  insertMeme: function (meme) {
    var data = fs.readFileSync(meme.path);
    var name = Rot31(meme.filename);

    con.query("INSERT INTO meme (meme, name) VALUES( ? )", [[data, name]],
    function (err, result) {
      if (err) throw err;
    });
  },

  //Gets a random meme from the database and returns it to app.js
  getRandomMeme: function () {
    return new Promise(function(resolve, reject) {
      con.query("SELECT * FROM meme;", async function(err, result) {
        if (err) throw err;
  
        randIndex = Math.floor(Math.random() * Math.floor(result.length));
        var name = Rot31(result[randIndex]["name"]);
        var data = result[randIndex]["meme"];

        //makes the blob from the database into a file that can be grabbed from index.html
        //All information is decrypted after being grabbed from the database
        const img = fs.writeFile("../public/img/" + name, data, function(err) {
          if (err) throw err;
        });
        //Returns the name of the file to look up
        resolve(name);
      });
    });
  }
};

//automatically encrypts and decrypts any given string
function Rot31(_input) {
  var alphabet = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789";
  var input = String(_input);

  var output = "";
  for (var i = 0; i < input.length; i++) {
      for (var j = 0; j < alphabet.length; j++) {
          if (input[i] == alphabet[j]) {
              break;
          }
      }
      if (j >= alphabet.length) {
          output += input[i];
      } else {
          output += alphabet[j + 31];
      }
  }
  return output;
}

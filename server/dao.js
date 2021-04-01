var mysql = require('mysql');
var fs = require('fs');

var con = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "N1ch0l@s",
  database: "meme"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  var createTable = "CREATE TABLE IF NOT EXISTS meme (id INT AUTO_INCREMENT, meme MEDIUMBLOB, type VARCHAR(25), name VARCHAR(256), PRIMARY KEY(id));";
  con.query(createTable, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

module.exports = {
  deleteRating: function (ratee, stars, comment) {
    //TODO
    console.log("Called Delete Rating");
  },
  
  getAllRatings: async function() {
    return new Promise(function (resolve, reject) {
      let ratings = "";

      con.query("SELECT * FROM rating;", function (err, result) {
        if (err) throw err;

        for (let i = 0; i < result.length; i++) {
          ratings += '<span id="span-' + i + '">';
          ratings += "Item Rated: ";
          ratings += result[i]["ratee"];
          ratings += "<br />";
          ratings += result[i]["stars"];
          ratings += " Stars<br />";
          ratings += result[i]["comment"];
          ratings += "<br />";
          ratings += "<br />";
          ratings += "</span>";
          ratings += "\n";
        }

        resolve(ratings);
      });
  });
  },
  
  insertRating: function (ratee, stars, comment) {
    con.query("INSERT INTO rating VALUES ( ? )", [[ratee, stars, comment]], 
    function (err, result) {
        if (err) throw err;
    });    
  },

  insertMeme: function (meme) {
    con.query("INSERT INTO meme (meme, type, name) VALUES( ? )", [[fs.readFileSync(meme.path), Rot13(meme.mimetype), Rot13(meme.filename)]],
    function (err, result) {
      if (err) throw err;
    });
  },
  getRandomMeme: function () {
    console.log("Getting random meme:");
    return new Promise(function(resolve, reject) {
      con.query("SELECT * FROM meme;", async function(err, result) {
        if (err) throw err;
  
        randIndex = Math.floor(Math.random() * Math.floor(result.length));
        var extension = Rot13(result[randIndex]["type"]);
        extension = extension.split("/").pop();

        const img = fs.writeFile("../public/img/" + Rot13(result[randIndex]["name"]), result[randIndex]["meme"], function(err) {
          if (err) throw err;
        });
        resolve(Rot13(result[randIndex]["name"]));
      });
    });
  }
};

function Rot13(_input) {
  var alphabet = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
  var input = String(_input).toLowerCase();

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
          output += alphabet[j + 13];
      }
  }
  return output;
}
// function RevRot13(input) {
//   return new Promise(function(resolve, reject) {
//     var alphabet = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789";

//     var output = "";
//     for (var i = 0; i < input.length; i++) {
//         for (var j = alphabet.length - 1; j >= 0; j--) {
//             if (input[i] == alphabet[j]) {
//                 break;
//             }
//         }
//         if (j < alphabet.length) {
//             output += input[i];
//         } else {
//             output += alphabet[j - 13];
//         }
//     }
//     console.log(output);
//     resolve(output);
//   });
// }

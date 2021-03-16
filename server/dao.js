var mysql = require('mysql');
var fs = require('fs');

var con = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "N1ch0l@s",
  database: "yelp"
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
    con.query("INSERT INTO meme (meme, type, name) VALUES( ? )", [[fs.readFileSync(meme.path), meme.mimetype, meme.filename]],
    function (err, result) {
      if (err) throw err;
    });
  },
  getRandomMeme: function () {
    return new Promise(function(resolve, reject) {
      con.query("SELECT * FROM meme;", function(err, result) {
        if (err) throw err;
  
        randIndex = Math.floor(Math.random() * Math.floor(result.length));
        const extension = result[randIndex]["type"].split("/").pop();

        const img = fs.writeFile("../public/img/" + result[randIndex]["name"], result[randIndex]["meme"], function(err) {
          if (err) throw err;
        });
        resolve(result[randIndex]["name"]);
      });
    });
  }
};

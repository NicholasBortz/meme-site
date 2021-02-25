var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "N1ch0l@s",
  database: "yelp"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  var createTable = "CREATE TABLE IF NOT EXISTS meme (id INT AUTO_INCREMENT, url VARCHAR(2083), PRIMARY KEY(id));";
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

  insertMeme: function (filePath) {
    con.query("INSERT INTO meme (url) VALUES( ? )", filePath,
      function (err, result) {
        if (err) throw err;
      });
  },
  getRandomMeme: function () {
    return new Promise(function(resolve, reject) {
      con.query("SELECT * FROM meme;", function(err, result) {
        if (err) throw err;
  
        randIndex = Math.floor(Math.random() * Math.floor(result.length));

        resolve(result[randIndex]["url"]);
      });
    });
  }
};

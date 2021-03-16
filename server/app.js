const express = require('express');
const multer = require('multer');
const helpers = require('./helpers');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { response } = require('express');
const dao = require('./dao');
const { Console, debug } = require('console');
const fs = require('fs');
const { Http2ServerRequest } = require('http2');
// const dao = require('./dao.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve('../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).sendFile('index.html', {
        root: path.resolve('../public')
    });
});

const storage = multer.diskStorage({
    destination: function(request, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(request, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.get('/whichIsBetter', (req, res)  => {
    //flip a coin, if heads return Marvel, if tals return DC
    var rand = Math.random();
    var result = "Marvel";
    if (rand < 0.5) {
        result = "DC";
    }

    res.status(200).send(result);
})

app.get('/insertRating', (request, response)  => {
    
    // var ratee = request.query.ratee;
    // var stars = request.query.stars;
    // var comment = request.query.comment;
    
    // dao.insertRating(ratee, stars, comment);

    response.status(200).send( {});
})

app.get('/getRatings', async (request, response) => {
    // var ratings = await dao.getAllRatings();
    // console.log(ratings);
    // response.status(200).send(ratings);
    response.status(200).send( {});
})

app.get('/crewOrImp', (request, response) => {
    var rand = Math.random();
    if (rand < 0.5) {
        var imgTag = "<img id='among' src='data:image/jpeg;base64,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' alt='red'>";
    } else {
        var imgTag = "<img id='among' src='data:image/png;base64,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' alt='cyan'>";
    }

    response.status(200).send(imgTag);
})

app.get('/insertMeme', (request, response) => {
    console.log("inserting meme");
    var url = request.query.filepath;
    console.log("URL: " + url);

    dao.insertMeme(url);
    response.status(200).send( {} );
})

app.get('/getMeme', async (request, response) => {
    fs.readdir("../public/img", (err, files) => {
        files.forEach(file => {
            fs.unlink("../public/img/" + file, (err => {
                if (err) console.log(err);
            }));
        });
    });

    var randomMeme = await dao.getRandomMeme();
    randomMeme = "<image id='meme' src='img/" + randomMeme + "'>";
    response.status(200).send(randomMeme);
})

app.post('/meme', function(request, response, next) {
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('meme');
    upload(request, response, function(err) {
        if (request.fileValidationError) {
            return response.send(request.fileValidationError);
        } else if (!request.file) {
            return response.send('Please select a meme to upload');
        } else if (err instanceof multer.MulterError) {
            return response.send(err);
        } else if (err) {
            return response.send(err);
        }
        dao.insertMeme(request.file);
        fs.unlink(request.file.path, (err => {
            if (err) console.log(err);
        }));
    });

    response.redirect('http://localhost:3000/index.html');

    response.end();
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

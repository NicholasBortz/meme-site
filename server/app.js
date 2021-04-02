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

//Set up the storage folder for input memes
const storage = multer.diskStorage({
    destination: function(request, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(request, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Ask dao for a random meme from the database
app.get('/getMeme', async (request, response) => {
    clearDirectory("../public/img");

    var randomMeme = await dao.getRandomMeme();
    response.status(200).send(randomMeme);
})

//Send the meme file to the dao for insertion into database
app.post('/meme', async function(request, response, next) {
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('meme');
    upload(request, response, function(err) {
        checkErrors(request, response, err);

        dao.insertMeme(request.file);
        fs.unlink(request.file.path, (err => { if (err) console.log(err); }));

        response.redirect('http://localhost:3000/index.html');
        response.end();
    });
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

//Clears all files in a given directory
function clearDirectory(dir) {
    fs.readdir(dir, (err, files) => {
        files.forEach(file => {
            fs.unlink(dir + "/" + file, (err => {
                if (err) console.log(err);
            }));
        });
    });
}

//Checks for errors when an input meme is given
function checkErrors(request, response, err) {
    if (request.fileValidationError) {
        return response.send(request.fileValidationError);
    } else if (!request.file) {
        return response.send('Please select a meme to upload');
    } else if (err instanceof multer.MulterError) {
        return response.send(err);
    } else if (err) {
        return response.send(err);
    }
}

const app = require('express')()
const path = require('path');
var bodyParser = require('body-parser');
const multer = require('multer')
const fs = require('fs')

const parseImage = require('./parseImage')
const processImage = require('./processImage')

app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

const uploadFolder = path.join(__dirname + '/uploads')
const outputFolder = path.join(__dirname + '/out')

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    onError: function (err, next) {
        next(err);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1])
    }
})
const upload = multer({ storage: storage })



app.post('/GetMrzSingle', upload.single('photo'), async (req, res) => {
    if (req.file) {
        await processImage(path.join(__dirname + '/uploads/' + req.file.filename)).catch(console.error);
        await parseImage(path.join(__dirname + '/out/crop/' + req.file.filename)).then(result => {
            res.send({ status: true, message: result.mrz })
        }).catch(err => {
            res.status(500).send({ status: false, message: err })
        })
    } else {
        res.status(400).send({ status: false, message: 'No Image found' })
    }
})
app.post('/GetMrzMulti', upload.array('photos', 100), async (req, res) => {
    if (req.files) {
        finalResultsArray = []
        for (const image of req.files) {
            await processImage(path.join(__dirname + '/uploads/' + image.filename)).catch(console.error);
            await parseImage(path.join(__dirname + '/out/crop/' + image.filename)).then(result => {
                finalResultsArray.push(result.mrz)
            }).catch(err => {
                res.status(500).send({ status: false, message: err })
            })
        }
        res.send({ status: true, message: finalResultsArray })
    } else {
        res.status(400).send({ status: false, message: 'No Image found' })
    }
})

app.use((err, req, res, next) => {
    res.status(400).send({ status: false, message: 'Multer : ' + err.message })
})

app.listen(3000, () => {
    console.log("Server is running");
})
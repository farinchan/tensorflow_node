const express = require("express");
const TeachableMachine = require("@sashido/teachablemachine-node");
const { formatDate } = require("./format_date");

const app = express();
const port = 4000;

app.use(express.static('public'))
app.use('/public', express.static('public'));

//MULTER - File Upload
const multer = require('multer')
var storage = multer.diskStorage(
  {
    destination: './public/uploads',
    filename: function (req, file, cb) {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      // cb(null, file.originalname + "." + extension);
      cb(null, file.originalname);
      // cb(null, formatDate(new Date) + "." + extension);
    }
  }
);
const upload = multer({ storage })

const model = new TeachableMachine({
  //pendeteksi tidur
  modelUrl: "https://teachablemachine.withgoogle.com/models/5W6yzY_mS/"
});

app.post("/classify", upload.single("foto"), async (req, res) => {

  const foto = req.file !== undefined ? req.body.foto = req.file.filename : ''

  console.log(JSON.stringify(req.body));

  return model.classify({
    imageUrl: `http://localhost:4000/public/uploads/${foto}`,
  }).then((predictions) => {
    console.log(predictions);
    return res.json({
      status: "ok",
      predictions
    });
  }).catch((e) => {
    console.error(e);
    res.status(500).json({
      status: "failed"
    })
  });


});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
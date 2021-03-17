require("dotenv").config();
const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
const { registerFont, createCanvas } = require("canvas");
registerFont('./Roboto-Black.ttf',{family: 'Roboto' })
let arbitraryRandom = (min, max) => Math.random() * (max - min) + min;
let randomRotation = (degrees = 10) =>
  (arbitraryRandom(-degrees, degrees) * Math.PI) / 180;
function makenumber(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.get("/img", (req, res) => {
  try {
    let query = req.query;
    let code = query.code;
    let headers = req.headers;
    if (!code) {
      res.status(403);
      res.end("");
    }
    if (!headers.key) {
      res.status(403);
      res.end("");
    }
    if (headers.key) {
      let key = process.env.key;
      if (headers.key !== key) {
        res.status(403);
        res.end("");
      }
    }
    let WIDTH = 100;
    let HEIGHT = 50;
    let canvas = createCanvas(WIDTH, HEIGHT);
    let cv = canvas.getContext("2d");
    let fileName = `${Date.now()}.png`;
    cv.rotate(randomRotation());
    cv.fillStyle = "#ffff";
    cv.fillRect(0, 0, WIDTH, HEIGHT);
    cv.beginPath();
    cv.moveTo(0, 0);
    for (let i = 0; i < makenumber(1) * 2; i++) {
      cv.lineTo(makenumber(3), makenumber(3));
      cv.moveTo(makenumber(i * i), makenumber(i * i + 2));
      cv.lineTo(makenumber(i * i + 1), makenumber(i * i));
    }
    cv.strokeStyle = "#" + makenumber(3);
    cv.lineWidth = 3;
    cv.stroke();
    cv.fillStyle = "#" + makenumber(3);
    cv.font = "30px Roboto";
    cv.fillText(code, 15, 35);
    cv.textAlign = "center";
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(`./${fileName}`, buffer);
    res.status(200);
    res.sendFile(`${fileName}`, { root: __dirname });
    //res.end("");
    /*setTimeout(()=>{
      fs.unlinkSync(`${fileName}`)
    },10000)*/
  } catch (error) {
    //console.log(error);
  }
});
app.get("/", (req, res) => {
  res.status(403);
  res.end();
});
app.get("/dir", (req, res) => {
  try {
    let headers = req.headers
    if(!headers.key){
    res.status(403)
    res.end('')
  }
  if(headers.key){
    let key = process.env.key
    if(headers.key !== key){
      res.status(403)
      res.end('')
    }
   }
    let dir = fs.readdirSync("./");
    res.status(200).send(dir);
  } catch (error) {}
});

app.listen(port, () => {
  console.log("listening..");
});

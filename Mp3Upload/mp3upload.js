const router = require("express").Router();
const multer = require('multer');

const config = require("../config")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, config.TRACKS_PATH);
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

function fileFilter (req, file, cb) {

  if(file.originalname.includes(".mp3")){
    console.log(file.originalname)
    console.log(typeof file.originalname)
    cb(null, true)
  }else{
    console.log("Not mp3 file")
    cb(null, false)
  }
}

let upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
}).array('songs', 20)

router.post('/radio', (req, res)=>{
  try{
    upload(req, res, function(err){
      if(err){
        console.log(err)
        res.json({error: "Error occured"})
        return;
      }
      res.redirect("/");
    });

  }catch(catcherr){
    console.log({catcherr})
  }
})

router.get('/radio', (req, res) =>{
  res.sendFile(__dirname + '/index.html');
});

module.exports = router
var express = require('express');
var router = express.Router();
var fs = require("fs");

// start by creating data so we don't have to type it in each time
let serverArray = [];

// define a constructor to create movie objects
let PlantObject = function (pName, plightRequirement, phumidityLevel, pwaterRequirement) {
    //this.ID = plantArray.length+1;
    this.ID = Math.random().toString(16).slice(5);

    this.name = pName;
    this.light = plightRequirement;
    this.humidity = phumidityLevel;
    this.water =pwaterRequirement;
}


let fileManager  = {
  read: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    let goodData = JSON.parse(rawdata);
    serverArray = goodData;
  },

  write: function() {
    let data = JSON.stringify(serverArray);
    fs.writeFileSync('objectdata.json', data);
  },

  validData: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    console.log(rawdata.length);
    if(rawdata.length < 1) {
      return false;
    }
    else {
      return true;
    }
  }
};
  


if(!fileManager.validData()) {
serverArray.push(new PlantObject("Banana", "high", "high", "Daily"));

fileManager.write();
}
else {
  fileManager.read(); // do have prior plants so load up the array
}

console.log(serverArray);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});


/* GET all plant data */
router.get('/getAllPlants', function(req, res) {
  fileManager.read();
  
  res.status(200).json(serverArray);
});

/* Add one new plant */
router.post('/AddPlant', function(req, res) {
  const newPlant = req.body;
  serverArray.push(newPlant);
  fileManager.write();
  res.status(200).json(newPlant);
});



// add route for delete
router.delete('/DeletePlant/:ID', (req, res) => {
  const delID = req.params.ID;
  let pointer = GetObjectPointer(delID);
  if(pointer == -1){    // if did not find movie in array
      console.log("not found");
      return res.status(500).json({
          status: "error - no such ID"
       });
  }
else {    // if did find the plant
    serverArray.splice(pointer, 1);  // remove 1 element at index 
    fileManager.write();
    res.send('Plant with ID: ' + delID + ' deleted!');
}
});


function GetObjectPointer(whichID){
  for(i=0; i< serverArray.length; i++){
      if(serverArray[i].ID == whichID){
          return i;
      }
  }
  return -1;
}


module.exports = router;

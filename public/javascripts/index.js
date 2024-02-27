// start by creating data so we don't have to type it in each time
let plantArray = [];

// define a constructor to create plant objects
let PlantObject = function (pName, plightRequirement, phumidityLevel, pwaterRequirement) {
    //this.ID = plantArray.length+1;
    this.ID = Math.random().toString(16).slice(5);

    this.name = pName;
    this.light = plightRequirement;
    this.humidity = phumidityLevel;
    this.water =pwaterRequirement;
}
let waterOptions = {
    "onceAWeek": "Once or Twice a Week",
    "Daily": "Daily",
    "onceAMonth": "Once or Twice a Month"
};
let selectedType = "";


document.addEventListener("DOMContentLoaded", function () {

    createList();

// add button events ************************************************************************
    
    document.getElementById("addPlant").addEventListener("click", function () {
        let newPlant = new PlantObject(document.getElementById("plantName").value, 
        document.getElementById("lightRequirement").value,
        document.getElementById("humidityLevel").value,
        selectedType);
        
        //document.location.href = "index.html#ListAll";
        // also add the URL value
    // push new object to server

       //=======================================
       $.ajax({
        url : "/AddPlant",
        type: "POST",
        data: JSON.stringify(newPlant),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            console.log(result);
            $.mobile.changePage("#ListAll", { transition: "flip" });
            },
        error: function (xhr, textStatus, errorThrown) {  
            alert("Server could not add Plant: " + newPlant.name);
            alert(textStatus + " " + errorThrown);
            }
    });

    });
    
    // document.getElementById("buttonClear").addEventListener("click", function () {
    //     document.getElementById("plantName").value = "";
    //     document.getElementById("lightRequirement").value = "";
    //     document.getElementById("humidityLevel").value = "";
    //     //
    // });

    // document.addEventListener("change", function(event) {
    //     if (event.target.id === "select-type") {
    //         selectedGenre = event.target.value;
    //     }
    // });



    // document.getElementById("buttonSortTitle").addEventListener("click", function () {
    //     movieArray.sort(dynamicSort("Title"));
    //     createList();
    //     document.location.href = "index.html#ListAll";
    // });

    // document.getElementById("buttonSortGenre").addEventListener("click", function () {
    //     movieArray.sort(dynamicSort("Genre"));
    //     createList();
    //     document.location.href = "index.html#ListAll";
    // });

    // button on details page to view the youtube video
    // document.getElementById("trailer").addEventListener("click", function () {
    //     window.open(document.getElementById("oneURL").innerHTML);
    // });


     // button on details page to delete
//      document.getElementById("delete").addEventListener("click", function () {
//         let plantID = localStorage.getItem('parm');
//         $.ajax({
//             type: "DELETE",
//             url: "/DeletePlant/" +plantID,
//             success: function(result){
//                 alert(result);
//             },
//             error: function (xhr, textStatus, errorThrown) {  
//                 alert("Server could not delete plant with ID " + ID)
//             }  
//         });
            
//     });
// // end of add button events ************************************************************************

  
  
// page before show code *************************************************************************
    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#ListAll", function (event) {   // have to use jQuery 
        createList();
        console.log("List page will be shown!");
    });

    $(document).on("pagebeforeshow", "#Load", function (event) {   // have to use jQuery 
        $("#plantName").val("");
        $("#lightRequirement").val("");
        $("#humidityLevel").val("");
        $("#select-type").val("");
        console.log("Load page will be shown!");
    });



    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#details", function (event) {   
    let localID = localStorage.getItem('parm');  // get the unique key back from the dictionairy
    // next step to avoid bug in jQuery Mobile,  force the movie array to be current
    plantArray = JSON.parse(localStorage.getItem('plantArray'));  
    
    let pointer = GetObjectPointer(localID);
    console.log(pointer);
    
   

      
    document.getElementById("plantName").innerHTML = "Plant Name: " + plantArray[pointer].name;
    document.getElementById("lightRequirement").innerHTML = "Light Requirement: " + plantArray[pointer].light;
    document.getElementById("humidityLevel").innerHTML = "Humidity Level: " + plantArray[pointer].humidity;
    document.getElementById("select-type").innerHTML = "Water Requirement: " + plantArray[pointer].water;
    
    });
 
// end of page before show code *************************************************************************

});  
// end of wait until document has loaded event  *************************************************************************

function GetObjectPointer(whichID){
    for(i=0; i< plantArray.length; i++){
        if(plantArray[i].ID = whichID){
            return i;
        }
    }
}

function createList() {
    // clear prior data
   let myUL =document.getElementById("myul");
   myUL.innerHTML = "";
   
   $.get("/getAllPlants", function(data, status){ // AJAX get
        plantArray = data; // copy returned server json data into local array
    // now INSIDE this “call back” anonymous function, 
    // update the web page with this new data


    plantArray.forEach(function (onePlant) {   // use handy array forEach method
        var myLi = document.createElement('li');
        // adding a class name to each one as a way of creating a collection
        myLi.classList.add('onePlant'); 
        // use the html5 "data-parm" to encode the ID of this particular data object
        // that we are building an li from
        myLi.setAttribute("data-parm", onePlant.ID);
        myLi.innerHTML = onePlant.ID + ":  " + onePlant.name;
        myUL.appendChild(myLi);
    });
   

    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liList = document.getElementsByClassName("onePlant");
    let newPlantArray = Array.from(liList);
    newPlantArray.forEach(function (element) {
        element.addEventListener('click', function () {
        // get that data-parm we added for THIS particular li as we loop thru them
        var parm = this.getAttribute("data-parm");  // passing in the record.Id
        // get our hidden <p> and save THIS ID value in the localStorage "dictionairy"
        localStorage.setItem('parm', parm);
       
       
       
        // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
        // current movie array and save it to localStorage as well.
        let stringPlantArray = JSON.stringify(plantArray); // convert array to "string"
        localStorage.setItem('plantArray', stringPlantArray);
        
        
        // now jump to our page that will use that one item
        document.location.href = "index.html#details";
        });
    });
});

};
  

/**
 *  https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
* Function to sort alphabetically an array of objects by some specific key.
* 
// * @param {String} property Key of the object to sort.
// */
// function dynamicSort(property) {
//     var sortOrder = 1;

//     if (property[0] === "-") {
//         sortOrder = -1;
//         property = property.substr(1);
//     }

//     return function (a, b) {
//         if (sortOrder == -1) {
//             return b[property].localeCompare(a[property]);
//         } else {
//             return a[property].localeCompare(b[property]);
//         }
//     }
// }



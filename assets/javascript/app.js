


alert("what");
console.log("what");
//your code here

var firebaseConfig = {
    apiKey: "AIzaSyCBOq5Yl7GMqCE6M1GPwzjp-7-u3LdTfdU",
    authDomain: "scheduler-cb850.firebaseapp.com",
    databaseURL: "https://scheduler-cb850.firebaseio.com",
    projectId: "scheduler-cb850",
    storageBucket: "scheduler-cb850.appspot.com",
    messagingSenderId: "474869784644",
    appId: "1:474869784644:web:584a6ccb5a6748ba625c11"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0;

function currentTime() {
    var current = moment().format("LT");
    $("#currentTime").html(current);
    setTimeout(currentTime, 1000);
};


$(".form-field").on("keyup", function () {
    var traintemp = $("#train-name").val().trim();
    var destinationtemp = $("#destination-city").val().trim();
    var timetemp = $("#first-train").val().trim();
    var freqtemp = $("#frequency-time").val().trim();

    sessionStorage.setItem("train", traintemp);
    sessionStorage.setItem("city", destinationtemp);
    sessionStorage.setItem("time", timetemp);
    sessionStorage.setItem("freq", freqtemp);
});
$("#train-name").val(sessionStorage.getItem("train"));
$("#destination-city").val(sessionStorage.getItem("city"));
$("#first-train").val(sessionStorage.getItem("time"));
$("#frequency-time").val(sessionStorage.getItem("freq"));


$("#submit").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault();
    // if($("#train-name").val().trim()===""||
    // $("#destination").val().trim()===""||
    // $("#first-train").val().trim()===""||
    // $("#frequency").val().trim()===""){
    //     alert("please fill");
    // }else{




    trainName = $("#train-name").val().trim();
    destination = $("#destination-city").val().trim();
    firstTrain = $("#first-train").val().trim();
    frequency = $("#frequency-time").val().trim();

    $(".form-field").val("");
    // Code in the logic for storing and retrieving the most recent user.
    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        startTime: startTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    // Don't forget to provide initial data to your Firebase database.
    sessionStorage.clear();
    //  }

});

database.ref().on("child_added", function (childSnapshot) {

    //     //moment.js
    var firstTrainNew = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    var remaining = diffTime % childSnapshot.val().frequency;
    //minutes for next train
    var minAway = childSnapshot.val().frequency - remaining;
    //next train time
    var nextTrain = moment().add(minAway, "minutes");
    var key = childSnapshot.key;




    var newrow = $("<tr>");

    newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
    newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
    newrow.append($("<td >" + childSnapshot.val().frequency + "</td>"));
    newrow.append($("<td>" + moment(nextTrain).format("LT") + "</td>"));
    newrow.append($("<td>" + minAway + "</td>"));
    newrow.append($("<td><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));


    if (minAway < 8) {
        newrow.addClass("info");
    }
    $("#train-table-rows").append(newrow);

});

$(document).on("click", ".arrival", function () {
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    window.location.reload();
});

currentTime();


//  function (errorObject) {

//     console.log("Errors handled" + errorObject.code)
// };

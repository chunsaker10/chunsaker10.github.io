var myFeedback = ["Thanks for your feedback","Glad you tried our product","I hope you had a good workout","We are continually improving",
"Hope to see you again","Have a great day","Your feedback is appreciated","We hope you see progress using our generator","Thanks"];
var myResponses;

var signUp = document.querySelector("#sign_up");
signUp.onclick = function (){
  var login_form = document.querySelector("#login_form");
  login_form.style.display = "none";
  var signUpForm = document.querySelector("#signup_form");
  signUpForm.style.display = "block";
  var sign_up_submit = document.querySelector("#sign_up_submit");
  sign_up_submit.onclick = function (){
    console.log("my button was clicked");
    var email = document.querySelector("#email");
    console.log("my Input element ", email);
    console.log("input text element: ", email.value);
    var fname = document.querySelector("#fname");
    var lname = document.querySelector("#lname");
    var psw = document.querySelector("#psw");
    createUser(email.value, fname.value, lname.value, psw.value);
    email.value = "";
    fname.value = "";
    lname.value = "";
    psw.value = "";
  };
};
back_button = document.querySelector("#back_button");
back_button.onclick = function (){
  var login_form = document.querySelector("#login_form");
  login_form.style.display = "block";
  var signUpForm = document.querySelector("#signup_form");
  signUpForm.style.display = "none";
};


var myButton = document.querySelector("#generate-workout-button");
console.log("my button element", myButton);
var myFooterBox = document.querySelector("#footer_box");
console.log("my footer selector:", myFooterBox);
var myElementChange = document.querySelector("#changing_element");
console.log("my changing element:", myElementChange);
//when button is clicked
myButton.onclick = function (){
    console.log("my button was clicked");
    var inputValue = document.querySelector("#workout-input");
    console.log("my Input element ", inputValue);
    console.log("input text element: ", inputValue.value);
    var workoutRating = document.querySelector("#workout-rating");
    var workoutDifficulty = document.querySelector("#workout-difficulty");
    var workoutReps = document.querySelector("#workout-reps");
    console.log("my Input element ", workoutReps);
    console.log("input text element: ", workoutReps.value);
    var workoutSets = document.querySelector("#workout-sets");
    createWorkoutOnServer(inputValue.value, workoutRating.value, workoutDifficulty.value, workoutReps.value, workoutSets.value);
    inputValue.value = "";
    workoutRating.value = "";
    workoutDifficulty.value = "";
    workoutReps.value = "";
    workoutSets.value = "";
    //fills in the ordered list with friendNameInput
    myFooterBox.style.backgroundColor = "#000000";
    myElementChange.innerHTML = "Have a great workout!"
    
};
var feedBackSubmit = document.querySelector("#feedback-input");
var randomButton = document.querySelector("#submit-feedback-button");
randomButton.onclick = function (){
  console.log("random response initiated");
    // random index for a random friend (0 to length of friends array)
    var randomIndex = Math.floor(Math.random() * myFeedback.length);
    // index array of friends: a variable with the string
    var randomResponse = myFeedback[randomIndex];
    // query the span
    var randomNameDiv = document.querySelector("#feedback-response");
    // assign innerHTML of the span to the friend name string
    randomNameDiv.innerHTML = randomResponse;
    feedBackSubmit.value = "";
};

// HOW TO FETCH DATA FROM THE INTERNET
//fetch("https://api.jsonbin.io/v3/b/63cee211c0e7653a055f5ad8").then( function (response){
function loadWorkoutFromServer(){
    fetch("https://s23-deploy-chunsaker10-production.up.railway.app/workouts", {credentials: 'include'}).then( function (response){
        response.json().then( function (data) {
            console.log("data recieved from server:", data);
            //myResponses = data["record"];
            //THESE ARE THE SAME THINGS
            myResponses = data;

            var myList = document.querySelector("#workout-list");
            console.log("my list elements:", myList);
            //this may not be in the right spot
            myList.innerHTML = "";
            // for workout in myWorkouts
            myResponses.forEach(function(workout){ 
              var newItem = document.createElement("li");
              newItem.id = "w"+ workout.id;

              var nameDiv = document.createElement("div");
              nameDiv.innerHTML = workout.name;
              nameDiv.classList.add("name");
              newItem.classList.add("workout_div");
              newItem.appendChild(nameDiv);
      
              var dateDiv = document.createElement("div");
              dateDiv.innerHTML = workout.rating;
              dateDiv.classList.add("rating");
              newItem.appendChild(dateDiv);

              var difficultyDiv = document.createElement("div");
              difficultyDiv.innerHTML = workout.type;
              difficultyDiv.classList.add("type");
              newItem.appendChild(difficultyDiv);

              var repsDiv = document.createElement("div");
              repsDiv.innerHTML = workout.reps;
              repsDiv.classList.add("reps");
              newItem.appendChild(repsDiv);

              var setsDiv = document.createElement("div");
              setsDiv.innerHTML = workout.sets;
              setsDiv.classList.add("sets");
              newItem.appendChild(setsDiv);
      
              var deleteButton = document.createElement("button");
              deleteButton.innerHTML = "Delete";
              deleteButton.classList.add("delete_button");
              deleteButton.onclick = function () {
                console.log("delete button was clicked for", workout.name);
                if (confirm("Are you sure you want to delete " + workout.name + "?")) {
                  deleteWorkoutFromServer(workout.id);
                }
              };
              newItem.appendChild(deleteButton);
      
              var editButton = document.createElement("button");
              editButton.innerHTML = "Edit";
              editButton.classList.add("edit_button");
              editButton.onclick = function () {
                updateWorkoutOnServer(workout.id);
              };
              newItem.appendChild(editButton);
      
              myList.appendChild(newItem);
                
            });
        });
    });
}
    
function createWorkoutOnServer(workoutName, workoutRating, workoutDifficulty, workoutReps, workoutSets){
  console.log("attempting to create workout", workoutName, "on server");

  var data = "name=" + encodeURIComponent(workoutName);
  data += "&rating=" + encodeURIComponent(workoutRating);
  data += "&type=" + encodeURIComponent(workoutDifficulty);
  data += "&reps=" + encodeURIComponent(workoutReps);
  data += "&sets=" + encodeURIComponent(workoutSets);

  console.log("sending data to server:", data);

  fetch("https://s23-deploy-chunsaker10-production.up.railway.app/workouts", {
    // request details:
    credentials: 'include',
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    // when the server responds:

    if (response.status == 201) {
      loadWorkoutFromServer();
    } else {
      console.log("server responded with", response.status, "when trying to create a user");
    }
  });
}

function deleteWorkoutFromServer(workoutId) {
  fetch("https://s23-deploy-chunsaker10-production.up.railway.app/workouts/" + workoutId, {
    credentials: 'include',
    method: "DELETE"
  }).then(function (response) {
    if (response.status == 200) {
      loadWorkoutFromServer();
    } else {
      console.log("server responded with", response.status, "when trying to delete a workout");
    }
  });
}

function updateWorkoutOnServer(workoutId){
  var myId = document.querySelector("#w" + workoutId);
//

  var title = myId.querySelector(".name");
  name_input = document.createElement("input");
  name_input.classList.add("name_input_new");
  name_input.value = title.innerHTML;
  title.replaceWith(name_input);
//
  var rating = myId.querySelector(".rating");
  name_rating = document.createElement("input");
  name_rating.classList.add("rating_input_new");
  name_rating.value = rating.innerHTML;
  rating.replaceWith(name_rating);
//
  var type = myId.querySelector(".type");
  type_input = document.createElement("input");
  type_input.classList.add("type_input_new");
  type_input.value = type.innerHTML;
  type.replaceWith(type_input);
//
  var reps = myId.querySelector(".reps");
  reps_input = document.createElement("input");
  reps_input.classList.add("reps_input_new");
  reps_input.value = reps.innerHTML;
  reps.replaceWith(reps_input);
//
  var sets = myId.querySelector(".sets");
  sets_input = document.createElement("input");
  sets_input.classList.add("sets_input_new");
  sets_input.value = sets.innerHTML;
  sets.replaceWith(sets_input);
//
  var edit_button = myId.querySelector(".edit_button"); 
  var saveButton = document.createElement("button");
  saveButton.innerHTML = "Save";
  saveButton.classList.add("save_button");
  edit_button.replaceWith(saveButton)
  saveButton.onclick = function () {
    saveWorkoutOnServer(workoutId);
  };
}

function saveWorkoutOnServer(workoutId){
  
  var workout = document.querySelector("#w" + workoutId);
  //
  var title = workout.querySelector(".name_input_new");
  //
  var rating = workout.querySelector(".rating_input_new");
  //
  var type = workout.querySelector(".type_input_new");
//
  var reps = workout.querySelector(".reps_input_new");
//
  var sets = workout.querySelector(".sets_input_new");
  console.log("server responded with", rating.value);

  var data = "name=" + encodeURIComponent(title.value);
  data += "&rating=" + encodeURIComponent(rating.value);
  data += "&type=" + encodeURIComponent(type.value);
  data += "&reps=" + encodeURIComponent(reps.value);
  data += "&sets=" + encodeURIComponent(sets.value);

  console.log("sending data to server:", data);
  fetch("https://s23-deploy-chunsaker10-production.up.railway.app/workouts/" + workoutId, {
    // request details:
    credentials: 'include',
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    // when the server responds:

    if (response.status == 200) {
      loadWorkoutFromServer();
    } else {
      console.log("server responded with", response.status, "when trying to create a workout");
    }
  });
}


function createUser(userEmail, userFname, userLname, userPassword){
  //console.log("attempting to create workout", workoutName, "on server");

  var data = "email=" + encodeURIComponent(userEmail);
  data += "&first_name=" + encodeURIComponent(userFname);
  data += "&last_name=" + encodeURIComponent(userLname);
  data += "&password=" + encodeURIComponent(userPassword);

  console.log("sending data to server:", data);

  fetch("https://s23-deploy-chunsaker10-production.up.railway.app/users", {
    // request details:
    credentials: 'include',
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    // when the server responds:

    if (response.status == 422) {
      alert("422: Email taken")
    } else {
      alert("Succesfully Registered")
      console.log("server responded with", response.status, "when trying to create a user");
    }
  });
}
var login = document.querySelector("#login");
login.onclick = function (){
  var email_one = document.querySelector("#email_one");
  var psw_one = document.querySelector("#psw_one");
  loadSessionFromServer(email_one.value, psw_one.value);
};

function loadSessionFromServer(email_one, psw_one){
  
  var data = "email_one=" + encodeURIComponent(email_one);
  data += "&password_one=" + encodeURIComponent(psw_one);
  

  console.log("sending data to server:", data);
  fetch("https://s23-deploy-chunsaker10-production.up.railway.app/session", {
    // request details:
    credentials: 'include',
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    }).then(function (response) {
      // when the server responds:
  
      if (response.status == 401) {
        alert("Invalid User");
    } else {
      changeState();
      loadWorkoutFromServer();
    }  
  });
}
function changeState(){
  var generated = document.querySelector("#generated");
  generated.style.display = "block";
  var feedback = document.querySelector("#feedback");
  feedback.style.display = "block";
  var footer = document.querySelector("#footer");
  footer.style.display = "block";
  var login_form = document.querySelector("#login_form");
  login_form.style.display = "none";
  var signUpForm = document.querySelector("#signup_form");
  signUpForm.style.display = "none";
  var sign_up_submit = document.querySelector("#sign_up_submit");
  sign_up_submit.style.display = "none";
}
function loggedIn(){
  fetch("https://s23-deploy-chunsaker10-production.up.railway.app/workouts", {credentials: 'include'}).then(function (response) {
    if (response.status == 401) {
      alert("Invalid User");
  } else {
    changeState();
    loadWorkoutFromServer();
  } 
  response.json().then( function (data) {
    console.log("data recieved from server:", data);
    }) 
  })
  
}
loggedIn();
//loadSessionFromServer();
//loadWorkoutFromServer();

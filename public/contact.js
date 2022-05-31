var firebaseConfig = {
    apiKey: "AIzaSyBwLQZFA5z-WuOzqRZ7OUoLyRdclMRQEu0",
    authDomain: "tecedu-bd07a.firebaseapp.com",
    databaseURL: "https://tecedu-bd07a.firebaseio.com",
    projectId: "tecedu-bd07a",
    storageBucket: "tecedu-bd07a.appspot.com",
    messagingSenderId: "662915300119",
    appId: "1:662915300119:web:33b29c5350142e8ce31552",
    measurementId: "G-5B2X9QJ8NV"
};

//Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore()

//Variable to access database collection
const db = firestore.collection("messages")

//Get Submit Form
let submitButton = document.getElementById('submit')

//Create Event Listener To Allow Form Submission
submitButton.addEventListener("click", (e) => {
    //Prevent Default Form Submission Behavior
    e.preventDefault()

    //Get Form Values
    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let message = document.getElementById('text').value

    //Save Form Data To Firebase
    db.doc().set({
        Name: name,
        Email: email,
        Message: message,
    }).then(() => {
        console.log("Data saved")
    }).catch((error) => {
        console.log(error)
    })

    //alert
    alert("Your Form Has Been Submitted Successfully")
})
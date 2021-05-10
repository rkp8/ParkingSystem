var firebaseConfig = {
  apiKey: "AIzaSyDIb5HT1Thp9xYJaawx9wv-DpEYUDNUJyQ",
  authDomain: "fir-connection-f705b.firebaseapp.com",
  databaseURL: "https://fir-connection-f705b-default-rtdb.firebaseio.com",
  projectId: "fir-connection-f705b",
  storageBucket: "fir-connection-f705b.appspot.com",
  messagingSenderId: "1015805824121",
  appId: "1:1015805824121:web:62b126edb7a1c4d821d8a8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


firebase.auth().onAuthStateChanged(function(user){
    if(!user){
      window.location.href = "../index.html";
    }else{
      let user = firebase.auth().currentUser;
      let uid
      if(user != null){
          uid = user.uid;
      }
      let firebaseRefKey = firebase.database().ref().child(uid);
      firebaseRefKey.on('value', (dataSnapShot)=>{
          document.getElementById("fname").innerHTML = dataSnapShot.val().userFirstName;
          document.getElementById("lname").innerHTML = dataSnapShot.val().userLastName;
          document.getElementById("ename").innerHTML = dataSnapShot.val().userEmailId;
          document.getElementById("pname").innerHTML = dataSnapShot.val().userPhoneNum;
          document.getElementById("lnname").innerHTML = dataSnapShot.val().userLicenseNum;
      })
    }
});

function signOut(){
      firebase.auth().signOut();
  }

function Account(){
    firebase.auth().onAuthStateChanged(function(user){
      if(!user){
          window.location.href = "../index.html";
        }else{
          window.location.href = "account.html";
        }
      });
    }

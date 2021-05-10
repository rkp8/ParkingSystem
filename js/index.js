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
firebase.auth.Auth.Persistence.LOCAL;


$("#btn-login").click(function()
{
  var email = $("#Login-Email").val();
  var password = $("#Login-Password").val();

  if(email != "" && password != ""){
    var result = firebase.auth().signInWithEmailAndPassword(email, password);

    result.catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorMessage);
      document.getElementById("wrong").innerHTML = errorMessage;

    });
  }else{
    window.alert("Form is incomplete");
  }
});

$("#btn-signup").click(function()
{
  var firstName =  $("#getFirstName").val();
  var lastName =  $("#getLastName").val();
  var licenseNum = $("#getLicense").val();
  var phoneNum =   $("#getPhoneNum").val();
  var emailId =    $("#getEmail").val();
  var getPass =    $("#getPass").val();
  var confPass =   $("#confirmPass").val();

  var userPasswordFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}/;
  var userlicenseCheck = /^[0-9A-z]{7}$/;
  var userPhoneCheck = /^[0-9]{10}$/;

  var checkUserPasswordValid = getPass.match(userPasswordFormat);
  var checkUserLicenseChecker = licenseNum.match(userlicenseCheck);
  var userPhoneChecker = phoneNum.match(userPhoneCheck);

  var flag = document.getElementById("checkbox").checked;

  if(flag == true){

        if(firstName != "" && lastName != "" && licenseNum != "" && phoneNum != "" && emailId != "" && getPass != "" && confPass != "")
          {

              if(getPass == confPass){

                if(checkUserPasswordValid == null){
                  document.getElementById("wronggg").innerHTML = "Password must be atleast 7 Characters with One UpperCase, One LowerCase and one Number!";
                }else if(checkUserLicenseChecker == null){
                  document.getElementById("wronggg").innerHTML = "License Number must be 8 digits! Should include only Numbers!";
                }else if(userPhoneChecker == null){
                  document.getElementById("wronggg").innerHTML = "Phone Number must be 10 digits and Should include only Numbers!";
                }else{

                firebase.auth().createUserWithEmailAndPassword(emailId, getPass).then((success) => {
                    var user = firebase.auth().currentUser;
                    var uid;
                    if (user != null) {
                        uid = user.uid;
                    }
                    var firebaseRef = firebase.database().ref();
                    var userData = {
                        userFirstName: firstName,
                        userLastName:  lastName,
                        userPhoneNum:  phoneNum,
                        userLicenseNum:licenseNum,
                        userEmailId: emailId,
                    }
                    firebaseRef.child(uid).set(userData);
                    document.getElementById("wronggg").innerHTML = "Successfully Signed Up, Please Login!";
                }).catch((error) => {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    document.getElementById("wronggg").innerHTML = errorMessage;
                });
              }}else{
                document.getElementById("wronggg").innerHTML = "Password do not Match, please Retry!";
              }
          }
        else{
          document.getElementById("wronggg").innerHTML = "Please fill in the whole Form!";
        }
  }else{
    document.getElementById("wronggg").innerHTML = "Please Agree with the Policy!";
  }

});

$("#btn-forgotPassword").click(function()
{
  var auth = firebase.auth();
  var email = $("#myEmail").val();

  if(email != ""){
    auth.sendPasswordResetEmail(email).then(function()
    {
      document.getElementById("wrongo").innerHTML = "Email has been sent Successfully!";
    })
    .catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorMessage);
      document.getElementById("wrongo").innerHTML = errorMessage;
    });
  }else{
      document.getElementById("wrongo").innerHTML = "Please enter a Valid Email!";
  }

});

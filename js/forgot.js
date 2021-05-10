
const form = document.getElementById("get_num");



var currentUserId = 4;
var found;
var state = false;
var checked = false;
var success = false;
var enteredPhoneNumber;
var userIdtoSend = undefined;

//TODO: If user clicks Forgot ID?, ask them for their phone #. Then run this method to send them the userId.
function sendUserId(enteredPhoneNumber){
    db.collection("users").where("phone", "==", enteredPhoneNumber)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(" => ", doc.data().userId); //prints userId to console

                userIdtoSend = doc.data().userId; //userId is obtained and stored here
                //alert("userId: " + userIdtoSend)
            if(userIdtoSend != undefined)
                {
                    document.getElementById("wrong").innerHTML = "User Id sent Successfully";
                    //alert("Message Sent to " + enteredPhoneNumber + " Containing ID");
                    success = true;
                }

                var request = {
                    "to": "+1 " +enteredPhoneNumber.toString(),
                    "body": "Your ID is: " + userIdtoSend.toString()
                }

                //TODO: Send it to them in a text message, using enteredPhoneNumber and userIdtoSend variables

                    fetch('https://p0h9q1u3l3.execute-api.us-east-2.amazonaws.com/dev/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body:JSON.stringify(request)
                    })
                        .then(res => res.json())

            });
            if(userIdtoSend==undefined) {
                document.getElementById("wrong").innerHTML = "Sorry, No matching ID found for entered number. Please try another number";
                success = false;
            }


        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
            success = false;
        });


}

form.addEventListener("submit", (e) => {
    //currentUserId = form.company_userId.value;
    e.preventDefault();

    found = false;
    enteredPhoneNumber = form.pass.value;

    success = false;

    sendUserId(enteredPhoneNumber);

    //
    //  clear the form
    form.pass.value = '';
    //Takes a while to create the document in Firebase, allows 1.5 second
    var delayInMilliseconds = 1500; //1.5 second

    setTimeout(function () {
      // alert("success: " + success)

        if (success) {


        alert("Redirecting to the map");
        document.getElementById("wrong").innerHTML = "User Id Sent Successfully!";
        window.location.replace("https://psuparkingsimplified.herokuapp.com/SignedIn/map.html");
    }
    }, delayInMilliseconds);

})





(function ($) {
    "use strict";


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
            hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }



})(jQuery);

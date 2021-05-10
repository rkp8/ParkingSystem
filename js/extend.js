const header = document.getElementById("curruser");
const header2 = document.getElementById("lim");
var found;


const form1 = document.getElementById("set_user_id")
const form4 = document.getElementById("limit_form")

//const form2 = document.getElementById("toAdd")

var currentUserId = null;

var adminId = "rkp8@psu.edu";
var adminId2 = "aap60@psu.edu";
var adminId3 = "caw5890@psu.edu";

var reserved = false;
var currentLotId = null;
var admin = false;
var lot_depth = 19;
var oldlotId = null;
var buildingUserId = "Null";
var state;
var unlockflag = false;

var myLim = document.getElementById("limit");
myLim.style.display = "none";

var errMSG = document.getElementById("errorMSG");
errMSG.style.display = "none";

var login = document.getElementById("login");

function msToDate(ms){
    var date = new Date(ms);

    var month = date.getMonth();

    var day = date.getDay();

    var hours = date.getHours();
// Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


    return formattedTime;


}


function sendAlert(ID, message){
    console.log("sending")
    db.collection("users").where("userId", "==", ID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(" => ", doc.data().userId); //prints userId to console

                phone = doc.data().phone; //userId is obtained and stored here


                var request = {
                    "to": "+1 " +phone.toString(),
                    "body": message
                }

                //TODO: Send it to them in a text message, using Phone and message variables

                fetch('https://p0h9q1u3l3.execute-api.us-east-2.amazonaws.com/dev/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(request)
                })
                    .then(res => res.json())
                    .then(data => {

                        if(data.success == true)
                        {
                            console.log("Alert Sent to User " + ID);
                        }
                        else if(data.success == false)
                            console.log("Sorry, that ID had an invalid phone number.")
                    });



            });



        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });


}







var issuePending = false;


if(currentUserId!=null)
    header.textContent = "Currently Logged in as User:   " + currentUserId;



function get_balance_and_limit()
{
    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (doc.data().userId == currentUserId) {

                        if(doc.data().deadline != "null") {

                            header2.textContent = "Current Deadline: " + doc.data().deadline;

                        }
                        else
                            header2.textContent = "Current Deadline: Not Set";

                    }
                }
            );
        }
    );
}



form1.addEventListener("submit", (e) => {
    //currentUserId = form.company_userId.value;
    e.preventDefault();
    found = false;



    oldlotId = currentLotId;
    currentUserId = form1.new_user_id.value;

    console.log("ID: " + currentUserId)

    if(currentUserId == adminId || currentUserId == adminId2) {
    document.getElementById("loggedin").innerHTML = "Currently Logged in as Admin:   " + currentUserId;
        admin = true;
        login.style.display = "none";
    }
    else {
        check();
    }




    //
    //  clear the form
    form1.new_user_id.value = '';



    // alert("Data saved!");
})



//checks if user is in database and updates Header
function check(){
    var nummers = db.collection("users").where("userId", "==", currentUserId)

    var delayInMilliseconds = 100; //1 second

    setTimeout(function () {
        nummers.get().then(function (querySnapshot) {
            console.log("result: " + !querySnapshot.empty)

            if (!querySnapshot.empty) {

                //your code to be executed after 0.5 second
                console.log("Found ");

                document.getElementById("loggedin").innerHTML = "Currently Logged in as User:   " + currentUserId;
                admin = false;
                login.style.display = "none";
                myLim.style.display = "block";
                errMSG.style.display = "none";


                db.collection("users").orderBy('userId').get().then(
                    snapshot => {
                        //console.log(snapshot)
                        snapshot.docs.forEach(
                            doc => {
                                if(doc.data().userId == currentUserId){

                                    if(doc.data().deadline != "null") {

                                        header2.textContent = "Current Deadline: " + doc.data().deadline;

                                    }
                                    else
                                        header2.textContent = "Current Deadline: Not Set";
                                }
                            }
                        );
                    }
                );
            } else {
                errMSG.style.display = "block";


            }

        })
    }, delayInMilliseconds)

}

form4.addEventListener("submit", (e) => {
    //currentUserId = form.company_userId.value;
    e.preventDefault();

    var limit = form4.company_limit.value;
    if(limit < 0 || limit > 24){
        return;
    }
    console.log("LLL: " + limit)


    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (doc.data().userId == currentUserId) {


                        var today = new Date();
                        today.setHours( today.getHours() + parseInt((limit)));
                        var time = (today.getHours()) + ":" + today.getMinutes() + ":" + today.getSeconds();
                        db.collection("users").doc(doc.id).update({deadline: time});


                        sendAlert(doc.data().userId, "Reservation Successfully Extended. Your new deadline is: " + time);

                        header2.textContent = "Current Deadline:   " + time;

                    }
                }
            );
        }
    );
})

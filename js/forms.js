
const header = document.getElementById("curruser");
const header1 = document.getElementById("bal");
const header2 = document.getElementById("lim");

const form1 = document.getElementById("set_user_id")
const form3 = document.getElementById("money_form")

//const form2 = document.getElementById("toAdd")
var setLogin = document.getElementById("login");
setLogin.style.display = "block";

var errMSG = document.getElementById("errorMSG");
errMSG.style.display = "none";

var mon = document.getElementById("money");
mon.style.display = "none";

document.getElementById("curruser").style.visibility = "hidden";


var currentUserId = null;
var adminId = "rkp8@psu.edu";
var reserved = false;
var currentLotId = null;
var admin = false;
var lot_depth = 19;
var oldlotId = null;
var buildingUserId = "Null";
var state;





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

                header.textContent = "Currently Logged in as User:   " + currentUserId;
                admin = false;
                errMSG.style.display = "none";
                setLogin.style.display = "none";
                mon.style.display = "block";




            } else {
                errMSG.style.display = "block";



            }

        })
    }, delayInMilliseconds)

}







if(currentUserId!=null) {
    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (doc.data().userId == currentUserId) {

                        header1.textContent = "Current Balance:   " + doc.data().balance;

                    }
                }
            );
        }
    );


    header.textContent = "Currently Logged in as User:   " + currentUserId;
}

function get_balance_and_limit() {
    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (doc.data().userId == currentUserId) {

                        header1.textContent = "Current Balance:   " + doc.data().balance;




                    }
                }
            );
        }
    );
}


    form1.addEventListener("submit", (e) => {
        //currentUserId = form.company_userId.value;
        e.preventDefault();

        oldlotId = currentLotId;
        currentUserId = form1.description.value;

        if (currentUserId == adminId) {
            header.textContent = "Currently Logged in as Admin:   " + currentUserId;
            admin = true;
        } else {
            check();
            admin = false;
        }

        db.collection("users").orderBy('userId').get().then(
            snapshot => {
                //console.log(snapshot)
                snapshot.docs.forEach(
                    doc => {
                        if (doc.data().userId == currentUserId) {

                            header1.textContent = "Current Balance:   " + doc.data().balance;

                        }
                    }
                );
            }
        );



        // alert("Data saved!");
    })


form3.addEventListener("submit", (e) => {
    //currentUserId = form.company_userId.value;
    e.preventDefault();
    var amount = form3.company_amount.value;

    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (doc.data().userId == currentUserId) {

                        var new_balance = parseFloat(doc.data().balance) + parseFloat(amount);

                        new_balance = new_balance.toFixed(2);
                        db.collection("users").doc(doc.id).update({balance: new_balance});

                        header1.textContent = "Balance:   " + new_balance;

                        sendAlert(doc.data().userId, "Payment of $" + amount + " was received. Your new balance is $" + new_balance);


                    }

                }
            );
        }
    );

    //
    //  clear the form

    alert("Payment received");

})


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

//to convert this to the bundle.js

//install browserify:
// npm install browserify

//cd to the js folder

//run:
//browserify sendPaymentDetails.js -o bundle.js

//this should update the code


const stripe = require('stripe')('sk_test_51Iet34J2orohyskSDKUXHVtRARm1tdPNZUO6yX78fL35CJQ0ptzyluo3RaI8FyJ1Jps4MMDEOl9RYJ2osMZvQgFf00jEsEgohc');

const header = document.getElementById("curruser");
const header1 = document.getElementById("bal");

const form1 = document.getElementById("set_user_id")
var form2 = document.getElementById("payment-form");

var currentUserId = null;
var amount =0;

var adminId = "rkp8@psu.edu";
var adminId2 = "aap60@psu.edu";
var adminId3 = "caw5890@psu.edu";

get_balance();



//on button click (still doesn't work)
form2.addEventListener("submit", (e) => {
    //currentUserId = form.company_userId.value;
    e.preventDefault();

    console.log("Getting Info")
    //moved the method here
    getPaymentInfo();


})




function getPaymentInfo() {
    //----------------------------------------------------------------
    var cardInfoExp = document.getElementById("monthYear").value;
    var yy = cardInfoExp.split("/");
    //----------------------------------------------------------------
    var isChecked = document.getElementById("fullAmountBut").checked;
    if(isChecked == false){
        //if(//custom > total);
        amount = document.getElementById("customAmount").value;
    }
    else{
        amount = "TOTAL";
    }

    Stripe.card.createToken({
        number: $('input[id=card-number]').valueOf(),
        cvc: $('input[id=card-cvc]').valueOf(),
        exp_month: yy[0],
        exp_year: yy[1]
    }, stripeResponseHandler);
}

var stripeResponseHandler = async function (status, response) {
    if (response.error) {
        alert("PAYMENT ERROR")
    } else {
        // Get the token ID:
        const token = response.id;
        const charge = await stripe.charge.create({
            amount: amount, //get amount charged here
            currency: 'usd',
            description: 'Example charge',
            source: token,
        });



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



        alert("Payment received");


    }
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


form1.addEventListener("submit", (e) => {
    //currentUserId = form.company_userId.value;
    e.preventDefault();

    currentUserId = form1.new_user_id.value;

    if(currentUserId == adminId || currentUserId == adminId2 || currentUserId == adminId3) {
        header.textContent = "Currently Logged in as Admin:   " + currentUserId;
        admin = true;
    }
    else {
        header.textContent = "Currently Logged in as User:   " + currentUserId;
        admin = false;
    }
    get_balance();


    //
    //  clear the form
    form1.new_user_id.value = '';



    // alert("Data saved!");
})

function get_balance() {
    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (doc.data().userId == currentUserId) {

                        header1.textContent = doc.data().balance;


                    }
                }
            );
        }
    );
}



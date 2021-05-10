const ul = document.getElementById("companies_ul");
const ul2 = document.getElementById("companies_ul2");
const ul3 = document.getElementById("companies_ul3");
const ul4 = document.getElementById("companies_ul4");

const header = document.getElementById("curruser");
const header2 = document.getElementById("lim");


const form = document.getElementById("add_company_form")
const form1 = document.getElementById("set_user_id")
const form3 = document.getElementById("money_form")
const form4 = document.getElementById("limit_form")
const form5 = document.getElementById("issue_info")

//const form2 = document.getElementById("toAdd")

var myLogin = document.getElementById("log_Block");

var logOut = document.getElementById("logout");
logOut.style.display = "none";


var getStart = document.getElementById("getStart");

var myHours = document.getElementById("limit");
myHours.style.display = "none";

var currentUserId = null;
var currentBalance = null;

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


var found = false; //whether entered ID exists in database


function checkBalance(id) {


    return db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    console.log("ID: " + id + " outcome " + (doc.data().userId == id))
                    if (doc.data().userId == id) {
                        console.log("inner out " + (doc.data().balance > 0))
                        currentBalance =  doc.data().balance > 0;
                    }
                }
            );
        }
    );
}




var issuePending = false;


if(currentUserId!=null)
    header.textContent = "Currently Logged in as User:   " + currentUserId;

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];



// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



function get_balance_and_limit()
{
    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (doc.data().userId == currentUserId) {


                        header2.textContent = "Currently Set to " + doc.data().limit + " hours";


                    }
                }
            );
        }
    );
}



class lot {
    constructor (lotId, userId, availability,rate) {
        this.lotId = lotId;
        this.userId = userId;
        this.availability = availability;
        this.rate = rate;
    }
    toString() {
        return this.lotId + ', ' + this.userId + ', ' + this.availability;
    }
}

var lot1 = new lot(null, null, null);


String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

const renderCompany = (doc) => {

    if(doc.data().userId == currentUserId) {
        reserved = true;
        currentLotId = doc.data().lotId;
    }


    //  create the li
    let li = document.createElement('li');
    li.className = "collection-item";

    var searchId = doc.id.toString();
    if(searchId.charAt(0) <='9' && searchId.charAt(0) >='0'){

        searchId = "A"+doc.id.toString();
        console.log("DOM " + searchId)

    }

    li.setAttribute("data-id", searchId);

    let lotId = document.createElement('span');
    lotId.className = "white-text";

    let availability = document.createElement("p");
    availability.className = "white-text";

    let userId = document.createElement("p");
    userId.className = "white-text";

    let rate = document.createElement("p");
    rate.className = "white-text";

    let space = document.createElement("br");

    lotId.textContent = doc.data().lotId;
    availability.textContent = doc.data().availability;
    userId.textContent = "";
    rate.textContent = doc.data().rate;


    //  <i class="material-icons secondary-content red-text">delete</i>
    let i = document.createElement("i");
    i.className = "material-icons secondary-content blue-text"
    i.textContent = "delete";

    i.addEventListener("click", (e) => {
        console.log("clicked")
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute("data-id");

        let concatId = id;
         if(id.charAt(0) == "A")
            concatId = id.substring(1);
        
        db.collection("lots").doc(concatId).delete();
        
        alert("deleted: " + concatId);

        // Create a reference to the SF doc.
        var sfDocRef1 = db.collection("lots").doc("statistics");

        db.runTransaction((transaction) => {
            return transaction.get(sfDocRef1).then((sfDoc1) => {
                if (!sfDoc1.exists) {
                    throw "Document does not exist!";
                }


                var currCap = sfDoc1.data().capacity;
                console.log("Curr Cap2: " + currCap)


                transaction.update(sfDocRef1, { capacity: currCap-1});




            });
        }).then(() => {
            console.log("updated");
        }).catch((err) => {
            // This will be an "population is too big" error.
            console.error(err);
        });





    })

    //exit event
    //  <i class="material-icons secondary-content red-text">delete</i>
    let e = document.createElement("e");
    e.className = "material-icons secondary-content red-text"
    e.textContent = "highlight_off";
    e.setAttribute("check", "e");


    e.addEventListener("click", (e1) => {
        console.log("clicked")
        e1.stopPropagation();
        let id = e1.target.parentElement.getAttribute("data-id");


        db.collection("lots").doc(id)
            .get().then((doc) => {
            if (doc.exists) {
                // Convert to City object
                lot1.lotId = doc.data().lotId;
                lot1.userId = doc.data().userId;
                lot1.availability = doc.data().availability;

                // Use a City instance method
                console.log(lot1.toString());
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        var delayInMilliseconds = 100; //1 second

        setTimeout(function () {
            //your code to be executed after 1 second
            console.log("reserved" + reserved);

            if (doc.data().availability == 0 && currentUserId == doc.data().userId) {
                db.collection("lots").doc(id).update({userId: "Null", availability: 1});
                console.log("updated");
                alert("Exited Lot: " + doc.data().lotId);
                currentLotId = null;
                reserved = false;

                // Create a reference to the SF doc.
                var sfDocRef1 = db.collection("lots").doc("statistics");

                db.runTransaction((transaction) => {
                    return transaction.get(sfDocRef1).then((sfDoc1) => {
                        if (!sfDoc1.exists) {
                            throw "Document does not exist!";
                        }


                        var currCap = sfDoc1.data().capacity;
                        console.log("Curr Cap2: " + currCap)


                        transaction.update(sfDocRef1, { capacity: currCap+1});




                    });
                }).then(() => {
                    console.log("updated");
                }).catch((err) => {
                    // This will be an "population is too big" error.
                    console.error(err);
                });







            } else if (!reserved) {
                alert("Sorry you are not currently parked anywhere");
            }
        }, delayInMilliseconds);

    })


//  <i class="material-icons secondary-content red-text">delete</i>
    let issue = document.createElement("issue");
    issue.className = "material-icons secondary-content purple-text"
    issue.textContent = "error";

    issue.addEventListener("click", (e) => {
        console.log("clicked")
        e.stopPropagation();
        var id = e.target.parentElement.getAttribute("data-id");
        db.collection("lots").doc(id).update({issue: 1});
        alert("Issue " + id + " reported");
        issuePending = true;
        currentLotId = doc.data().lotId;

        //TODO: Be able to upload image when reporting Issue:
        db.collection("issues").get().then(
            snapshot => {
                snapshot.docs.forEach(
                    doc => {

                        //console.log(doc.data().lotId)
                        //console.log(currentLotId)
                        //console.log(doc.data().lotId === currentLotId)

                        if (doc.data().lotId === currentLotId)
                            db.collection("issues").doc(doc.id).update({resolved: -1});

                    }
                );
            }
        );
        // When the user clicks the button, open the modal
        modal.style.display = "block";
    })

    let resolveIssue = document.createElement("resolveIssue");
    resolveIssue.className = "material-icons secondary-content orange-text"
    resolveIssue.textContent = "build";

    resolveIssue.addEventListener("click", (e) => {
        console.log("clicked")
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute("data-id");
        db.collection("lots").doc(id).update({issue: 0});
        currentLotId = doc.data().lotId;

        console.log("Current Lot Id: " + currentLotId)

        var searchby = currentLotId;

        var delayInMilliseconds = 200; //1 second


        setTimeout(function () {
            //TODO: Be able to upload image when reporting Issue:
            db.collection("issues").get().then(
                snapshot => {
                    snapshot.docs.forEach(
                        doc => {

                            console.log(doc.data().lotId)
                            console.log(searchby)
                            console.log(doc.data().lotId === searchby)

                            if (doc.data().lotId === searchby)
                                db.collection("issues").doc(doc.id).update({resolved: 1});



                        }
                    );
                }
            );

        alert("Issue " + id + " resolved");


            issuePending = false;
        }, delayInMilliseconds);

    })

    let unlock = document.createElement("unlock");
    unlock.className = "material-icons secondary-content green-text"
    unlock.textContent = "vpn_key";

    unlock.addEventListener("click", (e) => {
        console.log("clicked")
        e.stopPropagation();

        db.collection("users").orderBy('userId').get().then(
            snapshot => {
                //console.log(snapshot)
                snapshot.docs.forEach(
                    doc => {
                        if(currentUserId == doc.data().userId) {
                            db.collection("users").doc(doc.id).update({status: 0});

                            db.collection("unlock").get().then(
                                snapshot => {
                                    //console.log(snapshot)
                                    snapshot.docs.forEach(
                                        doc => {
                                            db.collection("unlock").doc(doc.id).update({unlockflag: 1});


                                        }
                                    );

                                })


                            alert("Temporary Access Granted to Relocate");
                        }
                    }
                );

            }
        );


    })

    let s = document.createElement("s");
    s.className = "material-icons secondary-content gray-text"
    s.textContent = "swap_horiz";

    s.addEventListener("click", (e) => {
        console.log("clicked")
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute("data-id");


        db.collection("lots").doc(id)
            .get().then((doc) => {
            if (doc.exists) {
                // Convert to City object
                lot1.lotId = doc.data().lotId;
                lot1.userId = doc.data().userId;
                lot1.availability = doc.data().availability;

                // Use a City instance method
                console.log(lot1.toString());
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        db.collection("lots").where("userId", "==", currentUserId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(" => ", doc.data().lotId);
                    currentLotId = doc.data().lotId;
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });






        var delayInMilliseconds = 200; //1 second


        setTimeout(function () {
            //your code to be executed after 1 second

            console.log("currId99999: " + currentLotId);
            console.log("reserved434 " + reserved);

            if (doc.data().availability == 1 && (currentLotId=="null" || currentLotId == null || currentLotId == "Null") && reserved == false) {


                // Create a reference to the SF doc.
                var sfDocRef = db.collection("lots").doc(id);

                db.runTransaction((transaction) => {
                    return transaction.get(sfDocRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }

                        console.log("A: " + sfDoc.data().availability);
                        console.log("Lot id: " + currentLotId);

                        if (sfDoc.data().availability ==1) {
                            transaction.update(sfDocRef, { availability: 0, userId: currentUserId});
                            alert("Reserved Lot: " + lot1.lotId);
                            currentLotId = doc.data().lotId;
                            reserved = true;

                            db.collection("users").orderBy('userId').get().then(
                                snapshot => {
                                    //console.log(snapshot)
                                    snapshot.docs.forEach(
                                        doc => {
                                            if(currentUserId == doc.data().userId) {
                                                document.getElementById("companies_ul").innerHTML = "";
                                                document.getElementById("companies_ul2").innerHTML = "";
                                                document.getElementById("companies_ul3").innerHTML = "";
                                                document.getElementById("companies_ul4").innerHTML = "";


                                                db.collection("users").doc(doc.id).update({status: 1});

                                                db.collection("unlock").get().then(
                                                    snapshot => {
                                                        //console.log(snapshot)
                                                        snapshot.docs.forEach(
                                                            doc => {
                                                                document.getElementById("companies_ul").innerHTML = "";
                                                                document.getElementById("companies_ul2").innerHTML = "";
                                                                document.getElementById("companies_ul3").innerHTML = "";
                                                                document.getElementById("companies_ul4").innerHTML = "";
                                                                db.collection("unlock").doc(doc.id).update({unlockflag: 0});


                                                            }
                                                        );

                                                    })




                                                alert("Temporary Access Removed");
                                            }
                                        }
                                    );

                                }
                            );

                        } else {
                            currentLotId = null;
                            alert("Sorry! Someone beat you to it.");
                            return Promise.reject("Sorry! Someone beat you to it.");
                        }
                    });
                }).then(() => {
                    console.log("updated");
                }).catch((err) => {
                    // This will be an "population is too big" error.
                    console.error(err);
                });


            } else if ((currentLotId!="null" || currentLotId != null || currentLotId != "Null") && currentLotId!= oldlotId && lot1.availability == 1) {
                alert("Sorry already reserved in: " + currentLotId);
            } else if (lot1.availability == 0 && !reserved) {
                alert("Sorry Lot Already Taken: " + doc.data().lotId);

            }
        }, delayInMilliseconds);

    })




    let r = document.createElement("r");
    r.className = "material-icons secondary-content pink-text"
    r.textContent = "done";
    e.setAttribute("check", "r");

    r.addEventListener("click", (e) => {
        console.log("clicked")
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute("data-id");


        db.collection("lots").doc(id)
            .get().then((doc) => {
            if (doc.exists) {
                // Convert to City object
                lot1.lotId = doc.data().lotId;
                lot1.userId = doc.data().userId;
                lot1.availability = doc.data().availability;

                // Use a City instance method
                console.log(lot1.toString());
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        db.collection("lots").where("userId", "==", currentUserId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(" => ", doc.data().lotId);
                    currentLotId = doc.data().lotId;
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });



        checkBalance(currentUserId);

        var delayInMilliseconds = 200; //1 second

        setTimeout(function() {
            console.log("Balance2: " + currentBalance);



            //your code to be executed after 1 second

            console.log("currId99999: " + currentLotId);
            console.log("reserved " + reserved);

            if (doc.data().availability == 1 && (doc.data().userId=="Null") && currentLotId == null && currentBalance) {


                // Create a reference to the SF doc.
                var sfDocRef = db.collection("lots").doc(id);

                db.runTransaction((transaction) => {
                    return transaction.get(sfDocRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }

                        console.log("A: " + sfDoc.data().availability);
                        console.log("Lot id: " + currentLotId);

                        if (sfDoc.data().availability ==1) {

                            var thisreservationCount = sfDoc.data().reservations;



                            transaction.update(sfDocRef, { availability: 0, userId: currentUserId, reservations: (thisreservationCount+1)});
                            alert("Reserved Lot: " + lot1.lotId);
                            currentLotId = doc.data().lotId;
                            reserved = true;


                            // Create a reference to the SF doc.
                            var sfDocRef1 = db.collection("lots").doc("statistics");

                            db.runTransaction((transaction) => {
                                return transaction.get(sfDocRef1).then((sfDoc1) => {
                                    if (!sfDoc1.exists) {
                                        throw "Document does not exist!";
                                    }


                                        var currCap = sfDoc1.data().capacity;
                                        console.log("Curr Cap2: " + currCap)

                                        var reservationCount = sfDoc1.data().reservations;


                                        transaction.update(sfDocRef1, { capacity: currCap-1, reservations: (reservationCount+1)});




                                });
                            }).then(() => {
                                console.log("updated");
                            }).catch((err) => {
                                // This will be an "population is too big" error.
                                console.error(err);
                            });


                        } else {
                            currentLotId = null;
                            alert("Sorry someone beat you to it.");
                            return Promise.reject("Sorry! Someone beat you to it.");
                        }
                    });
                }).then(() => {
                    console.log("updated");
                }).catch((err) => {
                    // This will be an "population is too big" error.
                    console.error(err);
                });


            } else if ((currentLotId!="null" || currentLotId != null || currentLotId != "Null") && currentLotId!= oldlotId && lot1.availability == 1) {
                alert("Sorry already reserved in: " + currentLotId);
            } else if (lot1.availability == 0 && !reserved) {
                alert("Sorry Lot Already Taken: " + doc.data().lotId);

            }
            else if (currentBalance<=0) {
                alert("Sorry insufficient balance: " + currentBalance + ". Please add more funds in the pay tab");

            }
        }, delayInMilliseconds);


    })

    buildingUserId = doc.data().userId;
    console.log("building1 " + buildingUserId);
    console.log(buildingUserId != "Null")

    if(buildingUserId != "Null") {

        fill2(doc.data().userId, userId, rate);

    }

    console.log("reserved: " + reserved);
    console.log("lotId " + doc.data().lotId);
    console.log("curId" + currentUserId);
    console.log("doc user: " + doc.data().userId)
    var currentStatus = true;

    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    console.log("userId " + doc.data().userId);


                    if (doc.data().userId == currentUserId && doc.data().status == 0){
                        currentStatus = false;


                    }



                }
            );
        }
    );

    var delayInMilliseconds = 200; //1 second

    setTimeout(function() {

        if (doc.data().userId == currentUserId && !currentStatus) {
            li.appendChild(e);

        }
    }, delayInMilliseconds);


        console.log(availability);
    if (doc.data().availability == 1) {
        li.style.background ="#48474d";
    }

    if (doc.data().availability == 0) {
        li.style.background = 'red';

    }


    if(doc.data().userId == currentUserId )
        li.style.background = "#19e719";


    if(doc.data().issue == 1){
        li.style.background = "#fff300";
        userId.className = "blue-text";
        lotId.className = "blue-text";
        rate.className = "blue-text";



    }

    if(doc.data().issue == 0 && doc.data().availability == 0 && doc.data().userId != currentUserId)
        li.style.background = 'red';



    console.log("Unlock: " + unlockflag)


    if(doc.data().issue == 0 && doc.data().availability == 1){

                            li.appendChild(r);
                            li.style.background ="#48474d";


    }

   /* if(doc.data().issue == 0 && doc.data().availability == 1){

        db.collection("unlock").get().then(
            snapshot => {
                //console.log(snapshot)
                snapshot.docs.forEach(
                    doc => {

                        if(doc.data().unlockflag == 1) {
                            li.appendChild(s);
                            li.style.background = 'blue';
                        }


                    }
                );

            })

    }*/



    if (lot_depth > 10) {

        if (admin)
            li.appendChild(i);

        if (!admin && doc.data().userId == currentUserId && doc.data().issue == 0)
            li.appendChild(issue);

        if (admin && doc.data().issue == 1) {
            li.appendChild(resolveIssue);

        }
        /*if (admin && doc.data().issue == 1 && doc.data().userId!="Null") {
            li.appendChild(unlock);


        }*/


        li.appendChild(lotId);

        // li.appendChild(availability);
        if(doc.data().userId != "Null") {
            li.appendChild(userId);
        }
        else
            li.appendChild(rate);

            //li.appendChild(space)
        ul.appendChild(li);
       prune(searchId, "companies_ul", e, r);
        console.log("state curr: " + state);
        lot_depth--;
    }
    else{
        console.log("ld: " + lot_depth);

        if (admin)
            li.appendChild(i);

        if (!admin && doc.data().userId == currentUserId && doc.data().issue == 0)
            li.appendChild(issue);

        if (admin && doc.data().issue == 1) {
            li.appendChild(resolveIssue);
        }

        /*if (admin && doc.data().issue == 1 && doc.data().userId!="Null") {
            li.appendChild(unlock);


        }*/

            li.appendChild(lotId);

        //li.appendChild(availability);
        if(doc.data().userId != "Null") {
            li.appendChild(userId);
        }
        else
            li.appendChild(rate);

      //  li.appendChild(space)
        ul2.appendChild(li);
        prune(searchId, "companies_ul2", e, r);
        console.log("state curr: " + state);
        lot_depth--;

    }
    /*else if(lot_depth >4 && lot_depth<=9){
        console.log("ld: "+ lot_depth);

        if (admin)
            li.appendChild(i);

        if (!admin && doc.data().userId == currentUserId && doc.data().issue == 0)
            li.appendChild(issue);

        if (admin && doc.data().issue == 1) {
            li.appendChild(resolveIssue);

        }
        /!*if (admin && doc.data().issue == 1 && doc.data().userId!="Null") {
            li.appendChild(unlock);


        } not needed*!/

        li.appendChild(lotId);

        //li.appendChild(availability);

        if(doc.data().userId != "Null") {
            li.appendChild(userId);
        }
        else
            li.appendChild(rate);

       // li.appendChild(space)
        ul3.appendChild(li);
        prune(searchId, "companies_ul3", e, r);
        console.log("state curr: " + state);
        lot_depth--;


    }
    else if(lot_depth <=4){
        console.log("ld: "+ lot_depth);

        if (admin)
            li.appendChild(i);

        if (!admin && doc.data().userId == currentUserId && doc.data().issue == 0)
            li.appendChild(issue);

        if (admin && doc.data().issue == 1) {
            li.appendChild(resolveIssue);
        }
        /!*if (admin && doc.data().issue == 1 && doc.data().userId!="Null") {
            li.appendChild(unlock);


        }*!/

            li.appendChild(lotId);

        //li.appendChild(availability);

        if(doc.data().userId != "Null") {
            li.appendChild(userId);
        }
        else
            li.appendChild(rate);

       //li.appendChild(space)
        ul4.appendChild(li);

        prune(searchId, "companies_ul4", e, r);
        lot_depth--;


    }*/

}


db.collection("lots").orderBy("lotId").onSnapshot(
    snapshot => {
        let changes = snapshot.docChanges();
        console.log(changes)
        changes.forEach(
            change => {
                console.log(change.type)
                console.log(change.doc.data())

                switch (change.type) {
                    case "added":
                        db.collection("lots").orderBy("lotId")
                        renderCompany(change.doc);
                        db.collection("lots").orderBy("lotId")
                        break;
                    case "removed":
                        db.collection("lots").orderBy("lotId")
                        document.getElementById("companies_ul").innerHTML = "";
                        document.getElementById("companies_ul2").innerHTML = "";
                        document.getElementById("companies_ul3").innerHTML = "";
                        document.getElementById("companies_ul4").innerHTML = "";


                        fill();
                        db.collection("lots").orderBy("lotId")
                        break;
                    case "updated":
                        db.collection("lots").orderBy("lotId")

                        document.getElementById("companies_ul").innerHTML = "";
                        document.getElementById("companies_ul2").innerHTML = "";
                        document.getElementById("companies_ul3").innerHTML = "";
                        document.getElementById("companies_ul4").innerHTML = "";


                        fill();
                        db.collection("lots").orderBy("lotId")

                        break;
                    case "modified":
                        db.collection("lots").orderBy("lotId")

                        document.getElementById("companies_ul").innerHTML = "";
                        document.getElementById("companies_ul2").innerHTML = "";
                        document.getElementById("companies_ul3").innerHTML = "";
                        document.getElementById("companies_ul4").innerHTML = "";

                        fill();
                        db.collection("lots").orderBy("lotId")

                        break;
                    default:

                        break;
                }
                // if (change.type === "added") {
                //     renderCompany(change.doc);
                // }
            }
        )
    }
);


db.collection("users").orderBy("userId").onSnapshot(
    snapshot => {
        let changes = snapshot.docChanges();
        console.log(changes)
        changes.forEach(
            change => {
                console.log(change.type)
                console.log(change.doc.data())

                switch (change.type) {
                    case "added":
                       // renderCompany(change.doc);
                        get_balance_and_limit();
                        break;
                    case "removed":
                        document.getElementById("companies_ul").innerHTML = "";
                        document.getElementById("companies_ul2").innerHTML = "";
                        document.getElementById("companies_ul3").innerHTML = "";
                        document.getElementById("companies_ul4").innerHTML = "";
                        get_balance_and_limit();

                        fill();
                        break;
                    case "updated":

                        document.getElementById("companies_ul").innerHTML = "";
                        document.getElementById("companies_ul2").innerHTML = "";
                        document.getElementById("companies_ul3").innerHTML = "";
                        document.getElementById("companies_ul4").innerHTML = "";

                        get_balance_and_limit();

                        fill();

                        break;
                    case "modified":

                        document.getElementById("companies_ul").innerHTML = "";
                        document.getElementById("companies_ul2").innerHTML = "";
                        document.getElementById("companies_ul3").innerHTML = "";
                        document.getElementById("companies_ul4").innerHTML = "";
                        get_balance_and_limit();

                        fill();

                        break;
                    default:

                        document.getElementById("companies_ul").innerHTML = "";
                        document.getElementById("companies_ul2").innerHTML = "";
                        document.getElementById("companies_ul3").innerHTML = "";
                        document.getElementById("companies_ul4").innerHTML = "";
                        get_balance_and_limit();

                        fill();
                        break;
                }
                // if (change.type === "added") {
                //     renderCompany(change.doc);
                // }
            }
        )
    }
);

/*

db.collection("unlock").onSnapshot(
    snapshot => {
        let changes = snapshot.docChanges();
        console.log(changes)
        changes.forEach(
            change => {
                console.log(change.type)
                console.log(change.doc.data())

                switch (change.type) {
                    case "added":
                        // renderCompany(change.doc);
                        break;
                    case "removed":
                        document.getElementById("companies_ul").innerHTML = "";
                        document.getElementById("companies_ul2").innerHTML = "";
                        document.getElementById("companies_ul3").innerHTML = "";
                        document.getElementById("companies_ul4").innerHTML = "";


                        fill();
                        break;
                    case "updated":

                        document.getElementById("companies_ul").innerHTML = "";
                        document.getElementById("companies_ul2").innerHTML = "";
                        document.getElementById("companies_ul3").innerHTML = "";
                        document.getElementById("companies_ul4").innerHTML = "";


                        fill();

                        break;
                    case "modified":

                        document.getElementById("companies_ul").innerHTML = "";
                        document.getElementById("companies_ul2").innerHTML = "";
                        document.getElementById("companies_ul3").innerHTML = "";
                        document.getElementById("companies_ul4").innerHTML = "";

                        fill();

                        break;
                    default:

                        document.getElementById("companies_ul").innerHTML = "";
                        document.getElementById("companies_ul2").innerHTML = "";
                        document.getElementById("companies_ul3").innerHTML = "";
                        document.getElementById("companies_ul4").innerHTML = "";

                        break;
                }
                // if (change.type === "added") {
                //     renderCompany(change.doc);
                // }
            }
        )
    }
);
*/



//checks if user is in database and updates Header
function check(){
    var nummers = db.collection("users").where("userId", "==", currentUserId)
    nummers.get().then(function (querySnapshot) {
        console.log("result: "+ !querySnapshot.empty)

        if(!querySnapshot.empty) {

            //your code to be executed after 0.5 second
            console.log("Found ");

            header.textContent = "Currently Logged in as User:   " + currentUserId;
            admin = false;
            myHours.style.display = "block";
            myLogin.style.display = "none";
            getStart.style.display = "none";
            logOut.style.display = "block";

        }
        else{
            header.textContent = currentUserId + " was not recognized. ";


        }

    })

}


form1.addEventListener("submit", (e) => {
    //currentUserId = form.company_userId.value;
    e.preventDefault();

    oldlotId = currentLotId;
    currentUserId = form1.new_user_id.value;

    if(currentUserId == adminId || currentUserId == adminId2 || currentUserId == adminId3) {
        header.textContent = "Currently Logged in as Admin:   " + currentUserId;
        admin = true;
        myLogin.style.display = "none";
        getStart.style.display = "none";
        logOut.style.display = "block";
    }
    else
        check();




    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if(doc.data().userId == currentUserId){

                        header2.textContent = "Currently Set to " + doc.data().limit + " hours";

                    }
                }
            );
        }
    );


    //
    //  clear the form
    form1.new_user_id.value = '';
    document.getElementById("companies_ul").innerHTML = "";
    document.getElementById("companies_ul2").innerHTML = "";
    document.getElementById("companies_ul3").innerHTML = "";
    document.getElementById("companies_ul4").innerHTML = "";


    fill();



    // alert("Data saved!");
})


form4.addEventListener("submit", (e) => {
    //currentUserId = form.company_userId.value;
    e.preventDefault();

    var limit = form4.company_limit.value;

    console.log("LLL: " + limit)


    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (doc.data().userId == currentUserId) {

                        db.collection("users").doc(doc.id).update({limit: limit});
                        header2.textContent = "Currently Set to   " + doc.data().limit + " hours";

                    }
                }
            );
        }
    );
})


form5.addEventListener("submit", (e) => {
    //currentUserId = form.company_userId.value;
    e.preventDefault();

    var desc = form5.desc.value;

    var licno = form5.lic.value;

    db.collection("issues").orderBy('lotId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (doc.data().lotId === currentLotId) {
                        db.collection("issues").doc(doc.id).update({description: desc});
                        db.collection("issues").doc(doc.id).update({lic: licno});


                    }
                }
            );
        }
    );
    modal.style.display = "none";

})

/*form2.addEventListener("submit", (e) => {
    e.preventDefault();

    if(currentUserId == adminId) {
        window.location.replace("https://parkingmapapp.herokuapp.com/addlot.html");

    }
    else {
       alert("Admin-only function");
    }




    })*/

function fill(){
    //
//  get data
    lot_depth = 19;
    currentLotId = null;

     db.collection("lots").orderBy('lotId').get().then(
         snapshot => {
             //console.log(snapshot)
             snapshot.docs.forEach(
                 doc => {
                     console.log("lotId" + doc.data().lotId)
                     renderCompany(doc);
                 }
             );
         }
     );

}


function fill2(buildingUserId, userId, rate){

    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    console.log("building2 " + buildingUserId);
                    console.log("userId " + doc.data().userId);


                    if (doc.data().userId == buildingUserId){
                        if(doc.data().status == 1){
                            userId.textContent+= "Someone is currently parked";
                        }
                        else if(doc.data().status == 0){
                            userId.textContent+= "Someone has reserved";

                        }

                    }

                }
            );
        }
    );
}


function prune(id, column, e, r){
    const c = document.getElementById(column);
    let item = c.querySelector('[data-id=' + id + ']');
    console.log("item " + item.className);
    //c.removeChild(item);


    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (currentUserId == doc.data().userId) {

                        state = doc.data().status;
                    }



                }
            );
        }
    );

    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {

                    let new1;
                    if (currentUserId == doc.data().userId) {
                        console.log("state inner: " + doc.data().status);


                        if (state == 1) {
                            item.removeChild(e);
                        }


                    } else {
                        if (state == 1) {
                            item.removeChild(r);
                        }

                    }


                }
            );
        }
    );


}


console.log("Starting Yacht Thot Client..")

document.getElementById("mobile-menu").onclick = function() {
    document.getElementById("mobile-menu-content").classList.toggle("mobile-menu-active")
}

if(document.getElementById("thot-profile-like")) {
    /** LIKE CIRCLE
    document.getElementById("thot-profile-like").onclick = function() {
        document.getElementById("thot-profile-like-icon").classList.toggle("fa-solid")
        document.getElementById("thot-profile-like-icon").classList.toggle("fa-regular")
        document.getElementById("thot-profile-like-icon").classList.toggle("green-icon")
    }**/
    document.getElementById("thot-profile-back").onclick = function() {
        window.location.href = "/feed"
    }
}


function likeProfile(user_id) {
    alert("Liking " + user_id)
}

window.likeProfile = likeProfile;

var messages_body = document.getElementById("messages-body")

function sendIM(message) {
    //alert(message)
    document.getElementById("messages-textbox").value = ""

    var my_message = document.createElement("div")
    my_message.classList.add("my-message")
    my_message.innerHTML = message;
    messages_body.appendChild(my_message)
    messages_body.scrollTop = messages_body.scrollHeight;


    var payload = {
        message_content: message,
        to_uid: document.getElementById("messages-textbox").dataset.uid
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
           console.log(this.responseText)

        }
    }
    xhttp.open("POST", "/send-private-message", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify( payload ));


}
function checkMessage(e) {
    var key = e.keyCode;

    // If the user has pressed enter
    if (key === 13) {
        sendIM(document.getElementById("messages-textbox").value);
        e.preventDefault();
        return false;
    }
    else {
        return true;
    }
}
window.checkMessage = checkMessage;



/** setInterval(function() {
   
}, 1000);

**/
if(document.getElementById("onboarding-submit-thot")) {
    document.getElementById("onboarding-submit-thot").onclick = function() {
        submitOnboarding()
    }
    document.getElementById("onboarding-captain-submit").onclick = function() {
        submitOnboarding()
    }
}

function submitOnboarding() {
    var payload = {
        role: role,
        username: document.getElementById("thot-username").value,
        location: document.getElementById("thot-location").value,
        birthday: document.getElementById("thot-birthday").value,
        tagline: document.getElementById("thot-tagline").value,
        bio: document.getElementById("thot-bio").value
    }
    if(role == "CAPTAIN") {
        payload = {
            role: role,
            username: document.getElementById("captain-username").value,
            location: document.getElementById("captain-location").value,
            boat_name: document.getElementById("captain-boat-name").value,
            tagline: document.getElementById("captain-tagline").value,
            bio: document.getElementById("captain-bio").value,
            boat_year: document.getElementById("captain-onboarding-year").value,
            boat_length: document.getElementById("captain-onboarding-length").value,
            boat_capacity: document.getElementById("captain-onboarding-capacity").value,
            boat_bathrooms: document.getElementById("captain-boat-bathrooms").value,
            boat_bedrooms: document.getElementById("captain-boat-bedrooms").value,
            boat_floors: document.getElementById("captain-boat-floors").value,
            amenities: amenities
        }
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
           console.log(this.responseText)

            window.location.href = "/my-profile"
        }
    }
    xhttp.open("POST", "/submit-onboarding", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify( payload ));
}
function populateEvents() {
   // document.getElementById("no-profile-events").style.display = "none";
}

populateEvents();


var test_data = [
    {
        event_img_url: "",
        event_name: "",
        event_datetime: ""
    }
]

function showMessagesInterface() {

}


//////////////////////////START///////////////////////////////

if(document.getElementById("profile-image-edit")) {
    document.getElementById("profile-image-edit").onclick = function() {
        document.getElementById("profile-image-upload").click();
    }

    document.getElementById("profile-image-upload").addEventListener('input', function (evt) {
        console.log(this.value);
    });
}

if(window.location.href.includes("profile")) {
    document.getElementById("profile-ab-icon").style.color = "dodgerblue"
    if(profile_data.role == "CAPTAIN") {
        for (var key in profile_data.amenities) {
            if (profile_data.amenities.hasOwnProperty(key)) {
                if(profile_data.amenities[key] == 0) {
                    document.getElementById("pa-" + key).style.display = "none"
                }
            }
        }
    }
}

if(window.location.href.includes("/feed")) {
    document.getElementById("feed-ab-icon").style.color = "dodgerblue"
}

if(window.location.href.includes("/messages")) {
    document.getElementById("messages-ab-icon").style.color = "dodgerblue"
}

if(document.getElementById("messages-ab-icon")) {
    document.getElementById("profile-ab").onclick = function() {
        window.location.href = "/my-profile"
    }
    document.getElementById("feed-ab").onclick = function() {
        window.location.href = "/feed"
    }
    document.getElementById("messages-ab").onclick = function() {
        window.location.href = "/messages"
    }
}

if(user_data.username == null && !window.location.href.includes("/onboarding") && user_data != -1) {
    window.location.href = "/onboarding"
 }
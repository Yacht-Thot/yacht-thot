
console.log("Starting Yacht Thot Client..")

document.getElementById("mobile-menu").onclick = function() {
    document.getElementById("mobile-menu-content").classList.toggle("mobile-menu-active")
}

if(document.getElementById("thot-profile-like")) {
    document.getElementById("thot-profile-like").onclick = function() {
        document.getElementById("thot-profile-like-icon").classList.toggle("fa-solid")
        document.getElementById("thot-profile-like-icon").classList.toggle("fa-regular")
        document.getElementById("thot-profile-like-icon").classList.toggle("green-icon")
    }
    document.getElementById("thot-profile-back").onclick = function() {
        window.location.href = "/captain-feed"
    }
}



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

            window.location.href = "/profile"
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
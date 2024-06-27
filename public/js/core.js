
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
}
function submitOnboarding() {
    console.log("T")

    var payload = {
        role: role,
        username: document.getElementById("thot-username").value,
        birthday: document.getElementById("thot-birthday").value,
        tagline: document.getElementById("thot-tagline").value,
        bio: document.getElementById("thot-bio").value

    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
           console.log(this.responseText)

            
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

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
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var stats = JSON.parse(this.responseText)
            var followers_total = 0;
            var following_total = 0;
            for (var key in stats) {
                if (stats.hasOwnProperty(key)) {
                    document.getElementById(key).innerHTML = stats[key];
                    if(key.includes("followers")) {
                        try {
                            followers_total = followers_total + parseInt(stats[key])
                        } catch(e) {}
                    }
                    if(key.includes("following")) {
                        try {
                            following_total = following_total + parseInt(stats[key])
                        } catch(e) {}
                    }
                }
            }

            document.getElementById("followers-total").innerHTML = followers_total;
            document.getElementById("following-total").innerHTML = following_total;

            console.log(stats["log"])
        }
    }
    xhttp.open("GET", "/update", true);
    xhttp.send();
}, 1000);

**/

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
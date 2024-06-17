
console.log("Starting Yacht Thot Client..")

document.getElementById("mobile-menu").onclick = function() {
    document.getElementById("mobile-menu-content").classList.toggle("mobile-menu-active")
}


if(document.getElementById("onboard-captain")) {
document.getElementById("onboard-captain").onclick = function() {
    var glb = document.getElementsByClassName("g_id_signin")[0]

    glb.style.display = "inherit"

    if(document.getElementById("onboard-thot").classList.contains("active-onboarding")) {
        document.getElementById("onboard-thot").classList.remove("active-onboarding")
    }
    document.getElementById("onboard-captain").classList.add("active-onboarding")
}

document.getElementById("onboard-thot").onclick = function() {
    var glb = document.getElementsByClassName("g_id_signin")[0]

    glb.style.display = "inherit"
    if(document.getElementById("onboard-captain").classList.contains("active-onboarding")) {
        document.getElementById("onboard-captain").classList.remove("active-onboarding")
    }
    document.getElementById("onboard-thot").classList.add("active-onboarding")
}
}
function showStep(step) {
    switch(step) {
        case 1:
            document.getElementById("step2-1").style.opacity = "0"
            document.getElementById("step2-2").style.opacity = "0"
            setTimeout(function() {
                document.getElementById("step2-1").style.opacity = "1"
                document.getElementById("step2-2").style.opacity = "1"
                }, 1000)
        break;
        case 2:
            document.getElementById("step1-1").style.opacity = "0"
            document.getElementById("step1-2").style.opacity = "0"
            
            setTimeout(function() {
            document.getElementById("step1-1").style.display = "none"
            document.getElementById("step1-2").style.display = "none"
            document.getElementById("step2-1").style.opacity = "1"
            document.getElementById("step2-2").style.opacity = "1"
            }, 1000)
        break;
        case 3:

        break;
        case 4:

        break;
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
    document.getElementById("no-profile-events").style.display = "none";
}

populateEvents();


var test_data = [
    {
        event_img_url: "",
        event_name: "",
        event_datetime: ""
    }
]
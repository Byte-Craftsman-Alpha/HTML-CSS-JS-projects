function rotateHand(hand) {
    document.querySelector("div.hrs-hand").style.transform = "rotate(30deg)";
}

class Clock {
    constructor(hrsHand, minHand, secHand) {
        this.hrsHand = document.querySelector(hrsHand);
        this.minHand = document.querySelector(minHand);
        this.secHand = document.querySelector(secHand);

    }

    rotate(hrsHand = 0, minHand = 0, secHand = 0) {
        this.hrsHand.style.transform = `rotate(${parseInt(hrsHand)}deg)`;
        this.minHand.style.transform = `rotate(${parseInt(minHand)}deg)`;
        this.secHand.style.transform = `rotate(${parseInt(secHand)}deg)`;
    }

    maintainDigitalClock(hrsDisplay, minDisplay, secDisplay) {
        this.hrsDisplay = document.querySelector(hrsDisplay);
        this.minDisplay = document.querySelector(minDisplay);
        this.secDisplay = document.querySelector(secDisplay);
        
        var date = new Date(); //"2025-06-30T07:44:51"
        this.hrsDisplay.innerText = String(date.getHours()).padStart(2, "0");
        this.minDisplay.innerText = String(date.getMinutes()).padStart(2, "0");
        this.secDisplay.innerText = String(date.getSeconds()).padStart(2, "0");
    }

    adjust() {
        var date = new Date(); //"2025-06-30T07:44:51"
        var adjustmentData = {
            hour: {
                count: date.getHours(),
                secondsInIt: (date.getHours() * 60 * 60),
                hand_rotation: ((date.getHours() * 30) + (date.getMinutes() * 0.5) + (date.getSeconds() / 120))
            },
            minute: {
                count: date.getMinutes(),
                secondsInIt: (date.getMinutes() * 60),
                hand_rotation: ((date.getMinutes() * 6) + (0.1 * date.getSeconds()))
            },
            seconds: {
                count: date.getSeconds(),
                secondsInIt: date.getSeconds(),
                hand_rotation: (date.getSeconds() * 6)
            }
        };

        this.rotate(
            adjustmentData.hour.hand_rotation,
            adjustmentData.minute.hand_rotation,
            adjustmentData.seconds.hand_rotation
        );
        // console.table(adjustmentData);
    }
}

var myclock = new Clock("div.hrs-hand", "div.min-hand", "div.sec-hand");

function startClock() {
    myclock.adjust();
    myclock.maintainDigitalClock(
        "span.hrs-display",
        "span.min-display",
        "span.sec-display"
    )
}
var startFlag = setInterval(startClock, 1000);
document.addEventListener("visibilitychange", (e) => {
    if(document.visibilityState == "visible") {
        startFlag = setInterval(startClock, 1000);
        console.log("Clock started workin...");
    } else {
        clearInterval(startFlag);
        console.log("I will working, as soon as you get back...")
    }
})

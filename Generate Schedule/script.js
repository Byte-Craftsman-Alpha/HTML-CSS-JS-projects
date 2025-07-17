document.querySelectorAll('input[type=radio]').forEach(radioInput => {
    radioInput.addEventListener("input", (e) => {
        document.querySelectorAll(`label[name=${e.target.getAttribute("name")}]`).forEach(label => {
            if (label.getAttribute("for") === e.target.id) {
                label.setAttribute("checked", "");
            } else {
                label.removeAttribute("checked");
            }
        });
    });
});

class scheduleForm {
    formElement = null;
    dateTime = [];
    lastResponse = null;

    constructor() {
        this.formElement = document.querySelector(".scheduleInputDialog[scheduleForm]");

        this.formElement.querySelector("button.closeButton").addEventListener("click", () => {
            this.close();
        });

        this.formElement.querySelector("button.cancel").addEventListener("click", () => {
            this.close();
        });

        this.formElement.querySelector("button.add").addEventListener("click", () => {
            const response = this.getData();
            console.log(response);
            response.dateTime.forEach(date_info => {
                scheduleData[date_info.day].push({
                    heading: response.heading,
                    body: response.body,
                    startTime: date_info.startTime,
                    endTime: date_info.endTime,
                    color: response.color
                });
            });
            generateScheduleGrid();
            this.close();
        });

        this.formElement.querySelector("button[add-date]").addEventListener("click", () => {
            const dateTime = {
                day: this.formElement.querySelector("select#schedule-day").value,
                startTime: this.formElement.querySelector("input#start-time").value,
                endTime: this.formElement.querySelector("input#end-time").value
            }
            if (!dateTime.day || !dateTime.endTime || !dateTime.endTime) {
                alert("Fill the day, start time and end time properly...")
            } else {
                const dateTimeDisplay = this.formElement.querySelector("div.saved-date-time");
                const tile = document.createElement("div");
                tile.classList.add("saved-date-time-tile");
                tile.innerHTML = `<span class="day">
                            ${dateTime.day}
                        </span>
                        <span class="start-time">
                            ${dateTime.startTime}
                        </span>
                        <span class="end-time">
                            ${dateTime.endTime}
                        </span>
                        <button class="delete" value="${dateTime.identifier}" onclick="this.parentElement.remove()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"
                                    d="M9.17 4a3.001 3.001 0 0 1 5.66 0m5.67 2h-17m15.333 2.5l-.46 6.9c-.177 2.654-.265 3.981-1.13 4.79s-2.196.81-4.856.81h-.774c-2.66 0-3.991 0-4.856-.81c-.865-.809-.954-2.136-1.13-4.79l-.46-6.9M9.5 11l.5 5m4.5-5l-.5 5" />
                            </svg>
                        </button>`;
                dateTimeDisplay.appendChild(tile);
            }
        });

    }

    open() {
        this.reset();
        this.formElement.removeAttribute("hidden");
    }

    close() {
        this.reset();
        this.formElement.setAttribute("hidden", "");
    }

    isOpen() {
        return !this.formElement.hasAttribute("hidden");
    }

    reset() {
        this.formElement.querySelector("input[name=scheduleHeading]").value = "";
        this.formElement.querySelector("textarea[name=scheduleBody]").value = "";
        this.formElement.querySelector("input[name=start-time]").value = "09:00";
        this.formElement.querySelector("input[name=end-time]").value = "10:00";
        this.formElement.querySelector("select#schedule-day").value = "Monday";
        this.formElement.querySelector("div.saved-date-time").replaceChildren();
        this.formElement.querySelectorAll("input[name=ScheduleColor]")[0].click()
    }

    getData() {
        const response = {
            heading: this.formElement.querySelector("#scheduleHeading").value,
            body: this.formElement.querySelector("#scheduleBody").value,
            dateTime: [],
            color: this.formElement.querySelector('input[name=ScheduleColor]:checked').id,
        }

        const seen = new Set();

        const uniqueDateTimes = Array.from(this.formElement.querySelectorAll("div.saved-date-time-tile"))
            .map(el => ({
                day: el.querySelector("span.day")?.innerText.trim(),
                startTime: el.querySelector("span.start-time")?.innerText.trim(),
                endTime: el.querySelector("span.end-time")?.innerText.trim()
            }))
            .filter(obj => {
                const key = JSON.stringify(obj);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        response.dateTime = uniqueDateTimes;

        //console.log(response);
        if (response.heading !== "" && response.dateTime.length > 0) {
            this.lastResponse = response;
            return response;
        } else {
            alert("incomplete data")
        }
    }
}

const schedule = new scheduleForm();

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    if (schedule.isOpen()) {
        schedule.close();
        console.group("Closing the schedule form")

    } else {
        schedule.open();
        console.group("Opening the schedule form")

    }
})
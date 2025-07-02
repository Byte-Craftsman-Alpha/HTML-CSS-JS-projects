function print(...data) {
    const display = document.querySelector("code[debug-output]");
    display.innerText = `${display.innerText}\n${data}\n`;
}

class calculator {
    historyForCalculation = [];
    historyForDisplay = [];
    result = {
        current: "0",
        last: "0"
    }

    constructor(value_display, history_display) {
        this.displayContainer = document.querySelector(value_display);
        this.historyContainer = document.querySelector(history_display);
    }

    input(inputValue) {
        try {
            this.historyForDisplay.push(inputValue);
            inputValue = String(inputValue).replaceAll("%", "/100*");
            this.historyForCalculation.push(inputValue);
            
            this.result.last = this.result.current;
            this.result.current = eval(this.historyForCalculation.join("").replace(/[^a-zA-Z0-9]{1,2}$/, ''));
            this.display();
        } catch {
            this.raiseError();
        }
    }

    display() {
        this.displayContainer.innerText = this.result.current;
        this.historyContainer.innerText = (this.historyForDisplay.length > 0) ? this.historyForDisplay.join("") : "0";
    }

    reset() {
        try {
            this.historyForCalculation = [];
            this.historyForDisplay = [];
            this.result = {
                current: "0",
                last: "0"
            }
            
            this.display();
        } catch {
            this.raiseError();
        }
    }

    evaluateFinal() {
        try {
            this.historyForCalculation = [];
            this.historyForDisplay = [];
            this.result.last = "0";
            
            this.displayContainer.innerText = "0";
            this.historyContainer.innerText = this.result.current;
        } catch {
            this.raiseError();
        }
    }

    backSpace() {
        try {
            this.historyForCalculation.pop();
            this.historyForDisplay.pop();
            
            this.result.last = this.result.current;
            this.result.current = eval(this.historyForCalculation.join("").replace(/[^a-zA-Z0-9]{1,2}$/, ''));
            this.display();
        } catch {
            this.raiseError();
        }
    }

    raiseError() {
        alert("Error(0?0) Contact Developer...")
    }
}

var calc = new calculator("[display-value]","[disply-history]");

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", (e) => {
        if (e.target.classList.contains("controlBtn")) {
            var control = e.target.getAttribute("ctrl");
            if (control == "reset") {
                // reset 
                calc.reset();

            } else if (control == "evaluate") {
                // evaluate final
                calc.evaluateFinal();

            } else if (control == "pop") {
                // clear digit
                calc.backSpace();

            }
        } else if (e.target.classList.contains("numeric")) {
            var value = e.target.getAttribute("value");
            // Numeric handling
            calc.input(value);

        } else if (e.target.classList.contains("operator")) {
            var operator = e.target.getAttribute("value");
            // operator handling
            calc.input(operator);

        }
    })
})
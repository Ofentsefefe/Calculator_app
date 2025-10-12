let equal_pressed = 0;
let button_input = document.querySelectorAll(".number-btn, .operator-btn");
let input = document.getElementById("input");
let equal = document.getElementById("equal");
let clear = document.getElementById("clear");
let erase = document.getElementById("erase");

// Initializing calculator
window.onload = () => {
    input.value = "";
};

// Adding event listeners to number and operator buttons
button_input.forEach((button_class) => {
    button_class.addEventListener("click", () => {
        if (equal_pressed == 1) {
            input.value = "";
            equal_pressed = 0;
        }
        
        // Handling percentage button
        if (button_class.value === "%") {
            try {
                // Converting current value to percentage
                let currentValue = input.value;
                if (currentValue) {
                    // If there's an operator, this calculate the  percentage of the previous number
                    const operators = ['+', '-', '*', '/'];
                    let lastOperatorIndex = -1;
                    
                    for (let i = currentValue.length - 1; i >= 0; i--) {
                        if (operators.includes(currentValue[i])) {
                            lastOperatorIndex = i;
                            break;
                        }
                    }
                    
                    if (lastOperatorIndex !== -1) {
                        // There's an operator, so we  calculating the percentage of the second operand
                        const firstPart = currentValue.substring(0, lastOperatorIndex + 1);
                        const secondPart = currentValue.substring(lastOperatorIndex + 1);
                        
                        if (secondPart) {
                            const percentageValue = parseFloat(secondPart) / 100;
                            input.value = firstPart + percentageValue;
                        }
                    } else {
                        // No operator, just converting the whole number to percentage
                        input.value = parseFloat(currentValue) / 100;
                    }
                }
            } catch (err) {
                input.value = "Error";
            }
        } else {
            input.value += button_class.value;
        }
    });
});

// Equal button functionality
equal.addEventListener("click", () => {
    equal_pressed = 1;
    let inp_val = input.value;
    
    try {
        // Replacing × with * for proper evaluation
        inp_val = inp_val.replace(/×/g, '*');
        
        // Evaluating the expression
        let solution = eval(inp_val);
        
        // Handling division by zero
        if (!isFinite(solution)) {
            input.value = "Cannot divide by zero";
            return;
        }
        
        // Formating the solution
        if (Number.isInteger(solution)) {
            input.value = solution;
        } else {
            // Limiting to 8 decimal places to avoid floating point precision issues
            input.value = parseFloat(solution.toFixed(8)).toString();
        }
    } catch (err) {
        input.value = "Error";
    }
});

// Clearing button functionality
clear.addEventListener("click", () => {
    input.value = "";
    equal_pressed = 0;
});

// Deleting button functionality
erase.addEventListener("click", () => {
    input.value = input.value.substr(0, input.value.length - 1);
});

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;
    
    // Preventing default for calculator keys
    if (/[0-9+\-*/.%=]|Enter|Backspace|Delete|Escape/.test(key)) {
        event.preventDefault();
    }
    
    // Handle number and operator keys
    if (/[0-9+\-*/.]/.test(key)) {
        if (equal_pressed == 1) {
            input.value = "";
            equal_pressed = 0;
        }
        input.value += key;
    }
    
    // Handle Enter key (=)
    if (key === "Enter" || key === "=") {
        equal.click();
    }
    
    // Handle Backspace key
    if (key === "Backspace") {
        erase.click();
    }
    
    // Handle Escape key (AC)
    if (key === "Escape" || key === "Delete") {
        clear.click();
    }
    
    // Handle percentage key
    if (key === "%") {
        // temporary button to trigger percentage functionality
        const tempBtn = document.createElement('button');
        tempBtn.value = '%';
        button_input.forEach(btn => {
            if (btn.value === '%') {
                btn.click();
            }
        });
    }
});

// animation to display when result is shown
const originalEqualClick = equal.click;
equal.click = function() {
    const display = document.querySelector('.display input');
    display.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        display.style.transform = 'scale(1)';
    }, 150);
    
    originalEqualClick.apply(equal);
};

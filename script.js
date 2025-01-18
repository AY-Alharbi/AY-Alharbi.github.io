// Function to generate a random password based on selected options or custom input
function generatePassword() {
    let dictionary = "";

    // Get custom characters input
    const customChars = document.getElementById("customChars").value;
    if (customChars) {
        dictionary = customChars.replace(/\s/g, ""); // Remove spaces from custom characters
    } else {
        // Add character sets based on user choices
        if (document.getElementById("Uppercase").checked) dictionary += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (document.getElementById("Lowercase").checked) dictionary += "abcdefghijklmnopqrstuvwxyz";
        if (document.getElementById("Number").checked) dictionary += "0123456789";
        if (document.getElementById("Symbols").checked) dictionary += "!@#$%^&*_-";
    }

    // Check if dictionary is empty (no options selected)
    if (!dictionary) {
        displayError("Please choose at least one option or enter custom characters.");
        return;
    } else {
        hideErrorMessage();  // Hide error message when an option is selected
    }

    // Generate password
    const length = parseInt(document.getElementById("passwordLength").value, 10);
    const password = Array.from({ length }, () => {
        const randomIndex = Math.floor(Math.random() * dictionary.length);
        return dictionary[randomIndex];
    }).join("");

    // Display the generated password
    document.getElementById("passwordField").value = password;

    // Check and display password strength
    evaluatePasswordStrength(password);
}

// Function to display error messages
function displayError(message) {
    let errorElement = document.querySelector(".error-message");

    // Create error message element if it doesn't exist
    if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.className = "error-message";
        errorElement.style.color = "red";
        errorElement.style.marginTop = "10px";
        document.querySelector(".generator").appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = "block";
}

// Function to hide error message
function hideErrorMessage() {
    const errorElement = document.querySelector(".error-message");
    if (errorElement) {
        errorElement.style.display = "none";
    }
}

// Function to evaluate password strength
function evaluatePasswordStrength(password) {
    const strengthDisplay = document.getElementById("strengthResult");

    if (!strengthDisplay) return;

    let hasLowercase = /[a-z]/.test(password);
    let hasUppercase = /[A-Z]/.test(password);
    let hasSymbols = /[\W_]/.test(password); 
    let hasNumbers = /\d/.test(password);
    let isLongEnough = password.length >= 12;

    let conditionsMet = [hasLowercase, hasUppercase, hasSymbols, hasNumbers].filter(Boolean).length;

    let strength = "Weak";

    if (conditionsMet >= 3 && isLongEnough) {
        strength = "Strong";
    } else if (conditionsMet >= 2 && isLongEnough  || conditionsMet >= 3 ) {
        strength = "Moderate";
    }

    strengthDisplay.textContent = `Strength: ${strength}`;
}

// Function to set up event listeners for interactions
function setupEventListeners() {
    // Regenerate password when checkboxes or the "Generate" button is clicked
    document.querySelectorAll('input[type="checkbox"], button.generate').forEach(elem => {
        elem.addEventListener("click", generatePassword);
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(elem => {
        elem.addEventListener("click", () => {
            console.log(`${elem.id} clicked`); 
            generatePassword(); 
        });
    });
    
    // Update password length based on slider input
    const slider = document.getElementById("passwordLength");
    const lengthValue = document.getElementById("lengthValue");
    slider.addEventListener("input", () => {
        lengthValue.textContent = slider.value;
        generatePassword(); // Regenerate password based on new slider value
    });

    // Copy password to clipboard when "Copy" button is clicked
    const copyButton = document.getElementById("copyButton");
    copyButton.addEventListener("click", () => {
        const password = document.getElementById("passwordField").value;
        if (password) {
            navigator.clipboard.writeText(password).then(() => {
                copyButton.textContent = "Done";
                setTimeout(() => {
                    copyButton.textContent = "Copy";
                }, 2000);
            });
        }
    });

}

// Initialize the password generator when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();  // Set up event listeners
    generatePassword();  // Generate an initial password on page load
});
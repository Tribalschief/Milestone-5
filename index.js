"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jspdf_1 = require("jspdf");
// Ensure DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Access form elements
    var resumeForm = document.getElementById('resume-form');
    // Access form fields
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var educationInput = document.getElementById('education');
    var workExperienceInput = document.getElementById('work-experience');
    var skillsInput = document.getElementById('skills');
    // Access output fields
    var outputName = document.getElementById('output-name');
    var outputEmail = document.getElementById('output-email');
    var outputEducation = document.getElementById('output-education');
    var outputWorkExperience = document.getElementById('output-work-experience');
    var outputSkills = document.getElementById('output-skills');
    // Access buttons and shareable link field
    var copyLinkBtn = document.getElementById('copy-link');
    var downloadPdfBtn = document.getElementById('download-pdf');
    var shareLink = document.createElement('input'); // Create a hidden input for storing the share link
    // Validate form function
    function validateForm() {
        var isValid = true;
        // Clear previous errors (if any)
        var formFields = [nameInput, emailInput, educationInput, workExperienceInput, skillsInput];
        formFields.forEach(function (field) {
            field.style.borderColor = '';
        });
        // Basic validation
        if (!nameInput.value.trim()) {
            nameInput.style.borderColor = 'red';
            isValid = false;
        }
        if (!emailInput.value.includes('@') || !emailInput.value.trim()) {
            emailInput.style.borderColor = 'red';
            isValid = false;
        }
        if (!educationInput.value.trim()) {
            educationInput.style.borderColor = 'red';
            isValid = false;
        }
        if (!workExperienceInput.value.trim()) {
            workExperienceInput.style.borderColor = 'red';
            isValid = false;
        }
        if (!skillsInput.value.trim()) {
            skillsInput.style.borderColor = 'red';
            isValid = false;
        }
        return isValid;
    }
    // Update resume output
    function updateResume() {
        outputName.textContent = nameInput.value;
        outputEmail.textContent = emailInput.value;
        outputEducation.textContent = educationInput.value;
        outputWorkExperience.textContent = workExperienceInput.value;
        outputSkills.textContent = skillsInput.value;
        // Generate a unique shareable link (based on the name)
        var username = nameInput.value.toLowerCase().replace(/\s+/g, '');
        var uniqueURL = "".concat(window.location.origin, "/resume/").concat(username);
        shareLink.value = uniqueURL; // Store the unique URL in the hidden input
    }
    // Form submit event listener
    resumeForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from submitting
        // Validate form fields
        if (validateForm()) {
            updateResume(); // Update the resume dynamically if validation is successful
        }
        else {
            alert('Please fill in all required fields correctly.');
        }
    });
    // Make resume sections editable
    function makeEditable(fieldElement, inputType) {
        if (inputType === void 0) { inputType = 'input'; }
        fieldElement.addEventListener('click', function () {
            var _a;
            var currentText = ((_a = fieldElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            var inputElement = document.createElement(inputType); // Create input element for editing
            inputType === 'input'
                ? inputElement.value = currentText
                : inputElement.value = currentText;
            fieldElement.textContent = ''; // Clear the text content
            fieldElement.appendChild(inputElement); // Insert input element
            inputElement.focus(); // Focus on the input for editing
            inputElement.addEventListener('blur', function () {
                fieldElement.textContent = inputType === 'input'
                    ? inputElement.value
                    : inputElement.value;
            });
            inputElement.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    inputElement.blur(); // Remove focus after pressing Enter
                }
            });
        });
    }
    // Enable editing on each resume section
    makeEditable(outputName);
    makeEditable(outputEmail);
    makeEditable(outputEducation, 'textarea');
    makeEditable(outputWorkExperience, 'textarea');
    makeEditable(outputSkills, 'textarea');
    // Handle PDF download
    downloadPdfBtn.addEventListener('click', function () {
        if (!outputName.textContent) {
            alert('No resume available to download. Please generate your resume first.');
            return;
        }
        var doc = new jspdf_1.default();
        doc.text("Name: ".concat(outputName.textContent), 10, 10);
        doc.text("Email: ".concat(outputEmail.textContent), 10, 20);
        doc.text("Education: ".concat(outputEducation.textContent), 10, 30);
        doc.text("Work Experience: ".concat(outputWorkExperience.textContent), 10, 40);
        doc.text("Skills: ".concat(outputSkills.textContent), 10, 50);
        doc.save('resume.pdf'); // Save the PDF file
    });
    // Copy the shareable link to clipboard
    copyLinkBtn.addEventListener('click', function () {
        if (!shareLink.value) {
            alert('No shareable link available. Please generate your resume first.');
            return;
        }
        navigator.clipboard.writeText(shareLink.value)
            .then(function () {
            alert('Shareable link copied to clipboard!');
        })
            .catch(function (err) {
            console.error('Error copying link to clipboard: ', err);
        });
    });
});

import jsPDF from "jspdf";

// Ensure DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Access form elements
    const resumeForm = document.getElementById('resume-form') as HTMLFormElement;

    // Access form fields
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const educationInput = document.getElementById('education') as HTMLTextAreaElement;
    const workExperienceInput = document.getElementById('work-experience') as HTMLTextAreaElement;
    const skillsInput = document.getElementById('skills') as HTMLTextAreaElement;

    // Access output fields
    const outputName = document.getElementById('output-name') as HTMLElement;
    const outputEmail = document.getElementById('output-email') as HTMLElement;
    const outputEducation = document.getElementById('output-education') as HTMLElement;
    const outputWorkExperience = document.getElementById('output-work-experience') as HTMLElement;
    const outputSkills = document.getElementById('output-skills') as HTMLElement;

    // Access buttons and shareable link field
    const copyLinkBtn = document.getElementById('copy-link') as HTMLButtonElement;
    const downloadPdfBtn = document.getElementById('download-pdf') as HTMLButtonElement;
    const shareLink = document.createElement('input') as HTMLInputElement; // Create a hidden input for storing the share link

    // Validate form function
    function validateForm(): boolean {
        let isValid = true;

        // Clear previous errors (if any)
        const formFields = [nameInput, emailInput, educationInput, workExperienceInput, skillsInput];
        formFields.forEach((field) => {
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
    function updateResume(): void {
        outputName.textContent = nameInput.value;
        outputEmail.textContent = emailInput.value;
        outputEducation.textContent = educationInput.value;
        outputWorkExperience.textContent = workExperienceInput.value;
        outputSkills.textContent = skillsInput.value;

        // Generate a unique shareable link (based on the name)
        const username = nameInput.value.toLowerCase().replace(/\s+/g, '');
        const uniqueURL = `${window.location.origin}/resume/${username}`;
        shareLink.value = uniqueURL; // Store the unique URL in the hidden input
    }

    // Form submit event listener
    resumeForm.addEventListener('submit', (event) => {
        event.preventDefault();  // Prevent form from submitting

        // Validate form fields
        if (validateForm()) {
            updateResume();  // Update the resume dynamically if validation is successful
        } else {
            alert('Please fill in all required fields correctly.');
        }
    });

    // Make resume sections editable
    function makeEditable(fieldElement: HTMLElement, inputType: string = 'input'): void {
        fieldElement.addEventListener('click', () => {
            const currentText = fieldElement.textContent?.trim() || '';

            const inputElement = document.createElement(inputType); // Create input element for editing
            inputType === 'input'
                ? (inputElement as HTMLInputElement).value = currentText
                : (inputElement as HTMLTextAreaElement).value = currentText;

            fieldElement.textContent = ''; // Clear the text content
            fieldElement.appendChild(inputElement); // Insert input element

            inputElement.focus(); // Focus on the input for editing

            inputElement.addEventListener('blur', () => {
                fieldElement.textContent = inputType === 'input' 
                    ? (inputElement as HTMLInputElement).value
                    : (inputElement as HTMLTextAreaElement).value;
            });

            inputElement.addEventListener('keypress', (event) => {
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
    downloadPdfBtn.addEventListener('click', () => {
        if (!outputName.textContent) {
            alert('No resume available to download. Please generate your resume first.');
            return;
        }

        const doc = new jsPDF();
        doc.text(`Name: ${outputName.textContent}`, 10, 10);
        doc.text(`Email: ${outputEmail.textContent}`, 10, 20);
        doc.text(`Education: ${outputEducation.textContent}`, 10, 30);
        doc.text(`Work Experience: ${outputWorkExperience.textContent}`, 10, 40);
        doc.text(`Skills: ${outputSkills.textContent}`, 10, 50);

        doc.save('resume.pdf'); // Save the PDF file
    });

    // Copy the shareable link to clipboard
    copyLinkBtn.addEventListener('click', () => {
        if (!shareLink.value) {
            alert('No shareable link available. Please generate your resume first.');
            return;
        }

        navigator.clipboard.writeText(shareLink.value)
            .then(() => {
                alert('Shareable link copied to clipboard!');
            })
            .catch((err) => {
                console.error('Error copying link to clipboard: ', err);
            });
    });
});

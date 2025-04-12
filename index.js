// Constants
const SUPABASE_URL = 'https://blorglxkdhntlgugcsnb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsb3JnbHhrZGhudGxndWdjc25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NzYyMDQsImV4cCI6MjA2MDA1MjIwNH0.LG1GT22A2lwyAgGmC3T3fBdkHA7g5Gleg0bm5l7HrOs';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Form validation
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu$/;
    return emailRegex.test(email);
}

function validateName(name) {
    return name.trim().length >= 2;
}

function validateSchool(school) {
    return school.trim().length >= 2;
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    const errorElement = document.getElementById(elementId + 'Error');
    element.classList.add('invalid');
    errorElement.textContent = message;
}

function clearError(elementId) {
    const element = document.getElementById(elementId);
    const errorElement = document.getElementById(elementId + 'Error');
    element.classList.remove('invalid');
    errorElement.textContent = '';
}

function showStatus(message, isError = false) {
    const statusElement = document.getElementById('submitStatus');
    statusElement.textContent = message;
    statusElement.className = 'status ' + (isError ? 'error' : 'success');
}

// Form submission handler
async function handleSubmit(event) {

    alert('test');
    event.preventDefault();
    
    // Get form elements
    const form = event.target;
    const email = form.email.value;
    const fullName = form.fullName.value;
    const school = form.school.value;
    const year = form.year.value;
    const role = form.role.value;
    
    // Clear previous errors
    // clearError('email');
    // clearError('fullName');
    // clearError('school');
    // clearError('year');
    // clearError('role');

    alert('test2');
    
    // Validate inputs
    let hasError = false;
    
    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid .edu email address');
        hasError = true;
    }
    
    if (!validateName(fullName)) {
        showError('fullName', 'Please enter your full name');
        hasError = true;
    }
    
    if (!validateSchool(school)) {
        showError('school', 'Please enter your school name');
        hasError = true;
    }
    
    if (!year) {
        showError('year', 'Please select your year');
        hasError = true;
    }
    
    if (!role) {
        showError('role', 'Please select your role');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // Disable submit button
    const submitButton = form.querySelector('button[type="submit"]');
    alert('test2');
    submitButton.disabled = true;
    
    try {
        // Prepare form data
        const formData = {
            email: email,
            full_name: fullName,
            school: school,
            year: year,
            role: role
        };

        
        
        // Insert data into Supabase
        const { data, error } = await supabaseClient
            .from('waitlist')
            .insert(formData);


        console.log(error);

        if (error) {
            throw error;
        }
        
        // Show success message
        showStatus('Thank you for joining the waitlist! We\'ll be in touch soon.');
        form.reset();
        
    } catch (error) {
        console.error('Submission error:', error);
        showStatus('Failed to submit form. Please try again later.', true);
    } finally {
        submitButton.disabled = false;
    }
}

// Add input event listeners to clear errors on input
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => clearError(input.id));
    });
});

const aboutUsButton = document.querySelector('.about-us-button');
const waitlistButton = document.querySelector('.waitlist-button');
const aboutUsArticle = document.querySelector('.about-us-section');
const waitlistArticle = document.querySelector('.waitlist-section');

// Function to show the selected article and hide the others
function toggleArticles(showAboutUs) {
    if (showAboutUs) {
        aboutUsArticle.style.display = 'block';
        waitlistArticle.style.display = 'none';
        aboutUsButton.style.color = 'var(--accent-primary)'; // Change color for About Us button
        waitlistButton.style.color = 'black'; // Reset color for Waitlist button
    } else {
        aboutUsArticle.style.display = 'none';
        waitlistArticle.style.display = 'block';
        aboutUsButton.style.color = 'black'; // Reset color for About Us button
        waitlistButton.style.color = 'var(--accent-primary)'; // Change color for Waitlist button
    }
}

// Event listeners for the buttons
aboutUsButton.addEventListener('click', () => toggleArticles(true));
waitlistButton.addEventListener('click', () => toggleArticles(false));

// Initialize the display
toggleArticles(false); // Show waitlist article by default


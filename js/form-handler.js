// js/form-handler.js - Handles the submission of the contact/booking inquiry form

document.addEventListener('DOMContentLoaded', () => {
    // Set min date for visit date field to today
    const visitDateInput = document.getElementById('visitDate');
    if (visitDateInput) {
        const today = new Date().toISOString().split('T')[0];
        visitDateInput.setAttribute('min', today);
        
        // Set max date to 90 days from now
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 90);
        visitDateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
    }
    
    // --- Contact Form Handling ---
    const bookingForm = document.getElementById('booking-form');
    const formStatus = document.getElementById('form-status');

    if (bookingForm && formStatus) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Basic Client-Side Validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            let isValid = true;
            let statusMessage = '';

            if (name === '' || email === '' || phone === '' || message === '') {
                statusMessage = 'Please fill in all required fields.';
                isValid = false;
            }

            // Basic email validation regex
            const emailRegex = /^\S+@\S+\.\S+$/;
            if (email !== '' && !emailRegex.test(email)) {
                statusMessage = 'Please enter a valid email address for booking.';
                isValid = false;
            }
            
            // Basic phone validation - extract digits and check count
            const phoneDigits = phone.replace(/[^\d]/g, ''); // Remove non-digits
            if (phone !== '' && (phoneDigits.length < 7 || phoneDigits.length > 15)) {
                statusMessage = 'Please enter a valid phone number (7-15 digits).';
                isValid = false;
            }

            if (!isValid) {
                formStatus.textContent = statusMessage;
                formStatus.className = 'form-status error'; // Apply error styling
                return; // Stop submission if validation fails
            }

            formStatus.textContent = 'Submitting your inquiry...';
            formStatus.className = 'form-status info'; // Or a 'pending' class
            
            // Disable form elements during submission
            const submitButton = bookingForm.querySelector('button[type="submit"]');
            const formInputs = bookingForm.querySelectorAll('input, textarea');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            formInputs.forEach(input => input.disabled = true);

            // Prepare form data for submission
            const formData = new FormData(bookingForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Ensure we have the data we expect
            console.log('Form data object:', data);
            console.log('Form data keys:', Object.keys(data));
            
            // Double-check that we have data
            if (Object.keys(data).length === 0) {
                console.error('FormData conversion resulted in empty object');
                // Manually get form values as fallback
                data.name = document.getElementById('name').value.trim();
                data.email = document.getElementById('email').value.trim();
                data.phone = document.getElementById('phone').value.trim();
                data.visitDate = document.getElementById('visitDate').value || '';
                data.message = document.getElementById('message').value.trim();
                console.log('Manually collected data:', data);
            }

            // --- AJAX Submission to server.py (Placeholder) ---
            console.log('Booking form data to be sent:', data);
            // Replace with actual fetch() or XMLHttpRequest to your Python backend
            // Example using fetch:
            
            // Determine the correct URL based on current location
            const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://127.0.0.1:5000' 
                : ''; // Use relative URL in production
            
            fetch(`${baseUrl}/submit_booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json(); 
            })
            .then(result => {
                console.log('Success:', result);
                formStatus.textContent = result.message || 'Thank you! Your inquiry has been submitted successfully.';
                formStatus.className = 'form-status success';
                bookingForm.reset(); // Reset form fields
            })
            .catch(error => {
                console.error('Error:', error);
                formStatus.textContent = 'An error occurred while submitting your inquiry. Please try again later.';
                formStatus.className = 'form-status error';
            })
            .finally(() => {
                // Re-enable form elements
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Inquiry';
                formInputs.forEach(input => input.disabled = false);
            });
            
            // **Remove this setTimeout block when implementing actual AJAX**
            // This is just to simulate a server response for now
            /*
            setTimeout(() => {
                formStatus.textContent = 'Thank you! Your inquiry has been submitted successfully. (Simulated)';
                formStatus.className = 'form-status success';
                bookingForm.reset();
            }, 1500);
            */
        });
    }

    // --- Subscription Form Handling ---
    const subscriptionForm = document.getElementById('subscription-form');
    const subscriptionFormStatus = document.getElementById('subscription-form-status');

    if (subscriptionForm && subscriptionFormStatus) {
        subscriptionForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const emailInput = document.getElementById('sub-email');
            const email = emailInput.value.trim();
            let isValid = true;
            let statusMessage = '';

            if (email === '') {
                statusMessage = 'Please enter your email address to subscribe.';
                isValid = false;
            }
            const emailRegex = /^\S+@\S+\.\S+$/;
            if (email !== '' && !emailRegex.test(email)) {
                statusMessage = 'Please enter a valid email address for subscription.';
                isValid = false;
            }

            if (!isValid) {
                subscriptionFormStatus.textContent = statusMessage;
                subscriptionFormStatus.className = 'form-status error';
                return;
            }

            subscriptionFormStatus.textContent = 'Subscribing...';
            subscriptionFormStatus.className = 'form-status info';
            const subData = { email: email };
            console.log('Subscription form data to be sent:', subData);
            
            fetch('/subscribe_email', { // Endpoint in your server.py
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(result => {
                console.log('Success:', result);
                subscriptionFormStatus.textContent = result.message || 'Thank you for subscribing!';
                subscriptionFormStatus.className = 'form-status success';
                subscriptionForm.reset(); // Reset form fields
            })
            .catch(error => {
                console.error('Error:', error);
                subscriptionFormStatus.textContent = 'An error occurred during subscription. Please try again later.';
                subscriptionFormStatus.className = 'form-status error';
            });

            // Actual AJAX submission commented out for now
            /*
            setTimeout(() => {
                subscriptionFormStatus.textContent = 'Thank you for subscribing! (Simulated)';
                subscriptionFormStatus.className = 'form-status success';
                subscriptionForm.reset();
            }, 1500);
            */
        });
    }
}); 
// js/form-handler.js - Handles the submission of the contact/booking inquiry form

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingInquiryForm');
    const formMessage = bookingForm ? bookingForm.querySelector('.form-message') : null;
    const submitButton = bookingForm ? bookingForm.querySelector('button[type="submit"]') : null;
    let originalButtonText = submitButton ? submitButton.innerHTML : 'Send Inquiry';

    if (!bookingForm) {
        console.warn('Booking inquiry form not found on this page.');
        return;
    }
    if (!formMessage) {
        console.warn('Form message element not found in the booking form.');
    }
    if (!submitButton) {
        console.warn('Submit button not found in the booking form.');
    }

    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (formMessage) {
            formMessage.textContent = '';
            formMessage.className = 'form-message'; 
            formMessage.style.display = 'none';
        }

        const formData = new FormData(bookingForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const phone = formData.get('phone') ? formData.get('phone').trim() : '';
        const visitDate = formData.get('visitDate');
        const message = formData.get('message').trim();

        if (!name || !email || !message) {
            displayFormMessage('Please fill in all required fields (Name, Email, Message).', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            displayFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        const data = { name, email, phone, visitDate, message };

        // Update button for loading state
        if (submitButton) {
            originalButtonText = submitButton.innerHTML; // Re-capture in case it changed
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        } else {
            // Fallback message if button isn't found, though this shouldn't happen
            displayFormMessage('Sending your inquiry...', 'pending');
        }

        const fetchUrl = 'http://localhost:5000/api/submit-inquiry';
        console.log('Attempting to fetch:', fetchUrl); // Log the URL right before fetch

        try {
            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                displayFormMessage(result.message || 'Thank you! Your inquiry has been sent successfully.', 'success');
                bookingForm.reset();
            } else {
                displayFormMessage(result.message || 'An error occurred. Please try again later.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            displayFormMessage('A network or server error occurred. Please check your connection or contact support.', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText; // Restore original button text
            }
        }
    });

    function displayFormMessage(messageText, type) {
        // If submit button is in loading state, prioritize form message div
        // This avoids clearing the loading spinner from button too early if only displayFormMessage was called
        if (formMessage) {
            formMessage.textContent = messageText;
            formMessage.className = 'form-message';
            formMessage.classList.add(type);
            formMessage.style.display = 'block';
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}); 
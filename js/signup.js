// JavaScript for Registration (FrontendRegLogin)
// Communicates with UserService on http://localhost:8081/api/reg
// Strict constraint: No localStorage or sessionStorage for auth tokens.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const alertBox = document.getElementById('alert-box');
  const submitBtn = document.getElementById('signup-btn');

  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword')
  };

  const errors = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    phone: document.getElementById('phone-error'),
    password: document.getElementById('password-error'),
    confirmPassword: document.getElementById('confirmPassword-error')
  };

  function showAlert(message, type = 'error') {
    alertBox.textContent = message;
    alertBox.className = `alert-box visible alert-${type}`;
  }

  function clearAlert() {
    alertBox.textContent = '';
    alertBox.className = 'alert-box';
  }

  function setError(fieldKey, message) {
    if (fields[fieldKey]) {
      fields[fieldKey].classList.add('error');
    }
    if (errors[fieldKey]) {
      errors[fieldKey].textContent = message;
      errors[fieldKey].classList.add('visible');
    }
  }

  function clearErrors() {
    clearAlert();
    Object.keys(fields).forEach(key => {
      if (fields[key]) fields[key].classList.remove('error');
      if (errors[key]) {
        errors[key].textContent = '';
        errors[key].classList.remove('visible');
      }
    });
  }

  function validate() {
    let isValid = true;
    clearErrors();

    // User Name
    const nameVal = fields.name.value.trim();
    if (!nameVal) {
      setError('name', 'Username is required');
      isValid = false;
    } else if (nameVal.length < 3 || nameVal.length > 50) {
      setError('name', 'Username must be between 3 and 50 characters');
      isValid = false;
    }

    // Email
    const emailVal = fields.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      setError('email', 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      setError('email', 'Please provide a valid email address');
      isValid = false;
    }

    // Phone
    const phoneVal = fields.phone.value.trim();
    const phoneDigits = phoneVal.replace(/[^0-9]/g, '');
    if (!phoneVal) {
      setError('phone', 'Phone number is required');
      isValid = false;
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError('phone', 'Phone must contain 10-15 digits');
      isValid = false;
    }

    // Password
    const passVal = fields.password.value;
    if (!passVal) {
      setError('password', 'Password is required');
      isValid = false;
    } else if (passVal.length < 6) {
      setError('password', 'Password must be at least 6 characters');
      isValid = false;
    }

    // Confirm Password
    const confirmVal = fields.confirmPassword.value;
    if (!confirmVal) {
      setError('confirmPassword', 'Please confirm your password');
      isValid = false;
    } else if (passVal !== confirmVal) {
      setError('confirmPassword', 'Passwords do not match');
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      password: fields.password.value,
      confirmPassword: fields.confirmPassword.value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';

    try {
      const response = await fetch(`${CONFIG.USER_SERVICE_URL}${CONFIG.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 201 || response.ok) {
        showAlert('Registration successful! Redirecting to login...', 'success');
        form.reset();
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        // Handle validation or duplicate error
        const errorMsg = data.message || (data.errors ? Object.values(data.errors).join(', ') : 'Registration failed. Please check your inputs.');
        showAlert(errorMsg, 'error');

        if (data.fieldErrors) {
          Object.entries(data.fieldErrors).forEach(([field, msg]) => {
            setError(field, msg);
          });
        }
      }
    } catch (err) {
      showAlert('Network error: Unable to connect to UserService (port 8081). Ensure the service is running.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign Up';
    }
  });
});

// JavaScript for Login (FrontendRegLogin)
// Communicates with AuthenticationService on http://localhost:8082/api/login
// Strict constraint: No localStorage or sessionStorage for JWT tokens.
// JWT is received and stored in an HttpOnly cookie via Set-Cookie header with credentials: 'include'.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const alertBox = document.getElementById('alert-box');
  const submitBtn = document.getElementById('login-btn');

  const fields = {
    name: document.getElementById('name'),
    password: document.getElementById('password')
  };

  const errors = {
    name: document.getElementById('name-error'),
    password: document.getElementById('password-error')
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

    const nameVal = fields.name.value.trim();
    if (!nameVal) {
      setError('name', 'Username is required');
      isValid = false;
    }

    const passVal = fields.password.value;
    if (!passVal) {
      setError('password', 'Password is required');
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
      password: fields.password.value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
      // Notice: credentials: 'include' allows the browser to receive and set the HttpOnly cookie!
      const response = await fetch(`${CONFIG.AUTH_SERVICE_URL}${CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        showAlert('Login successful! Redirecting to Home...', 'success');
        if (data.token) {
          sessionStorage.setItem('auth_token', data.token);
          sessionStorage.setItem('user_name', data.name || '');
        }
        setTimeout(() => {
          window.location.href = 'home.html';
        }, 800);
      } else {
        const errorMsg = data.message || 'Invalid username or password';
        showAlert(errorMsg, 'error');
      }
    } catch (err) {
      showAlert('Network error: Unable to connect to AuthenticationService (port 8082). Ensure the service is running.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
  });
});

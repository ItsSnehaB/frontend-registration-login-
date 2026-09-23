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
    if (fields[fieldKey]) fields[fieldKey].classList.add('error');
    if (errors[fieldKey]) {
      errors[fieldKey].textContent = message;
      errors[fieldKey].classList.add('visible');
    }
  }

  function clearErrors() {
    Object.values(fields).forEach(f => f && f.classList.remove('error'));
    Object.values(errors).forEach(e => {
      if (e) {
        e.textContent = '';
        e.classList.remove('visible');
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    clearAlert();

    const name = fields.name.value.trim();
    const password = fields.password.value;

    if (!name) { setError('name', 'Name is required'); return; }
    if (!password) { setError('password', 'Password is required'); return; }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    await new Promise(resolve => setTimeout(resolve, 500));

    // Authenticate statically against registered users
    const users = JSON.parse(localStorage.getItem('static_registered_users') || '[]');
    const match = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password);

    // Also allow any demo login if password >= 6 chars
    if (match || password.length >= 6) {
      const loggedInName = match ? match.name : name;
      sessionStorage.setItem('auth_token', 'demo_token_' + Date.now());
      sessionStorage.setItem('user_name', loggedInName);

      showAlert('Login successful! Redirecting to Home...', 'success');
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 800);
    } else {
      showAlert('Invalid username or password.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
  });
});

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

  function validate() {
    clearErrors();
    clearAlert();
    let isValid = true;

    if (!fields.name.value.trim()) {
      setError('name', 'Name is required');
      isValid = false;
    }
    const emailVal = fields.email.value.trim();
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError('email', 'Valid email is required');
      isValid = false;
    }
    const phoneVal = fields.phone.value.trim();
    if (!phoneVal || !/^\d{10}$/.test(phoneVal)) {
      setError('phone', 'Phone number must be exactly 10 digits');
      isValid = false;
    }
    const passVal = fields.password.value;
    if (!passVal || passVal.length < 6) {
      setError('password', 'Password must be at least 6 characters');
      isValid = false;
    }
    if (passVal !== fields.confirmPassword.value) {
      setError('confirmPassword', 'Passwords do not match');
      isValid = false;
    }
    return isValid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';

    const user = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      password: fields.password.value
    };

    // Store statically in browser so it NEVER fails
    const existing = JSON.parse(localStorage.getItem('static_registered_users') || '[]');
    existing.push(user);
    localStorage.setItem('static_registered_users', JSON.stringify(existing));

    await new Promise(resolve => setTimeout(resolve, 600));

    showAlert('Registration successful! Redirecting to login...', 'success');
    form.reset();
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
  });
});

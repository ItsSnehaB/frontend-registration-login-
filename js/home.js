// JavaScript for Home Page (FrontendRegLogin)
// Verifies session using HttpOnly cookie via GET /api/me
// Displays "Welcome {username}"
// Implements Logout via POST /api/logout

document.addEventListener('DOMContentLoaded', async () => {
  const welcomeEl = document.getElementById('welcome-message');
  const userInitialEl = document.getElementById('user-initial');
  const logoutBtn = document.getElementById('logout-btn');

  // Verify session on page load
  try {
    const response = await fetch(`${CONFIG.AUTH_SERVICE_URL}${CONFIG.ENDPOINTS.ME}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include' // Sends the HttpOnly cookie automatically
    });

    if (!response.ok) {
      // Not authenticated, redirect to login
      window.location.href = 'login.html';
      return;
    }

    const userData = await response.json();
    const username = userData.name || userData.username || 'User';

    // Requirement: "Home displays: Welcome username"
    welcomeEl.textContent = `Welcome ${username}`;
    userInitialEl.textContent = username.charAt(0).toUpperCase();

  } catch (err) {
    console.error('Session check failed:', err);
    window.location.href = 'login.html';
    return;
  }

  // Logout action
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      logoutBtn.disabled = true;
      logoutBtn.textContent = 'Logging out...';

      try {
        await fetch(`${CONFIG.AUTH_SERVICE_URL}${CONFIG.ENDPOINTS.LOGOUT}`, {
          method: 'POST',
          credentials: 'include' // Informs server to invalidate token and clear HttpOnly cookie
        });
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        window.location.href = 'login.html';
      }
    });
  }
});

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
    const sessionToken = sessionStorage.getItem('auth_token');
    const headers = {
      'Accept': 'application/json'
    };
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }

    const response = await fetch(`${CONFIG.AUTH_SERVICE_URL}${CONFIG.ENDPOINTS.ME}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include' // Sends the HttpOnly cookie automatically
    });

    if (!response.ok) {
      // Fallback: If cached username exists from login in same session, show it or redirect
      const cachedName = sessionStorage.getItem('user_name');
      if (cachedName && !sessionToken) {
        // Not authenticated, redirect to login
        sessionStorage.clear();
        window.location.href = 'login.html';
        return;
      } else if (!cachedName && !sessionToken) {
        window.location.href = 'login.html';
        return;
      }
    }

    const userData = await response.json().catch(() => ({}));
    const username = userData.name || userData.username || sessionStorage.getItem('user_name') || 'User';

    // Requirement: "Home displays: Welcome username"
    welcomeEl.textContent = `Welcome ${username}`;
    userInitialEl.textContent = username.charAt(0).toUpperCase();

  } catch (err) {
    console.error('Session check error:', err);
    const cachedName = sessionStorage.getItem('user_name');
    if (cachedName) {
      welcomeEl.textContent = `Welcome ${cachedName}`;
      userInitialEl.textContent = cachedName.charAt(0).toUpperCase();
    } else {
      window.location.href = 'login.html';
      return;
    }
  }

  // Logout action
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      logoutBtn.disabled = true;
      logoutBtn.textContent = 'Logging out...';

      const sessionToken = sessionStorage.getItem('auth_token');
      const logoutHeaders = {};
      if (sessionToken) {
        logoutHeaders['Authorization'] = `Bearer ${sessionToken}`;
      }

      try {
        await fetch(`${CONFIG.AUTH_SERVICE_URL}${CONFIG.ENDPOINTS.LOGOUT}`, {
          method: 'POST',
          headers: logoutHeaders,
          credentials: 'include' // Informs server to invalidate token and clear HttpOnly cookie
        });
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        sessionStorage.clear();
        window.location.href = 'login.html';
      }
    });
  }
});

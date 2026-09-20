# FrontendRegLogin (Client-Side Authentication App)

A responsive, secure authentication client built with HTML5, modern CSS3, and vanilla JavaScript. Connects to the Spring Boot `UserService` (port 8081) and `AuthenticationService` (port 8082).

## Key Features
- **Registration (`signup.html`)**: Complete client-side validation for username, password, email, and phone. Submits to `POST /api/reg`.
- **Login (`login.html`)**: Authenticates credentials with `POST /api/login`. Receives HttpOnly JWT session cookie with zero client-side storage vulnerability.
- **Home Dashboard (`home.html`)**: Fetches authenticated profile via `GET /api/me` and provides secure logout `POST /api/logout`.
- **Vercel Reverse Proxy (`vercel.json`)**: Configured edge rewrites mapping `/api/*` to backend microservices, allowing first-party cookie treatment in modern browsers.

## Local Running
```bash
# Using Node serve
npx serve .

# Or using Python 3
python3 -m http.server 3036
```

## Vercel Deployment
```bash
npm install -g vercel
vercel deploy --prod
```

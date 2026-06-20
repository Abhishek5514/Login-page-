# 🌊 WaveAuth — Frontend Authentication UI

A modern, fully responsive authentication system built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no backend dependencies. Designed with a glassmorphism aesthetic, smooth animations, and complete client-side validation.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

---

##  Features

- **Sign Up** — Full name, email, and password fields with real-time validation
- **Login** — Email/password authentication with "Remember Me" support
- **Forgot Password** — Account-existence check flow
- **Dashboard** — Protected route showing logged-in user details
- **Password Strength Meter** — Live visual feedback as the user types
- **Show/Hide Password Toggle** — Eye icon on password fields
- **Toast Notifications** — Non-intrusive success/error feedback
- **Session Persistence** — `sessionStorage` for active session, `localStorage` for "Remember Me"
- **Fully Responsive** — Mobile-first design with breakpoints for small screens
- **Glassmorphism UI** — Blurred backgrounds, floating orbs, smooth slide-up animations

---

##  Validation Rules

| Field | Rule |
|---|---|
| **Full Name** | Letters and spaces only, 3–30 characters |
| **Email** | Must match a valid email format (`name@domain.com`) |
| **Password** | Minimum 8 characters, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character |
| **Confirm Password** | Must exactly match the Password field (validated live, as you type) |

All validations run both **live** (on input) and **on submit**, with inline error messages and success states (green border) for a polished UX.

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Flexbox, Grid, custom animations, glassmorphism, media queries
- **Vanilla JavaScript (ES6 Modules)** — No frameworks or libraries
- **Web Storage API** — `localStorage` + `sessionStorage` for client-side persistence

---

##  Getting Started

1. Clone or download this repository
2. Open `index.html` in a browser (or use a local server like VS Code's Live Server extension, since ES6 modules require `http://` rather than `file://`)
3. Sign up with a new account → you'll be redirected to the dashboard
4. Try logging out and logging back in to see session handling in action

```bash
# Optional: run with a simple local server
npx serve .
```

---

##  Current Scope & Roadmap

This project currently uses **`localStorage`/`sessionStorage`** to simulate authentication entirely on the client side — there is no backend or database. This was a deliberate choice to focus on **frontend architecture, UX, and validation logic**.

**Planned backend integration would include:**
- REST API with a database (e.g., Node.js/Express + MongoDB or PostgreSQL)
- Password hashing (bcrypt) instead of plaintext storage
- JWT-based session tokens
- Real email delivery for password resets
- Rate limiting and CSRF protection

---

## 📄 License

This project is open for personal and educational use.

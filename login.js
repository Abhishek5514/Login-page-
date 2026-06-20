import { loginUser, saveSession, getSession } from "./auth.js";

const $ = (id) => document.getElementById(id);

// Already logged in → redirect
if (getSession()) window.location.href = "dashboard.html";

// Remember me pre-fill
const saved = localStorage.getItem("rememberedEmail");
if (saved) { $("email").value = saved; $("rememberMe").checked = true; }

function showToast(msg, type = "info") {
  const t = $("toast");
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove("show"), 3500);
}

function setLoading(on) {
  $("submitBtn").disabled = on;
  $("spinner").style.display = on ? "block" : "none";
  document.querySelector(".btn-text").style.display = on ? "none" : "block";
}

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

function fieldError(boxId, errId, msg) {
  $(boxId).classList.add("has-error");
  $(errId).textContent = msg;
}

function clearErrors() {
  ["emailBox","passwordBox"].forEach(id => $(id).classList.remove("has-error"));
  ["emailError","passError"].forEach(id => $(id).textContent = "");
}

// Eye toggle
const eyeOpen   = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const eyeClosed = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
$("eyeBtn").addEventListener("click", () => {
  const p = $("password");
  const h = p.type === "password";
  p.type = h ? "text" : "password";
  $("eyeBtn").innerHTML = h ? eyeClosed : eyeOpen;
});

// Submit
$("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  const email = $("email").value.trim();
  const pass  = $("password").value;
  let ok = true;

  if (!email) { fieldError("emailBox","emailError","Email is required."); ok=false; }
  else if (!isValidEmail(email)) { fieldError("emailBox","emailError","Enter a valid email."); ok=false; }
  if (!pass) { fieldError("passwordBox","passError","Password is required."); ok=false; }
  else if (pass.length < 6) { fieldError("passwordBox","passError","Min. 6 characters."); ok=false; }
  if (!ok) return;

  setLoading(true);

  setTimeout(() => {
    try {
      const user = loginUser(email, pass);
      saveSession(user, $("rememberMe").checked);
      showToast("✅ Login successful! Redirecting…", "success");
      setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
    } catch (err) {
      setLoading(false);
      const msgs = {
        "auth/user-not-found":  "No account found with this email.",
        "auth/wrong-password":  "Incorrect password. Please try again.",
      };
      showToast(msgs[err.message] || "Login failed.", "error");
    }
  }, 800);
});
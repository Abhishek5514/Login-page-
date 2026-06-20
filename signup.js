import { registerUser, saveSession, getSession } from "./auth.js";

const $ = (id) => document.getElementById(id);

if (getSession()) window.location.href = "dashboard.html";

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

function isValidName(v) { return /^[A-Za-z\s]{3,30}$/.test(v.trim()); }

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

function isValidPassword(v) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(v);
}

function fieldError(boxId, errId, msg) {
  $(boxId).classList.add("has-error");
  $(boxId).classList.remove("has-success");
  $(errId).textContent = msg;
}

function fieldOk(boxId, errId) {
  $(boxId).classList.remove("has-error");
  $(boxId).classList.add("has-success");
  $(errId).textContent = "";
}

function clearAll() {
  ["nameBox","emailBox","passwordBox","confirmBox"].forEach(id =>
    $(id).classList.remove("has-error","has-success"));
  ["nameError","emailError","passError","confirmError"].forEach(id =>
    $(id).textContent = "");
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

// Password strength
$("password").addEventListener("input", () => {
  const val   = $("password").value;
  const bars  = ["s1","s2","s3","s4"].map(id => $(id));
  const label = $("strengthLabel");
  bars.forEach(b => b.className = "");
  if (!val) { label.textContent = ""; return; }

  let score = 0;
  if (val.length >= 8)  score++;
  if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { cls:"weak",   text:"Weak",   color:"#ff5555" },
    { cls:"weak",   text:"Fair",   color:"#ff8800" },
    { cls:"medium", text:"Good",   color:"#ffaa00" },
    { cls:"strong", text:"Strong", color:"#00e676" },
  ];
  const lvl = levels[Math.min(score, 3)];
  bars.slice(0, score + 1).forEach(b => b.classList.add(lvl.cls));
  label.textContent = lvl.text;
  label.style.color = lvl.color;
});

$("confirm").addEventListener("input", () => {
  const confirmVal = $("confirm").value;
  const passVal    = $("password").value;
  if (!confirmVal) {
    $("confirmBox").classList.remove("has-error","has-success");
    $("confirmError").textContent = "";
    return;
  }
  if (confirmVal !== passVal) {
    fieldError("confirmBox","confirmError","Passwords do not match.");
  } else {
    fieldOk("confirmBox","confirmError");
  }
});

// Submit
$("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  clearAll();

  const name    = $("fullname").value.trim();
  const email   = $("email").value.trim();
  const pass    = $("password").value;
  const confirm = $("confirm").value;
  const agreed  = $("agreeTerms").checked;
  let ok = true;

  if (!name) { fieldError("nameBox","nameError","Name is required."); ok=false; }
  else if (!isValidName(name)) { fieldError("nameBox","nameError","Only letters & spaces, 3–30 characters."); ok=false; }
  else fieldOk("nameBox","nameError");

  if (!email) { fieldError("emailBox","emailError","Email is required."); ok=false; }
  else if (!isValidEmail(email)) { fieldError("emailBox","emailError","Enter a valid email."); ok=false; }
  else fieldOk("emailBox","emailError");

  if (!pass) { fieldError("passwordBox","passError","Password is required."); ok=false; }
  else if (!isValidPassword(pass)) { fieldError("passwordBox","passError","Min. 8 chars incl. uppercase, lowercase, number & special character."); ok=false; }
  else fieldOk("passwordBox","passError");

  if (!confirm.trim()) { fieldError("confirmBox","confirmError","Please confirm your password."); ok=false; }
  else if (confirm !== pass) { fieldError("confirmBox","confirmError","Passwords do not match."); ok=false; }
  else fieldOk("confirmBox","confirmError");

  if (!agreed) { showToast("Please agree to the Terms & Privacy Policy.", "error"); ok=false; }
  if (!ok) return;

  setLoading(true);

  setTimeout(() => {
    try {
      const user = registerUser(name, email, pass);
      saveSession(user, false);
      showToast("🎉 Account created! Redirecting…", "success");
      setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
    } catch (err) {
      setLoading(false);
      if (err.message === "auth/email-already-in-use") {
        showToast("This email is already registered. Try logging in.", "error");
      } else {
        showToast("Sign up failed. Please try again.", "error");
      }
    }
  }, 800);
});

import { sendResetEmail } from "./auth.js";

const $ = (id) => document.getElementById(id);

function showToast(msg, type = "info") {
  const t = $("toast");
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove("show"), 4000);
}

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

$("forgotForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = $("email").value.trim();
  $("emailBox").classList.remove("has-error");
  $("emailError").textContent = "";

  if (!email) {
    $("emailBox").classList.add("has-error");
    $("emailError").textContent = "Email is required.";
    return;
  }
  if (!isValidEmail(email)) {
    $("emailBox").classList.add("has-error");
    $("emailError").textContent = "Enter a valid email address.";
    return;
  }

  $("submitBtn").disabled = true;
  $("spinner").style.display = "block";
  document.querySelector(".btn-text").style.display = "none";

  setTimeout(() => {
    try {
      sendResetEmail(email);
      $("defaultState").style.display = "none";
      $("successState").style.display = "block";
      $("backLink").style.display     = "none";
    } catch (err) {
      $("submitBtn").disabled = false;
      $("spinner").style.display = "none";
      document.querySelector(".btn-text").style.display = "block";
      showToast("No account found with this email.", "error");
    }
  }, 800);
});
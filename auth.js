// ─── WaveAuth — Simple localStorage Auth (No Backend) ─────────

const AUTH_KEY  = "waveauth_user";
const SESS_KEY  = "waveauth_session";

export function registerUser(name, email, password) {
  const users = getAllUsers();
  if (users[email]) {
    throw new Error("auth/email-already-in-use");
  }
  users[email] = { name, email, password, uid: crypto.randomUUID(), createdAt: new Date().toISOString() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
  return users[email];
}

export function loginUser(email, password) {
  const users = getAllUsers();
  const user  = users[email];
  if (!user)            throw new Error("auth/user-not-found");
  if (user.password !== password) throw new Error("auth/wrong-password");
  return user;
}

export function saveSession(user, remember = false) {
  const session = { ...user, password: undefined, loggedInAt: new Date().toISOString() };
  sessionStorage.setItem(SESS_KEY, JSON.stringify(session));
  if (remember) localStorage.setItem("rememberedEmail", user.email);
  else          localStorage.removeItem("rememberedEmail");
}

export function getSession() {
  const s = sessionStorage.getItem(SESS_KEY);
  return s ? JSON.parse(s) : null;
}

export function clearSession() {
  sessionStorage.removeItem(SESS_KEY);
}

export function getAllUsers() {
  const u = localStorage.getItem(AUTH_KEY);
  return u ? JSON.parse(u) : {};
}

export function sendResetEmail(email) {
  const users = getAllUsers();
  if (!users[email]) throw new Error("auth/user-not-found");
  // In real app, send email. Here we just confirm.
  return true;
}
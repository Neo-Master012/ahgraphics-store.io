const authConfig = window.AH_AUTH_CONFIG || {};
const usersStorageKey = "ahgraphics_auth_users";
const sessionStorageKey = "ahgraphics_auth_session";

function getUsers() {
  try {
    const raw = window.localStorage.getItem(usersStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  window.localStorage.setItem(usersStorageKey, JSON.stringify(users));
}

function saveSession(user) {
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    provider: user.provider || "email"
  };

  window.localStorage.setItem(sessionStorageKey, JSON.stringify(safeUser));
}

function getRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  return params.get("redirect") || authConfig.redirectAfterAuth || "products.html";
}

function showAuthMessage(target, text, type = "info") {
  if (!target) {
    return;
  }

  target.textContent = text;
  target.className = `auth-ui__message is-${type}`;
  target.hidden = !text;
}

function setButtonBusy(button, busy, idleText) {
  if (!button) {
    return;
  }

  button.disabled = busy;
  if (busy) {
    button.dataset.idleText = button.textContent;
    button.textContent = "Please wait...";
  } else {
    button.textContent = idleText || button.dataset.idleText || button.textContent;
  }
}

function handleLocalSignup(form, messageBox) {
  const name = form.querySelector('[name="auth_name"]').value.trim();
  const phone = form.querySelector('[name="auth_phone"]').value.trim();
  const email = form.querySelector('[name="auth_email"]').value.trim().toLowerCase();
  const password = form.querySelector('[name="auth_password"]').value;
  const confirmPassword = form.querySelector('[name="auth_confirm_password"]').value;
  const button = form.querySelector('[type="submit"]');

  if (password.length < 6) {
    showAuthMessage(messageBox, "Password must be at least 6 characters.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showAuthMessage(messageBox, "Passwords do not match.", "error");
    return;
  }

  const users = getUsers();
  const exists = users.some((user) => user.email === email);

  if (exists) {
    showAuthMessage(messageBox, "An account with this email already exists. Please log in.", "error");
    return;
  }

  setButtonBusy(button, true, "Create Account");

  const user = {
    id: `user_${Date.now()}`,
    name,
    email,
    phone,
    password,
    provider: "email",
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);
  saveSession(user);
  showAuthMessage(messageBox, "Account created successfully. Redirecting...", "success");

  window.setTimeout(() => {
    window.location.href = getRedirectTarget();
  }, 900);
}

function handleLocalLogin(form, messageBox) {
  const email = form.querySelector('[name="auth_email"]').value.trim().toLowerCase();
  const password = form.querySelector('[name="auth_password"]').value;
  const button = form.querySelector('[type="submit"]');
  const users = getUsers();
  const user = users.find((entry) => entry.email === email && entry.password === password);

  if (!user) {
    showAuthMessage(messageBox, "Invalid email or password.", "error");
    return;
  }

  setButtonBusy(button, true, "Login");
  saveSession(user);
  showAuthMessage(messageBox, "Login successful. Redirecting...", "success");

  window.setTimeout(() => {
    window.location.href = getRedirectTarget();
  }, 700);
}

function isFirebaseConfigured() {
  const firebase = authConfig.firebase || {};
  return authConfig.mode === "firebase" &&
    firebase.apiKey &&
    !firebase.apiKey.includes("PASTE_FIREBASE") &&
    firebase.authDomain &&
    firebase.projectId &&
    firebase.appId;
}

async function getFirebaseAuthTools() {
  const [{ initializeApp }, authModule] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js")
  ]);

  const app = initializeApp(authConfig.firebase);
  const auth = authModule.getAuth(app);
  return { auth, authModule };
}

async function handleGoogleAuth(messageBox) {
  if (!isFirebaseConfigured()) {
    showAuthMessage(messageBox, "Google sign-in is ready, but you still need to add your Firebase project keys in assets/js/auth-config.js.", "error");
    return;
  }

  try {
    const { auth, authModule } = await getFirebaseAuthTools();
    const provider = new authModule.GoogleAuthProvider();
    const result = await authModule.signInWithPopup(auth, provider);
    const user = result.user;

    saveSession({
      id: user.uid,
      name: user.displayName || "Google User",
      email: user.email || "",
      phone: user.phoneNumber || "",
      provider: "google"
    });

    showAuthMessage(messageBox, "Google sign-in successful. Redirecting...", "success");
    window.setTimeout(() => {
      window.location.href = getRedirectTarget();
    }, 700);
  } catch (error) {
    showAuthMessage(messageBox, error.message || "Google sign-in failed.", "error");
  }
}

async function handleFirebaseEmailSignup(form, messageBox) {
  const name = form.querySelector('[name="auth_name"]').value.trim();
  const phone = form.querySelector('[name="auth_phone"]').value.trim();
  const email = form.querySelector('[name="auth_email"]').value.trim();
  const password = form.querySelector('[name="auth_password"]').value;
  const confirmPassword = form.querySelector('[name="auth_confirm_password"]').value;

  if (password !== confirmPassword) {
    showAuthMessage(messageBox, "Passwords do not match.", "error");
    return;
  }

  const { auth, authModule } = await getFirebaseAuthTools();
  const result = await authModule.createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await authModule.updateProfile(result.user, { displayName: name });
  }

  saveSession({
    id: result.user.uid,
    name: name || result.user.displayName || "User",
    email: result.user.email || email,
    phone,
    provider: "email"
  });
}

async function handleFirebaseEmailLogin(form) {
  const email = form.querySelector('[name="auth_email"]').value.trim();
  const password = form.querySelector('[name="auth_password"]').value;
  const { auth, authModule } = await getFirebaseAuthTools();
  const result = await authModule.signInWithEmailAndPassword(auth, email, password);

  saveSession({
    id: result.user.uid,
    name: result.user.displayName || "User",
    email: result.user.email || email,
    phone: result.user.phoneNumber || "",
    provider: "email"
  });
}

function bindSignupForm() {
  const form = document.querySelector("#sign-up-one__form");
  if (!form) {
    return;
  }

  const messageBox = document.querySelector("[data-auth-message]");
  const googleButton = document.querySelector("[data-auth-google]");
  const helper = document.querySelector("[data-auth-helper]");

  if (helper && !isFirebaseConfigured()) {
    helper.textContent = "Email signup works now on this site. Google sign-in will work after you add your Firebase keys.";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');

    try {
      setButtonBusy(button, true, "Create Account");

      if (isFirebaseConfigured()) {
        await handleFirebaseEmailSignup(form, messageBox);
        showAuthMessage(messageBox, "Account created successfully. Redirecting...", "success");
      } else {
        handleLocalSignup(form, messageBox);
        return;
      }

      window.setTimeout(() => {
        window.location.href = getRedirectTarget();
      }, 800);
    } catch (error) {
      showAuthMessage(messageBox, error.message || "Could not create account.", "error");
    } finally {
      setButtonBusy(button, false, "Create Account");
    }
  });

  if (googleButton) {
    googleButton.addEventListener("click", async (event) => {
      event.preventDefault();
      await handleGoogleAuth(messageBox);
    });
  }
}

function bindLoginForm() {
  const form = document.querySelector("#login-one__form");
  if (!form) {
    return;
  }

  const messageBox = document.querySelector("[data-auth-message]");
  const googleButton = document.querySelector("[data-auth-google]");
  const forgotButton = document.querySelector("[data-auth-forgot]");
  const helper = document.querySelector("[data-auth-helper]");

  if (helper && !isFirebaseConfigured()) {
    helper.textContent = "Login works now on this site with accounts created from Sign Up. Google login and email reset will work after you add your Firebase keys.";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');

    try {
      setButtonBusy(button, true, "Login");

      if (isFirebaseConfigured()) {
        await handleFirebaseEmailLogin(form);
        showAuthMessage(messageBox, "Login successful. Redirecting...", "success");
        window.setTimeout(() => {
          window.location.href = getRedirectTarget();
        }, 700);
      } else {
        handleLocalLogin(form, messageBox);
      }
    } catch (error) {
      showAuthMessage(messageBox, error.message || "Could not log in.", "error");
    } finally {
      setButtonBusy(button, false, "Login");
    }
  });

  if (googleButton) {
    googleButton.addEventListener("click", async (event) => {
      event.preventDefault();
      await handleGoogleAuth(messageBox);
    });
  }

  if (forgotButton) {
    forgotButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const email = form.querySelector('[name="auth_email"]').value.trim();

      if (!email) {
        showAuthMessage(messageBox, "Enter your email first, then click Forgot Password.", "error");
        return;
      }

      if (!isFirebaseConfigured()) {
        showAuthMessage(messageBox, "Password reset email needs Firebase setup. For now, use the same password you created in local sign up.", "info");
        return;
      }

      try {
        const { auth, authModule } = await getFirebaseAuthTools();
        await authModule.sendPasswordResetEmail(auth, email);
        showAuthMessage(messageBox, "Password reset email sent. Please check your inbox.", "success");
      } catch (error) {
        showAuthMessage(messageBox, error.message || "Could not send reset email.", "error");
      }
    });
  }
}

bindSignupForm();
bindLoginForm();

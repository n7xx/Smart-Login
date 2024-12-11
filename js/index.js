class Validation {
  static validateName(name) {
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    return nameRegex.test(name);
  }

  static validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  static validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }
  static validateInput(input, type) {
    switch (type) {
      case "name":
        return Validation.validateName(input.value);
      case "email":
        return Validation.validateEmail(input.value);
      case "password":
        return Validation.validatePassword(input.value);
      default:
        return false;
    }
  }
  static toggleValidationClass(input, isValid) {
    if (isValid) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    } else {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
    }
  }
  static getErrorMsg(msg) {
    const messages = {
      name: "Name must be at least 3 characters long and contain only letters",
      email: "Please enter a valid email address",
      password:
        "Password must be at least 8 characters long and include uppercase, lowercase, and number",
      loginFailed: "Invalid email or password",
    };
    return messages[msg];
  }
}

class UserStorage {
  static saveUser(user) {
    const users = this.getAllUsers();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }
  static getAllUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  }
  static isEmailExists(email) {
    const users = this.getAllUsers();
    return users.some((user) => user.email === email);
  }
  static validateLogin(email, password) {
    const users = this.getAllUsers();
    return users.find(
      (user) => user.email === email && user.password === password
    );
  }
  static getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
  }
  static setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
  static isAuthenticated() {
    return !!this.getCurrentUser();
  }
  static logout() {
    localStorage.removeItem("currentUser");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const filename = path.split("/").pop();

  if (filename === "home.html") {
    if (!UserStorage.isAuthenticated()) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Please login to access the Home",
        confirmButtonText: "Go to Login",
      }).then(() => {
        window.location.href = "index.html";
      });
      return;
    }
    const currentUser = UserStorage.getCurrentUser();
    const welcomeElement = document.querySelector("h1.color-custom");
    if (welcomeElement && currentUser) {
      welcomeElement.textContent = `Welcome, ${currentUser.name}!!`;
    }

    const logoutLink = document.querySelector(".logout a");
    logoutLink?.addEventListener("click", (e) => {
      e.preventDefault();
      Swal.fire({
        icon: "question",
        title: "Logout",
        text: "Are you sure you want to logout?",
        showCancelButton: true,
        confirmButtonText: "Yes, Logout",
      }).then((result) => {
        if (result.isConfirmed) {
          UserStorage.logout();
          window.location.href = "index.html";
        }
      });
    });
  }
  const emailInput = document.getElementById("loginInpEmail");
  const passwordInput = document.getElementById("loginInpPass");
  const loginBtn = document.getElementById("loginBtn");

  emailInput?.addEventListener("input", (e) => {
    const isValid = Validation.validateInput(e.target, "email");
    Validation.toggleValidationClass(e.target, isValid);
  });

  passwordInput?.addEventListener("input", (e) => {
    const isValid = Validation.validateInput(e.target, "password");
    Validation.toggleValidationClass(e.target, isValid);
  });

  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      emailInput.classList.remove("is-invalid");
      passwordInput.classList.remove("is-invalid");

      let isValid = true;

      if (!Validation.validateEmail(email)) {
        isValid = false;
        emailInput.classList.add("is-invalid");
        Swal.fire({
          icon: "error",
          title: "Invalid Email",
          text: Validation.getErrorMsg("email"),
        });
      }
      if (!Validation.validatePassword(password)) {
        isValid = false;
        passwordInput.classList.add("is-invalid");
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: Validation.getErrorMsg("password"),
        });
      }
      if (isValid) {
        const user = UserStorage.validateLogin(email, password);
        if (user) {
          UserStorage.setCurrentUser(user);
          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: `Welcome back, ${user.name}!`,
            confirmButtonText: "Go to Home",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "home.html";
            }
          });
        } else {
          // Login failed
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: Validation.getErrorMsg("loginFailed"),
          });
        }
      }
    });
  }

  const signupNameInput = document.getElementById("signupInpName");
  const signupEmailInput = document.getElementById("signupInpEmail");
  const signupPasswordInput = document.getElementById("signupInpPass");
  const signupBtn = document.getElementById("signupBtn");

  if (signupBtn) {
    signupBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const name = signupNameInput.value.trim();
      const email = signupEmailInput.value.trim();
      const password = signupPasswordInput.value;

      signupNameInput.addEventListener("input", (e) => {
        const isValid = Validation.validateInput(e.target, "name");
        Validation.toggleValidationClass(e.target, isValid);
      });

      signupEmailInput.addEventListener("input", (e) => {
        const isValid = Validation.validateInput(e.target, "email");
        Validation.toggleValidationClass(e.target, isValid);
      });

      signupPasswordInput.addEventListener("input", (e) => {
        const isValid = Validation.validateInput(e.target, "password");
        Validation.toggleValidationClass(e.target, isValid);
      });
      signupNameInput.classList.remove("is-invalid");
      signupEmailInput.classList.remove("is-invalid");
      signupPasswordInput.classList.remove("is-invalid");

      let isValid = true;

      if (!Validation.validateName(name)) {
        isValid = false;
        signupNameInput.classList.add("is-invalid");
        Swal.fire({
          icon: "error",
          title: "Invalid Name",
          text: Validation.getErrorMsg("name"),
        });
      }

      if (!Validation.validateEmail(email)) {
        isValid = false;
        signupEmailInput.classList.add("is-invalid");
        Swal.fire({
          icon: "error",
          title: "Invalid Email",
          text: Validation.getErrorMsg("email"),
        });
      }

      if (UserStorage.isEmailExists(email)) {
        isValid = false;
        signupEmailInput.classList.add("is-invalid");
        Swal.fire({
          icon: "error",
          title: "Email Already Registered",
          text: "This email is already associated with an account",
        });
      }

      if (!Validation.validatePassword(password)) {
        isValid = false;
        signupPasswordInput.classList.add("is-invalid");
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: Validation.getErrorMsg("password"),
        });
      }

      if (isValid) {
        const newUser = { name, email, password };
        UserStorage.saveUser(newUser);

        Swal.fire({
          icon: "success",
          title: "Signup Successful!",
          text: "You can now login with your new account",
          confirmButtonText: "Go to Login",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "index.html";
          }
        });

        document.querySelector("form").reset();
      }
    });
  }
});

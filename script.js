const STORAGE_KEY = "studentPortalUsers";
const AUTH_KEY = "studentPortalCurrentUser";

function getUsers() {
    const rawUsers = localStorage.getItem(STORAGE_KEY);
    return rawUsers ? JSON.parse(rawUsers) : [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function redirectIfNotLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");

    if (!currentUser) {
        window.location.href = "login.html";
        return null;
    }

    return currentUser;
}

function populateProfile() {
    const user = redirectIfNotLoggedIn();
    if (!user) return;

    const nameElement = document.getElementById("profileName");
    const idElement = document.getElementById("profileStudentId");
    const emailElement = document.getElementById("profileEmail");
    const courseElement = document.getElementById("profileCourse");

    if (nameElement) nameElement.textContent = user.name || "Student Name";
    if (idElement) idElement.textContent = user.studentId || "N/A";
    if (emailElement) emailElement.textContent = user.email || "student@example.com";
    if (courseElement) courseElement.textContent = user.course || "B.Tech Computer Science";
}

function populateDashboard() {
    const user = redirectIfNotLoggedIn();
    if (!user) return;

    const welcomeMessage = document.getElementById("welcomeMessage");
    if (welcomeMessage) {
        welcomeMessage.textContent = "Welcome, " + (user.name || "Student") + "!";
    }
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const password = document.getElementById("password").value;

        if (!name || !email || !studentId || !password) {
            alert("Please fill all fields!");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email address!");
            return;
        }

        if (password.length < 8) {
            alert("Password must contain at least 8 characters!");
            return;
        }

        const users = getUsers();
        const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
            alert("An account with this email already exists!");
            return;
        }

        users.push({
            name,
            email,
            studentId,
            password,
            course: "B.Tech Computer Science"
        });

        saveUsers(users);
        alert("Registration successful! Please login.");
        window.location.href = "login.html";
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Please enter email and password!");
            return;
        }

        const users = getUsers();
        const matchedUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password);

        if (!matchedUser) {
            alert("Invalid email or password!");
            return;
        }

        localStorage.setItem(AUTH_KEY, JSON.stringify(matchedUser));
        window.location.href = "dashboard.html";
    });
}

const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {
    logoutButton.addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.removeItem(AUTH_KEY);
        window.location.href = "login.html";
    });
}

if (document.getElementById("dashboardPage")) {
    populateDashboard();
}

populateProfile();
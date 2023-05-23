// Script is using arrow functions instead of regular functions
// https://www.freecodecamp.org/news/the-difference-between-arrow-functions-and-normal-functions/

// Global variables
const signInOpenButton = document.getElementById("sign-in-open-button");
const signInCloseButton = document.getElementById("sign-in-close-button");
const signInModal = document.getElementById("sign-in-modal");
const signInButton = document.getElementById("sign-in-button");
const signInUsername = document.getElementById("sign-in-username");
const signInPassword = document.getElementById("sign-in-password");
const signInError = document.getElementById("sign-in-error");

const signUpOpenButton = document.getElementById("sign-up-open-button");
const signUpCloseButton = document.getElementById("sign-up-close-button");
const signUpModal = document.getElementById("sign-up-modal");
const signUpButton = document.getElementById("sign-up-button");
const signUpFullName = document.getElementById("sign-up-full-name");
const signUpUsername = document.getElementById("sign-up-username");
const signUpPassword = document.getElementById("sign-up-password");
const signUpConfirmPassword = document.getElementById("sign-up-confirm-password");
const signUpError = document.getElementById("sign-up-error");

// Check if user is signed in
window.onload = () => {
    const localStorageUser = localStorage.getItem('user');
    if(!!localStorageUser) {
        // If user is already logged in, redirect user to Inventory Management App Dashboard.
        window.location.href = '/html/dashboard.html';
    }
}

// Add your Firebase Configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };

firebase.initializeApp(firebaseConfig);

const alertNoID = (id) => {
    alert(`Element with ID ${id} cannot be found`);
}

if(!!signInOpenButton) {
    signInOpenButton.addEventListener("click", () => {
        if(!!signInModal) {
            signInModal.classList.remove("d-none");
            signInModal.classList.add("d-flex");
        } else {
            alertNoID("sign-in-modal");
        }
    });
} else {
    alertNoID("sign-in-open-button");
}

if(!!signInCloseButton) {
    signInCloseButton.addEventListener("click", () => {
        if(!!signInModal) {
            signInModal.classList.remove("d-flex");
            signInModal.classList.add("d-none");

            if(!!signInUsername) {
                signInUsername.value = "";
            } else {
                alertNoID("sign-in-username");
            }

            if(!!signInPassword) {
                signInPassword.value = "";
            } else {
                alertNoID("sign-in-password");
            }
        } else {
            alertNoID("sign-in-modal");
        }
    });
} else {
    alertNoID("sign-in-close-button");
}

if(!!signUpOpenButton) {
    signUpOpenButton.addEventListener("click", () => {
        if(!!signUpModal) {
            signUpModal.classList.remove("d-none");
            signUpModal.classList.add("d-flex");
        } else {
            alertNoID("sign-up-modal");
        }
    });
} else {
    alertNoID("sign-up-open-button");
}

if(!!signUpCloseButton) {
    signUpCloseButton.addEventListener("click", () => {
        if(!!signUpModal) {
            signUpModal.classList.remove("d-flex");
            signUpModal.classList.add("d-none");
        } else {
            alertNoID("sign-up-modal");
        }
    });
} else {
    alertNoID("sign-up-close-button");
}

if(!!signInButton) {
    signInButton.addEventListener("click", async () => {
        if(!!signInUsername && !! signInPassword && !!signInError) {
            const username = signInUsername.value;
            const password = signInPassword.value;
            signInError.innerHTML = "";
    
            if(!username) {
                signInError.innerHTML = "Please enter username.";
                return;
            }

            if(!password) {
                signInError.innerHTML = "Please enter password.";
                return;
            }

            signInButton.disabled = true;
            const firestoreUsers = await firebase.firestore().collection('users').get();
            const users = firestoreUsers?.docs?.map(firestoreUser => ({
                id: firestoreUser.id,
                ...firestoreUser?.data(),
            }));

            const user = users?.find(user => user.username === username && user.password === password);
            signInButton.disabled = false;

            if(!!user) {
                // Hide user password, so JSON.stringify won't use it.
                user.password = undefined;

                localStorage.setItem('user', JSON.stringify(user));
                // If user is logged in successfully, redirect user to Inventory Management App dashboard.
                window.location.href = '/html/dashboard.html';
            } else {
                signInError.innerHTML = "Wrong username or password.";
            }

        } else {
            alertNoID('"sign-in-username" or "sign-in-password" or "sign-in-error"');
        }
    });
} else {
    alertNoID("sign-in-button");
}

if(!!signUpButton) {
    signUpButton.addEventListener("click", async () => {
        if(!!signUpFullName && !! signUpUsername && !!signUpPassword && !!signUpConfirmPassword && !!signUpError) {
            const fullName = signUpFullName.value;
            const username = signUpUsername.value;
            const password = signUpPassword.value;
            const confirmPassword = signUpConfirmPassword.value;
            signUpError.innerHTML = "";
    
            if(!fullName) {
                signUpError.innerHTML = "Please enter full name.";
                return;
            }

            if(!username) {
                signUpError.innerHTML = "Please enter username.";
                return;
            }

            if(!password) {
                signUpError.innerHTML = "Please enter password.";
                return;
            }

            if(!confirmPassword) {
                signUpError.innerHTML = "Please confirm password.";
                return;
            }

            if(password !== confirmPassword) {
                signUpError.innerHTML = "Password doesn't match password confirmation.";
                return;
            }

            signUpButton.disabled = true;
            const firestoreUsers = await firebase.firestore().collection('users').get();
            const users = firestoreUsers?.docs?.map(firestoreUser => ({
                id: firestoreUser.id,
                ...firestoreUser?.data(),
            }));


            const existingUser = users?.find(user => user.username === username);

            if(!!existingUser) {
                signUpError.innerHTML = "Username already exists.";
                signUpButton.disabled = false;
                return;
            }

            const newFirestoreUser = await firebase.firestore().collection('users').add({
                fullName, username, password
            });

            const user = {
                id: newFirestoreUser.id,
                fullName,
                username
            };

            signUpButton.disabled = false;

            localStorage.setItem('user', JSON.stringify(user));

            // If user is signed up successfully, redirect user to Inventory Management App dashboard.
            window.location.href = '/html/dashboard.html';
        } else {
            alertNoID('"sign-up-full-name" or "sign-up-username" or "sign-up-password" or "sign-up-confirm-password" or "sign-up-error"');
        }
    });
} else {
    alertNoID("sign-up-button");
}
//run immediately

//tooltip init
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('[data-bs-toggle="tooltip"]')) {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }
});

//toast init
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('.toast')){
        const toastElList = document.querySelectorAll('.toast')
        const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl, { delay: 10000 }));
    }
});

//create user form submit toast message takeover
function toastMessageTakeover() {
    const toastEl = document.getElementById("successToast");
    const toast = new bootstrap.Toast(toastEl, { delay: 10000});
    toast.show();
    const closeToastButton = document.getElementById('closeToastButton');
    const pageTakeover = document.getElementById('pageTakeover');
    closeToastButton.addEventListener('click', () => {
        location.reload();
    });
};

//get all user roles
function getAllUserRoles() {
    fetch("http://localhost:5500/api/roles")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then((roles) => {
            console.log("Fetched roles: ", roles);
            const predefinedOrder = ["Read Only", "Admin", "Super User"];

            //separate predefined roles and other roles
            const sortedRoles = [...predefinedOrder, ...roles.map(role => role.role)
                .filter(role => !predefinedOrder.includes(role))
            ];
            const rolesContainer = document.getElementById('roleSelector');
            sortedRoles.forEach(role => {

                const roleOption = document.createElement('option');
                roleOption.id = `${role}-option`;
                roleOption.value = role;
                roleOption.innerText = role;

                rolesContainer.appendChild(roleOption);

            });
        })
        .catch((error) => {
            console.log(`Could not fetch roles: ${error}`);
        });
};

//get all product categories
function getAllProductCategories(){
    fetch("http://localhost:5500/api/categories")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then((categories) => {
        console.log(categories);
        const categoriesContainer = document.getElementById('categoriesContainer');
        categories.forEach(category => {

            const categoryInput = document.createElement('input');
            categoryInput.type = 'checkbox';
            categoryInput.id = `category_id_${category.category_id}`;
            categoryInput.value = category.category_name;
            categoryInput.classList.add('form-check-input');

            const categoryLabel = document.createElement('label');
            categoryLabel.classList.add('form-check-label');
            categoryLabel.setAttribute('for', `category_id_${category.category_id}`);
            categoryLabel.textContent = `${category.category_name}`;

            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('form-check');
            categoryDiv.classList.add('form-check-inline');
            categoryDiv.appendChild(categoryInput);
            categoryDiv.appendChild(categoryLabel);

            categoriesContainer.appendChild(categoryDiv);

        });
    })
    .catch((error) => {
        console.log(`Could not fetch categories: ${error}`);
    });
};

//create a new user
function createUser() {
    const overlay = document.getElementById('loadingOverlay');
    const pageTakeover = document.getElementById('pageTakeover');
    overlay.classList.remove('d-none');

    const userEmail = document.getElementById('email').value.trim();
    const userFirstName = document.getElementById('firstName').value.trim();
    const userLastName = document.getElementById('lastName').value.trim();
    const userRole = document.getElementById('roleSelector').value.trim();

    // Validate input
    if (!userEmail || !userFirstName || !userLastName || !userRole) {
        alert('Please check fields and try again');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)){
        alert('Invalid email format');
        return false;
    }

    const nameRegex = /^[A-Za-z]+(?:[-'][A-Za-z]+)*$/;
    if (!nameRegex.test(userFirstName) || !nameRegex.test(userLastName)){
        alert('Invalid name format');
        return false;
    }

    // Submit Form to Server
    fetch('http://localhost:5500/api/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, firstName: userFirstName, lastName: userLastName, role: userRole })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Signup failed: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Signup failed. Please try again.');
    })
    .finally(() => {
        overlay.classList.add('d-none');
        pageTakeover.classList.remove('d-none');
        toastMessageTakeover();
        setTimeout(() => {
            location.reload();
         }, 10000);
    });
};

//password reset api call
function resetPassword () {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('d-none');

    const userEmail = document.getElementById('email').value.trim();
    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmNewPassword = document.getElementById('confirmNewPassword').value.trim();

    // Validate input
    if (!userEmail || !oldPassword || !newPassword || !confirmNewPassword) {
        alert('Please check fields and try again');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)){
        alert('Invalid email format');
        return false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[^\s]{8,20}$/;
    if (!passwordRegex.test(newPassword)){
        alert('Invalid password format');
        return false;
    }

    if (newPassword !== confirmNewPassword){
        alert('Password and Confirm Password do not match');
        return false;
    }

    // Submit Form to Server
    fetch('http://localhost:5500/api/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, oldPassword: oldPassword, newPassword: newPassword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Signup failed: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        window.location.href = '/public/index.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Signup failed. Please try again.');
    })
    .finally(() => {
        overlay.classList.add('d-none');
    });
};

//validate email input
document.addEventListener('DOMContentLoaded', () => {
    const emailElement = document.getElementById('email');
    if (emailElement){
        emailElement.addEventListener('blur', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const feedbackEl = document.getElementById('emailFeedback');
            feedbackEl.textContent = emailRegex.test(emailElement.value)
                ? ''
                : '❌ Enter a valid email (example@example.com)';
            emailElement.classList.toggle('text-danger', !emailRegex.test(emailElement.value));
        });
    }
});

//validate first and last name
document.addEventListener("DOMContentLoaded", () => {
    const nameRegex = /^[A-Za-z]+(?:[-'][A-Za-z]+)*$/;
    ["firstName", "lastName"].forEach(field => {
        const nameField = document.getElementById(field);
        const feedbackEl = document.getElementById(`${field}Feedback`);
        if (!nameField) return; // ✅ Avoid errors if the element doesn’t exist
        nameField.addEventListener("blur", () => {
            feedbackEl.textContent = nameRegex.test(nameField.value)
                ? ""
                : "❌ Name must contain only letters";
            nameField.classList.toggle("text-danger", !nameRegex.test(nameField.value));
        });
    });
});

//validate password
document.addEventListener("DOMContentLoaded", () => {
    const newPasswordField = document.getElementById('newPassword');
    if(newPasswordField){
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[^\s]{8,20}$/;
        newPasswordField.addEventListener('blur', () => {
            const feedbackEl = document.getElementById('newPasswordFeedback');
            feedbackEl.textContent = passwordRegex.test(newPasswordField.value)
                ? ''
                : '❌ 8-20 characters, must include letters, numbers, special character, no spaces or emoji';
            newPasswordField.classList.toggle('text-danger', !passwordRegex.test(newPasswordField.value));
        });
    };
});

//validate confirm password
document.addEventListener("DOMContentLoaded", () => {
    const confirmNewPasswordField = document.getElementById('confirmNewPassword');
    if(confirmNewPasswordField){
        confirmNewPasswordField.addEventListener('blur', () => {
            const newPassword = document.getElementById('newPassword').value;
            const feedbackEl = document.getElementById('confirmNewPasswordFeedback');
        
            const isMatching = newPassword === confirmNewPasswordField.value;
        
            feedbackEl.textContent = isMatching
                ? ''
                : '❌ Passwords do not match';
            confirmNewPasswordField.classList.toggle('text-danger', !isMatching);
        });
    }
});

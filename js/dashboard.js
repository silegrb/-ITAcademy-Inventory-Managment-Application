// Script is using arrow functions instead of regular functions
// https://www.freecodecamp.org/news/the-difference-between-arrow-functions-and-normal-functions/

// Global variables
let user = null;

const signOutButton = document.getElementById("sign-out-button");
const welcomeMessage = document.getElementById("welcome-message");

const addInventoryModal = document.getElementById("add-inventory-modal");
const addInventoryOpenButton = document.getElementById("add-inventory-open-button");
const addInventoryCloseButton = document.getElementById("add-inventory-close-button");
const addInventoryButton = document.getElementById("add-inventory-button");
const addInventoryTitle = document.getElementById("add-inventory-title");
const addInventoryDescription = document.getElementById("add-inventory-description");
const addInventoryQuantity = document.getElementById("add-inventory-quantity");
const addInventoryWarehouse = document.getElementById("add-inventory-warehouse");
const addInventoryError = document.getElementById("add-inventory-error");

const inventoryTable = document.getElementById("inventory-table");
const inventoryTableBody = document.getElementById("inventory-table-body");
const noInventoryMessage = document.getElementById("no-inventory-message");

// Check if user is signed in
window.onload = async () => {
    const localStorageUser = localStorage.getItem('user');

    if(!localStorageUser) {
        // If user is not logged in, but visited Dashboard, redirect user to Inventory Management App Home.
        window.location.href = '/html/home-page.html';
    }

    try {
        user = JSON.parse(localStorageUser);

        if(!!welcomeMessage) {
            welcomeMessage.innerHTML = `Welcome, ${user?.fullName}.`;
        } else {
            alertNoID("welcome-message");
        }

        const firestoreInventoryItems = await firebase.firestore().collection('inventory').get();
        const inventoryItems = firestoreInventoryItems.docs.map(firestoreInventoryItem => ({
            id: firestoreInventoryItem.id,
            ...firestoreInventoryItem?.data()
        }));
        const filteredInventoryItems = inventoryItems.filter(inventoryItem => inventoryItem.userID === user?.id);

        filteredInventoryItems.forEach(item => {
            renderInventoryItem(item);
        });

    } catch(e) {
        alert("User parsing failed");
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

const getFirstFewWords = (string, numberOfWords = 10) => {
    const parts = string.split(" ");
    if(parts.length <= numberOfWords) return string;
    return `${parts.slice(0,numberOfWords).join(" ")}...`;
}

const renderInventoryItem = (inventory) => {
    console.log(inventory);
    if(!!inventoryTable && !!inventoryTableBody) {
        inventoryTable.classList.remove("d-none");
    } else {
        alertNoID('"inventory-table" or "inventory-table-body"');
    }

    if(!!noInventoryMessage) {
        if(!noInventoryMessage.classList.contains("d-none")) {
            noInventoryMessage.classList.add("d-none");
        }
    } else {
        alertNoID("no-inventory-message");
    }

    const tr = document.createElement("tr");
    let td = document.createElement("td");

    td.innerHTML = inventory?.title;
    tr.append(td);

    td = document.createElement("td");
    td.innerHTML = getFirstFewWords(inventory?.description);
    tr.append(td);

    td = document.createElement("td");
    td.innerHTML = inventory?.quantity;
    tr.append(td);

    td = document.createElement("td");
    td.innerHTML = inventory?.warehouse;
    tr.append(td);

    const removeButton = document.createElement("button");
    removeButton.classList.add("btn");
    removeButton.classList.add("btn-danger");
    removeButton.classList.add("dashboard-action-button-danger");
    removeButton.innerHTML = "Remove";
    removeButton.addEventListener("click", async () => {
        const doc = await firebase.firestore().collection('inventory').doc(inventory?.id);
        await doc.delete();
        tr.remove();
        if(inventoryTableBody.children.length === 0) {
            noInventoryMessage.classList.remove("d-none");
            inventoryTable.classList.add("d-none");
        }
    });
    td = document.createElement("td");
    td.style.textAlign = "right";
    td.classList.add("py-3");
    td.append(removeButton);
    tr.append(td);
    tr.classList.add("border-bottom");
    tr.classList.add("border-1")
    inventoryTableBody.append(tr);
}

if(!!signOutButton) {
    signOutButton.addEventListener("click", () => {
        // Clear local storage, because it is used to check Signed In/Signed Out logic
        localStorage.removeItem("user");
        window.location.href = '/html/home-page.html';
    });
} else {
    alertNoID("sign-out-button");
}

if(!!addInventoryOpenButton) {
    addInventoryOpenButton.addEventListener("click", () => {
        if(!!addInventoryModal) {
            addInventoryModal.classList.remove("d-none");
            addInventoryModal.classList.add("d-flex");
        } else {
            alertNoID("add-inventory-modal");
        }
    });
} else {
    alertNoID("add-inventory-open-button");
}

if(!!addInventoryCloseButton) {
    addInventoryCloseButton.addEventListener("click", () => {
        if(!!addInventoryModal) {
            addInventoryModal.classList.remove("d-flex");
            addInventoryModal.classList.add("d-none");
        } else {
            alertNoID("add-inventory-modal");
        }
    });
} else {
    alertNoID("add-inventory-close-button");
}

if(!!addInventoryButton) {
    addInventoryButton.addEventListener("click", async () => {
        if(!!addInventoryTitle && !! addInventoryDescription && !!addInventoryQuantity && !!addInventoryWarehouse && !!addInventoryError) {
            const title = addInventoryTitle.value;
            const description = addInventoryDescription.value;
            const quantity = addInventoryQuantity.value;
            const warehouse = addInventoryWarehouse.value;
            addInventoryError.innerHTML = "";
    
            if(!title) {
                addInventoryError.innerHTML = "Please enter title.";
                return;
            }

            if(!description) {
                addInventoryError.innerHTML = "Please enter description.";
                return;
            }

            if(!quantity) {
                addInventoryError.innerHTML = "Please enter quantity.";
                return;
            }

            if(!warehouse) {
                addInventoryError.innerHTML = "Please enter warehouse.";
                return;
            }

            addInventoryButton.disabled = true;

            const newFirestoreInventory = await firebase.firestore().collection('inventory').add({
                title, description, quantity, warehouse, userID: user?.id
            });

            const inventory = {
                id: newFirestoreInventory.id,
                title, 
                description,
                quantity, 
                warehouse, 
                userID: user?.id
            };

            renderInventoryItem(inventory);

            addInventoryButton.disabled = false;
            addInventoryTitle.value = "";
            addInventoryDescription.value = "";
            addInventoryQuantity.value = "";
            addInventoryWarehouse.value = "";

            if(!!addInventoryModal) {
                addInventoryModal.classList.remove("d-flex");
                addInventoryModal.classList.add("d-none");
            } else {
                alertNoID("add-inventory-modal");
            }
        } else {
            alertNoID('"add-inventory-title" or "add-inventory-description" or "add-inventory-quantity" or "add-inventory-warehouse" or "add-inventory-error"');
        }
    });
} else {
    alertNoID("add-inventory-button");
}
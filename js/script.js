document.addEventListener("DOMContentLoaded", function () {
    updateOptions();
    populateQuantity();
});

let billItems = [];
let billCounter = 1;
let billHistory = [];

function updateOptions() {
    const type = document.getElementById("type").value;
    const itemSelect = document.getElementById("item");
    itemSelect.innerHTML = "";

    let items = [];

    if (type === "snacks") {
        items = [
            { name: "Samosa", price: 10 },
            { name: "Bhel Puri", price: 30 },
            { name: "Pakoda", price: 30 },
            { name: "Vada Pav", price: 15 },
            { name: "Tea", price: 10 },
            { name: "Coffee", price: 15 },
            { name: "Chips", price: 10 },
            { name: "Biscuits (Large)", price: 10 },
            { name: "Biscuits (Small)", price: 5 },
            { name: "Cake", price: 15 },
            { name: "Chocolate (Small)", price: 5 },
            { name: "Chocolate (Medium)", price: 10 },
            { name: "Chocolate (Large)", price: 15 }
        ];
    } else if (type === "food") {
        items = [
            { name: "Susla", price: 20 },
            { name: "Rice + Sambar", price: 35 },
            { name: "Alu Bath", price: 35 },
            { name: "Chapati + Curry", price: 40 },
            { name: "Chapati + Rice + Curry + Sambar", price: 60 },
            { name: "Curd Rice", price: 45 }
        ];
    }

    items.forEach(item => {
        let option = document.createElement("option");
        option.value = item.name;
        option.setAttribute("data-price", item.price);
        option.innerText = `${item.name} - ₹${item.price}`;
        itemSelect.appendChild(option);
    });
}

function populateQuantity() {
    const quantitySelect = document.getElementById("quantity");
    for (let i = 1; i <= 20; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerText = i;
        quantitySelect.appendChild(option);
    }
}

function addItem() {
    const name = document.getElementById("name").value.trim();
    const itemSelect = document.getElementById("item");
    const selectedItem = itemSelect.options[itemSelect.selectedIndex];
    const itemName = selectedItem.value;
    const itemPrice = parseInt(selectedItem.getAttribute("data-price"));
    const quantity = parseInt(document.getElementById("quantity").value);

    if (name === "") {
        alert("Please enter the customer's name!");
        return;
    }

    if (!itemName) {
        alert("Please select an item.");
        return;
    }

    if (quantity < 1 || isNaN(quantity)) {
        alert("Please select a valid quantity!");
        return;
    }

    const totalItemPrice = itemPrice * quantity;

    billItems.push({ name: itemName, price: itemPrice, quantity, total: totalItemPrice });

    updateBill(name);
    document.getElementById("quantity").value = 1;
}

function updateBill(name) {
    const billNumber = `1712${String(billCounter).padStart(3, '0')}`;
    document.getElementById("billNumber").innerText = billNumber;
    document.getElementById("custName").innerText = name;
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = "";

    let subtotal = 0;
    let taxRate = 0.05;

    billItems.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerText = `${item.name} (x${item.quantity}) - ₹${item.total}`;
        let removeButton = document.createElement("button");
        removeButton.classList.add("remove-item");
        removeButton.innerHTML = '<i class="fas fa-trash"></i>';
        removeButton.onclick = () => removeItem(index);
        removeButton.style.padding = "4px 8px";
        removeButton.style.marginLeft = "10px";
        removeButton.style.borderRadius = "50%";
        removeButton.style.backgroundColor = "#ff4d4d";
        removeButton.style.color = "#fff";
        removeButton.style.border = "none";
        li.style.padding = "8px 10px";
        li.style.margin = "5px 0";
        li.appendChild(removeButton);
        itemList.appendChild(li);
        subtotal += item.total;
    });

    const type = document.getElementById("type").value;
    if (type === "food") {
        taxRate = 0.08;
    }

    const tax = Math.round(subtotal * taxRate);
    const grandTotal = subtotal + tax;

    document.getElementById("subtotal").innerText = subtotal;
    document.getElementById("tax").innerText = tax;
    document.getElementById("total").innerText = grandTotal;

    billCounter++;
}

function removeItem(index) {
    billItems.splice(index, 1);
    updateBill(document.getElementById("name").value.trim());
}

function saveBill() {
    if (billItems.length === 0) {
        alert("No items in the bill to save!");
        return;
    }
    alert("Bill saved successfully!");
}

function printBill() {
    if (billItems.length === 0) {
        alert("No items in the bill to print!");
        return;
    }

    const billNumber = `1712${String(billCounter).padStart(3, '0')}`;
    billCounter++;
    const name = document.getElementById("custName").innerText;
    const subtotal = parseInt(document.getElementById("subtotal").innerText);
    const tax = parseInt(document.getElementById("tax").innerText);
    const grandTotal = parseInt(document.getElementById("total").innerText);

    const billDetails = { billNumber, name, subtotal, tax, grandTotal };
    billHistory.push(billDetails);
    displayBillHistory();

    document.querySelector("button").style.display = "none";
    document.querySelector(".bill-history").style.display = "none";
    setTimeout(function () {
        window.print();
        document.querySelector("button").style.display = "inline-block";
        document.querySelector(".bill-history").style.display = "block";
    }, 1000);
}

function displayBillHistory() {
    const historyContainer = document.getElementById("bill-history-list");
    historyContainer.innerHTML = "";
    billHistory.forEach(bill => {
        let billItem = document.createElement("li");
        billItem.innerText = `Bill No: ${bill.billNumber} - Name: ${bill.name} - Total: ₹${bill.grandTotal}`;
        historyContainer.appendChild(billItem);
    });
}

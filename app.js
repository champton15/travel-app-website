import { searchHotels } from "./services/hotels.js";

let currentSelection = null;
let savedTrips = JSON.parse(localStorage.getItem("trips")) || [];

/* SEARCH */
window.search = async function () {

    const city = document.getElementById("destination").value;
    const results = document.getElementById("results");

    if (!city) return;

    results.innerHTML = "<p>Loading...</p>";

    const hotels = await searchHotels(city);

    if (!hotels.length) {
        results.innerHTML = "<p>No results found</p>";
        return;
    }

    results.innerHTML = hotels.map(h => `
        <div class="card"
            onclick="openModal('${h.name}','${h.address}','${h.price}','${h.image}')">

            <img src="${h.image}">

            <div class="card-content">
                <h3>${h.name}</h3>
                <p>${h.address}</p>
                <div class="price">${h.price}</div>
            </div>
        </div>
    `).join("");
};

/* MODAL OPEN */
window.openModal = (name, address, price, image) => {

    currentSelection = { name, address, price };

    document.getElementById("modal").classList.remove("hidden");

    document.getElementById("modalTitle").innerText = name;
    document.getElementById("modalAddress").innerText = address;
    document.getElementById("modalPrice").innerText = price;
    document.getElementById("modalImg").src = image;
};

/* CLOSE MODAL */
window.closeModal = () => {
    document.getElementById("modal").classList.add("hidden");
};

/* SAVE */
window.saveFromModal = () => {
    if (!currentSelection) return;

    savedTrips.push(currentSelection);
    localStorage.setItem("trips", JSON.stringify(savedTrips));

    alert("Saved ⭐");
};

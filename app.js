import { searchHotels } from "./services/hotels.js";
import { geocode, getPlaces } from "./api.js";

/* =========================
   STATE (GLOBAL APP DATA)
========================= */
let mode = "hotels";
let savedTrips = JSON.parse(localStorage.getItem("trips")) || [];
let currentSelection = null;

/* =========================
   IMAGE SYSTEM (FALLBACK)
========================= */
function img(type) {
    return {
        hotels: "https://source.unsplash.com/600x400/?hotel",
        hostels: "https://source.unsplash.com/600x400/?hostel",
        flights: "https://source.unsplash.com/600x400/?airplane",
        trains: "https://source.unsplash.com/600x400/?train"
    }[type] || "https://source.unsplash.com/600x400/?travel";
}

/* =========================
   MODE SWITCH (HOTEL / FLIGHT ETC)
========================= */
window.setMode = (m) => {
    mode = m;
    search(); // auto refresh like real app
};

/* =========================
   MODAL CONTROL (AIRBNB STYLE)
========================= */
window.closeModal = () => {
    document.getElementById("modal").classList.add("hidden");
};

window.saveFromModal = () => {
    if (!currentSelection) return;

    savedTrips.push(currentSelection);
    localStorage.setItem("trips", JSON.stringify(savedTrips));

    alert("Trip saved ⭐");
};

/* =========================
   MAIN SEARCH FUNCTION
========================= */
window.search = async function () {

    const city = document.getElementById("destination").value;
    const results = document.getElementById("results");

    if (!city) return;

    results.innerHTML = "<p>Loading results...</p>";

    try {

        const geo = await geocode(city);

        if (!geo.features.length) {
            results.innerHTML = "<p>No location found</p>";
            return;
        }

        const { lat, lon } = geo.features[0].properties;

        /* ---------------- HOTELS / HOSTELS ---------------- */
        if (mode === "hotels" || mode === "hostels") {

            const type = mode === "hostels"
                ? "accommodation.hostel"
                : "accommodation.hotel";

            const data = await getPlaces(lat, lon, type);

            results.innerHTML = data.features.map(place => {

                const name = place.properties.name || "Stay";
                const address = place.properties.formatted || "No address";
                const price = `$${Math.floor(Math.random() * 200) + 60}`;

                return `
                <div class="card"
                    onclick="openModal('${name}','${address}','${price}','${img(mode)}')">

                    <img src="${img(mode)}">

                    <div class="card-content">
                        <h3>${name}</h3>
                        <p>${address}</p>
                        <div class="price">${price}</div>
                    </div>
                </div>`;
            }).join("");

            return;
        }

        /* ---------------- FLIGHTS ---------------- */
        if (mode === "flights") {

            const airlines = ["Delta", "Emirates", "United", "Lufthansa"];

            results.innerHTML = airlines.map(a => `
                <div class="card">
                    <img src="${img('flights')}">

                    <div class="card-content">
                        <h3>${a}</h3>
                        <p>${city} Flight Route</p>
                        <div class="price">$${Math.floor(Math.random()*700)+200}</div>
                    </div>
                </div>
            `).join("");

            return;
        }

        /* ---------------- TRAINS ---------------- */
        if (mode === "trains") {

            const trains = ["EuroRail", "Amtrak", "Shinkansen", "ICE"];

            results.innerHTML = trains.map(t => `
                <div class="card">
                    <img src="${img('trains')}">

                    <div class="card-content">
                        <h3>${t}</h3>
                        <p>${city} Route</p>
                        <div class="price">$${Math.floor(Math.random()*120)+40}</div>
                    </div>
                </div>
            `).join("");

            return;
        }

    } catch (err) {
        console.error(err);
        results.innerHTML = "<p>Error loading data</p>";
    }
};

/* =========================
   AIRBNB STYLE MODAL OPEN
========================= */
window.openModal = (name, address, price, image) => {

    currentSelection = { name, address, price };

    document.getElementById("modal").classList.remove("hidden");

    document.getElementById("modalTitle").innerText = name;
    document.getElementById("modalAddress").innerText = address;
    document.getElementById("modalPrice").innerText = price;
    document.getElementById("modalImg").src = image;
};

/* =========================
   VIEW SAVED TRIPS
========================= */
window.showTrips = () => {
    const div = document.getElementById("tripList");

    if (!savedTrips.length) {
        div.innerHTML = "<p>No saved trips yet</p>";
        return;
    }

    div.innerHTML = savedTrips.map(t => `
        <div class="card">
            <div class="card-content">
                <h3>${t.name}</h3>
                <p>${t.address}</p>
                <div class="price">${t.price}</div>
            </div>
        </div>
    `).join("");
};

/* =========================
   CLICK HANDLING (CLEAN + REAL APP STYLE)
========================= */
document.addEventListener("click", (e) => {

    /* SAVE FROM CARD (OPTIONAL FUTURE EXTENSION) */
    if (e.target.classList.contains("save-btn")) {

        const card = e.target.closest(".card");

        const name = card.querySelector("h3").innerText;
        const address = card.querySelector("p").innerText;
        const price = card.querySelector(".price").innerText;

        savedTrips.push({ name, address, price });
        localStorage.setItem("trips", JSON.stringify(savedTrips));
    }

    /* OPEN CARD DETAILS */
    const card = e.target.closest(".card");

    if (card && !e.target.classList.contains("save-btn")) {

        const name = card.querySelector("h3").innerText;
        const address = card.querySelector("p").innerText;

        console.log("Viewed:", name, address);
    }
});

import { geocode, getPlaces } from "./api.js";

/* ---------------- STATE ---------------- */
let mode = "hotels";
let savedTrips = JSON.parse(localStorage.getItem("trips")) || [];

/* ---------------- IMAGE SYSTEM ---------------- */
function getImage(type) {
    const images = {
        hotels: "https://source.unsplash.com/600x400/?hotel",
        hostels: "https://source.unsplash.com/600x400/?hostel,room",
        flights: "https://source.unsplash.com/600x400/?airplane,sky",
        trains: "https://source.unsplash.com/600x400/?train,railway"
    };

    return images[type] || "https://source.unsplash.com/600x400/?travel";
}

/* ---------------- GLOBAL FUNCTIONS ---------------- */
window.setMode = (m) => {
    mode = m;
    search(); // auto refresh like real app
};

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

/* ---------------- SEARCH FUNCTION ---------------- */
window.search = async function () {

    const city = document.getElementById("destination").value;
    const results = document.getElementById("results");

    if (!city) return;

    results.innerHTML = `
        <div class="loader"></div>
        <p style="text-align:center;">Finding best options...</p>
    `;

    try {

        const geo = await geocode(city);

        if (!geo.features.length) {
            results.innerHTML = "<p>No location found</p>";
            return;
        }

        const { lat, lon } = geo.features[0].properties;

        /* ---------------- HOTELS / HOSTELS ---------------- */
        if (mode === "hotels" || mode === "hostels") {

            let type =
                mode === "hostels"
                    ? "accommodation.hostel"
                    : "accommodation.hotel";

            const data = await getPlaces(lat, lon, type);

            results.innerHTML = data.features.map(place => {

                const name = place.properties.name || "Stay";
                const address = place.properties.formatted || "No address";
                const price = `$${Math.floor(Math.random() * 200) + 60}`;

                return `
                <div class="card">
                    <img src="${getImage(mode)}">

                    <div class="card-content">
                        <h3>${name}</h3>
                        <p>${address}</p>
                        <div class="price">${price}</div>

                        <button class="small-btn save-btn">
                            ⭐ Save Trip
                        </button>
                    </div>
                </div>`;
            }).join("");

            return;
        }

        /* ---------------- FLIGHTS ---------------- */
        if (mode === "flights") {

            let airlines = ["Delta", "Emirates", "United", "Lufthansa"];

            results.innerHTML = airlines.map(a => {
                const price = `$${Math.floor(Math.random()*700)+200}`;

                return `
                <div class="card">
                    <img src="${getImage('flights')}">

                    <div class="card-content">
                        <h3>${a}</h3>
                        <p>${city} Route</p>
                        <div class="price">${price}</div>
                    </div>
                </div>`;
            }).join("");

            return;
        }

        /* ---------------- TRAINS ---------------- */
        if (mode === "trains") {

            let trains = ["EuroRail", "Amtrak", "Shinkansen", "ICE"];

            results.innerHTML = trains.map(t => {
                const price = `$${Math.floor(Math.random()*120)+40}`;

                return `
                <div class="card">
                    <img src="${getImage('trains')}">

                    <div class="card-content">
                        <h3>${t}</h3>
                        <p>${city} Route</p>
                        <div class="price">${price}</div>
                    </div>
                </div>`;
            }).join("");

            return;
        }

    } catch (err) {
        console.error(err);
        results.innerHTML = "<p>Error loading data</p>";
    }
};

/* ---------------- SAVE SYSTEM (CLICK LISTENER FIX) ---------------- */
document.addEventListener("click", (e) => {

    /* SAVE TRIP */
    if (e.target.classList.contains("save-btn")) {

        const card = e.target.closest(".card");

        const name = card.querySelector("h3").innerText;
        const address = card.querySelector("p").innerText;
        const price = card.querySelector(".price").innerText;

        savedTrips.push({ name, address, price });
        localStorage.setItem("trips", JSON.stringify(savedTrips));

        alert("Trip saved ⭐");
    }

    /* CARD DETAILS CLICK */
    const card = e.target.closest(".card");

    if (card && !e.target.classList.contains("save-btn")) {

        const name = card.querySelector("h3").innerText;
        const address = card.querySelector("p").innerText;

        alert(`📍 ${name}\n\n${address}`);
    }
});

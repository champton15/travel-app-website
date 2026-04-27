import { geocode, getPlaces } from "./api.js";

let mode = "hotels";
let savedTrips = JSON.parse(localStorage.getItem("trips")) || [];

window.setMode = (m) => {
    mode = m;
    search();
};

window.saveTrip = (name, address, price) => {
    savedTrips.push({ name, address, price });
    localStorage.setItem("trips", JSON.stringify(savedTrips));
    alert("Saved ⭐");
};

window.showTrips = () => {
    const div = document.getElementById("tripList");

    if (!savedTrips.length) {
        div.innerHTML = "<p>No saved trips</p>";
        return;
    }

    div.innerHTML = savedTrips.map(t => `
        <div class="card">
            <div class="card-content">
                <h3>${t.name}</h3>
                <p>${t.address}</p>
                <div class="price">$${t.price}</div>
            </div>
        </div>
    `).join("");
};

window.search = async function () {

    const city = document.getElementById("destination").value;
    const results = document.getElementById("results");

    if (!city) return;

    results.innerHTML = `<div class="loader"></div>`;

    try {

        const geo = await geocode(city);

        const { lat, lon } = geo.features[0].properties;

        if (mode === "flights") {
            renderFlights(results, city);
            return;
        }

        if (mode === "trains") {
            renderTrains(results, city);
            return;
        }

        let type =
            mode === "hostels"
                ? "accommodation.hostel"
                : "accommodation.hotel";

        const data = await getPlaces(lat, lon, type);

        results.innerHTML = data.features.map(place => {
            const name = place.properties.name || "Stay";
            const address = place.properties.formatted;
            const price = Math.floor(Math.random() * 200) + 60;

            return `
            <div class="card">
                <img src="https://source.unsplash.com/400x300/?hotel">
                <div class="card-content">
                    <h3>${name}</h3>
                    <p>${address}</p>
                    <div class="price">$${price}</div>
                    <button class="small-btn"
                        onclick="saveTrip('${name}','${address}','${price}')">
                        Save
                    </button>
                </div>
            </div>`;
        }).join("");

    } catch (e) {
        results.innerHTML = "<p>Error loading data</p>";
    }
};

function renderFlights(results, city) {
    let airlines = ["Delta", "Emirates", "United", "Lufthansa"];

    results.innerHTML = airlines.map(a => `
        <div class="card">
            <img src="https://source.unsplash.com/400x300/?airplane">
            <div class="card-content">
                <h3>${a}</h3>
                <p>${city} Route</p>
                <div class="price">$${Math.floor(Math.random()*700)+200}</div>
            </div>
        </div>
    `).join("");
}

function renderTrains(results, city) {
    let trains = ["EuroRail", "Amtrak", "Shinkansen"];

    results.innerHTML = trains.map(t => `
        <div class="card">
            <img src="https://source.unsplash.com/400x300/?train">
            <div class="card-content">
                <h3>${t}</h3>
                <p>${city} Route</p>
                <div class="price">$${Math.floor(Math.random()*120)+40}</div>
            </div>
        </div>
    `).join("");
}

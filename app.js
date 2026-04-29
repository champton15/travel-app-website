let currentMode = "accommodation.hotel";
let currentResults = [];

function setMode(mode) {
    currentMode = mode;
}

async function search() {
    const city = document.getElementById("destination").value;
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "Loading...";

    try {
        const geo = await geocode(city);

        if (!geo.features.length) {
            resultsDiv.innerHTML = "No location found.";
            return;
        }

        const { lat, lon } = geo.features[0].properties;

        const places = await getPlaces(lat, lon, currentMode);

        currentResults = places.features;

        displayResults(currentResults);

    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = "Error loading data.";
    }
}

function displayResults(places) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    places.forEach((place, index) => {
        const p = place.properties;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="https://source.unsplash.com/400x300/?travel,hotel" />
            <h3>${p.name || "Unknown"}</h3>
            <p>${p.address_line1 || ""}</p>
            <div class="price">$${Math.floor(Math.random() * 200 + 50)}</div>
        `;

        card.onclick = () => openModal(index);

        resultsDiv.appendChild(card);
    });
}

function openModal(index) {
    const place = currentResults[index].properties;

    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("modalTitle").innerText = place.name || "Unknown";
    document.getElementById("modalAddress").innerText = place.address_line1 || "";
    document.getElementById("modalImg").src =
        "https://source.unsplash.com/800x500/?travel";

    document.getElementById("modalPrice").innerText =
        "$" + Math.floor(Math.random() * 200 + 50);
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

function saveFromModal() {
    alert("Trip saved (we’ll upgrade this next)");
}

/* 🔥 THIS FIXES YOUR BUTTON ERRORS */
window.search = search;
window.setMode = setMode;
window.closeModal = closeModal;
window.saveFromModal = saveFromModal;

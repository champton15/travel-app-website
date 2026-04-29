let currentMode = "accommodation.hotel";
let currentResults = [];

function setMode(mode) {
    currentMode = mode;

    // auto refresh if user already searched
    const city = document.getElementById("destination").value;
    if (city) search();
}

async function search() {
    const city = document.getElementById("destination").value;
    const resultsDiv = document.getElementById("results");

    if (!city) return;

    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
        const geo = await geocode(city);

        if (!geo.features || geo.features.length === 0) {
            resultsDiv.innerHTML = "<p>No location found.</p>";
            return;
        }

        const { lat, lon } = geo.features[0].properties;

        const data = await getPlaces(lat, lon, currentMode);
        currentResults = data.features || [];

        renderResults();

    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = "<p>Error loading data.</p>";
    }
}

function renderResults() {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!currentResults.length) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    currentResults.forEach((place, index) => {
        const p = place.properties;

        // 🔥 REAL WORKING IMAGE FIX
        const image = `https://picsum.photos/400/300?random=${index}`;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${image}" />
            <h3>${p.name || "Unknown Place"}</h3>
            <p>${p.address_line1 || "No address"}</p>
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
        `https://picsum.photos/800/500?random=${index}`;

    document.getElementById("modalPrice").innerText =
        "$" + Math.floor(Math.random() * 200 + 50);
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

function saveFromModal() {
    alert("Saved!");
}

/* 🔥 MAKE FUNCTIONS GLOBAL (FIXES YOUR BUTTON ISSUES) */
window.search = search;
window.setMode = setMode;
window.closeModal = closeModal;
window.saveFromModal = saveFromModal;

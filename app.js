let mode = "hotels";
let currentPlace = null;

function setMode(newMode) {
    mode = newMode;
}

async function search() {
    const city = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("results");

    if (!city) return;

    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
        const geoData = await geocode(city);

        if (!geoData.features || geoData.features.length === 0) {
            resultsDiv.innerHTML = "<p>City not found.</p>";
            return;
        }

        const [lon, lat] = geoData.features[0].geometry.coordinates;

        let category = "accommodation.hotel";
        if (mode === "hostels") category = "accommodation.hostel";
        if (mode === "flights") {
            resultsDiv.innerHTML = "<p>✈️ Flights coming in Phase 3</p>";
            return;
        }
        if (mode === "trains") {
            resultsDiv.innerHTML = "<p>🚆 Trains coming in Phase 3</p>";
            return;
        }

        const data = await getPlaces(lat, lon, category);
        const places = data.features;

        resultsDiv.innerHTML = "";

        if (!places || places.length === 0) {
            resultsDiv.innerHTML = "<p>No results found.</p>";
            return;
        }

        places.forEach(place => {
            const name = place.properties.name || "Unknown";
            const address = place.properties.formatted || "No address";

            // 🔥 Fake image (for now)
            const img = `https://source.unsplash.com/400x300/?hotel,${name}`;

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${img}">
                <h3>${name}</h3>
                <p>${address}</p>
            `;

            // 🔥 CLICKABLE CARD
            card.onclick = () => openModal(name, address, img);

            resultsDiv.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = "<p>Error loading data.</p>";
    }
}

function openModal(name, address, img) {
    currentPlace = { name, address };

    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("modalTitle").innerText = name;
    document.getElementById("modalAddress").innerText = address;
    document.getElementById("modalImg").src = img;

    // fake pricing for now
    document.getElementById("modalPrice").innerText =
        "$" + (Math.floor(Math.random() * 200) + 50) + " / night";
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

function saveFromModal() {
    if (!currentPlace) return;

    const saved = JSON.parse(localStorage.getItem("saved")) || [];
    saved.push(currentPlace);
    localStorage.setItem("saved", JSON.stringify(saved));

    alert("Saved!");
}

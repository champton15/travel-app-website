let mode = "hotels";

function setMode(newMode) {
    mode = newMode;
}

async function search() {
    const city = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("results");

    if (!city) return;

    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
        // 1. Get coordinates
        const geoData = await geocode(city);

        if (!geoData.features || geoData.features.length === 0) {
            resultsDiv.innerHTML = "<p>City not found.</p>";
            return;
        }

        const coords = geoData.features[0].geometry.coordinates;
        const lon = coords[0];
        const lat = coords[1];

        // 2. Choose category
        let category = "accommodation.hotel";
        if (mode === "hostels") category = "accommodation.hostel";
        if (mode === "food") category = "catering.restaurant";

        // 3. Get places
        const placeData = await getPlaces(lat, lon, category);

        const places = placeData.features;

        resultsDiv.innerHTML = "";

        if (!places || places.length === 0) {
            resultsDiv.innerHTML = "<p>No results found.</p>";
            return;
        }

        // 4. Display results
        places.forEach(place => {
            const name = place.properties.name || "Unknown";
            const address = place.properties.formatted || "No address";

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h3>${name}</h3>
                <p>${address}</p>
                <button onclick='savePlace("${name}", "${address}")'>Save</button>
            `;

            resultsDiv.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = "<p>Error loading data.</p>";
    }
}

function savePlace(name, address) {
    const saved = JSON.parse(localStorage.getItem("saved")) || [];
    saved.push({ name, address });
    localStorage.setItem("saved", JSON.stringify(saved));
    alert("Saved!");
}

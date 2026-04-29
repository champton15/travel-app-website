const API_KEY = "b071fca2216e4d3bb2cbea11fad11019";

async function geocode(city) {
    const res = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${city}&apiKey=${API_KEY}`
    );
    return await res.json();
}

async function getPlaces(lat, lon, category) {
    const res = await fetch(
        `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},5000&limit=6&apiKey=${API_KEY}`
    );
    return await res.json();
}

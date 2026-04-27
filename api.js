const API_KEY = "b071fca2216e4d3bb2cbea11fad11019";

export async function geocode(city) {
    const res = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&lang=en&apiKey=${API_KEY}`
    );
    return res.json();
}

export async function getPlaces(lat, lon, type) {
    const res = await fetch(
        `https://api.geoapify.com/v2/places?categories=${type}&filter=circle:${lon},${lat},5000&limit=8&lang=en&apiKey=${API_KEY}`
    );
    return res.json();
}

const API_KEY = "YOUR_GEOAPIFY_KEY";

export async function geocode(city) {
    const res = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${city}&apiKey=${API_KEY}`
    );
    return await res.json();
}

export async function getPlaces(lat, lon, category) {
    const res = await fetch(
        `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},5000&limit=6&apiKey=${API_KEY}`
    );
    return await res.json();
}

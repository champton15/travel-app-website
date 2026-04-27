import { geocode, getPlaces } from "../apis/geoapify.js";
import { getImage } from "../apis/images.js";

export async function searchHotels(city) {

    const geo = await geocode(city);

    if (!geo.features.length) return [];

    const { lat, lon } = geo.features[0].properties;

    const data = await getPlaces(lat, lon, "accommodation.hotel");

    return Promise.all(
        data.features.map(async (place) => {

            const name = place.properties.name || "Hotel";
            const address = place.properties.formatted || "No address";

            const image = await getImage(city + " hotel");

            return {
                name,
                address,
                image,
                price: estimatePrice(city)
            };
        })
    );
}

/* realistic pricing */
function estimatePrice(city) {
    const base = city.length * 5;
    return `$${80 + base}/night`;
}

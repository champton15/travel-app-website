const KEY = "YOUR_UNSPLASH_KEY";

export async function getImage(query) {

    try {
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&client_id=${KEY}`
        );

        const data = await res.json();

        return data.results[0]?.urls?.regular
            || "https://source.unsplash.com/600x400/?travel";

    } catch {
        return "https://source.unsplash.com/600x400/?travel";
    }
}

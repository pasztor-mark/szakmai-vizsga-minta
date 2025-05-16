export async function rentBook(id: number) {
    const req = await fetch(`http://localhost:3000/api/books/${id}/rent`, { // API endpoint
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (req.status === 201) { // ha elfogadja a kérést, igazat ad vissza
        return true
    }
    else {
        const res = await req.json() // JSON formátumú válasz
        return res.message || "Hiba történt a könyv kölcsönzésekor" // ha nem sikerül, akkor a hibaüzenetet adja vissza
    }
}
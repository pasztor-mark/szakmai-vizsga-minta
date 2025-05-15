export async function rentBook(id: number) {
    const req = await fetch(`http://localhost:3000/api/books/${id}/rent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (req.status === 201) {
        return true
    }
    else {
        const res = await req.json()
        return res.message || "Hiba történt a könyv kölcsönzésekor"
    }
}
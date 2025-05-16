import { useEffect, useState } from "react"
import type { Book } from "../types"
import BookCard from "../components/BookCard"

export default function BookGrid() {
    const [books, setBooks] = useState<Book[]>([])
    useEffect(() => {
        fetchBooks()
    }, [])
    async function fetchBooks() { // Könyvek lekérdezése
        const req = await fetch("http://localhost:3000/api/books", { // aszinkron kérés az APIhoz
            method: "GET", // HTTP metódus
            headers: {
                "Content-Type": "application/json" // KÖTELEZŐ fejléc
            }
        })
        const res = await req.json() // aszinkron JSON formátummá alakítás
        setBooks(res.data) // JSON válasz data tömbjének beállítása
    }
   return (
        <article className="flex flex-row gap-4 flex-wrap">
        {
            books.map((book) => ( // MAP függvény: végigiterál a könyvek tömbjén
                // (item) => (...) => kijelzi a könyveket
                // (book) => {...} => műveleteket végez a könyvekkel
                <BookCard key={book.id} book={book} /> //visszaad egy könyv kártyát a könyv adataival
            ))
        }
        </article>
    )
}

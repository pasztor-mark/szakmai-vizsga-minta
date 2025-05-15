import { useEffect, useState } from "react"
import type { Book } from "../types"
import BookCard from "../components/BookCard"

export default function BookGrid() {
    const [books, setBooks] = useState<Book[]>([])
    useEffect(() => {
        fetchBooks()
    }, [])
    async function fetchBooks() {
        const req = await fetch("http://localhost:3000/api/books", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const res = await req.json()
        setBooks(res.data)
    }
   return (
        <article className="flex flex-row gap-4 flex-wrap">
        {
            books.map((book) => (
                <BookCard key={book.id} book={book} />
            ))
        }
        </article>
    )
}

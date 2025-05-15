import { useState } from "react";
import type { Book } from "../types";
import { rentBook } from "../functions";

export default function BookCard({book}: {book: Book}) {
    const [rentStatus, setRentStatus] = useState<true | string | undefined>();
   return (
        <div className=" basis-[99%] md:basis-[45%] xl:basis-[30%] border border-gray-600 flex flex-col gap-4 rounded-xl shadow-lg p-4 m-4 bg-white">
            <h2 className="text-xl font-bold">{book.title}</h2>
            <p className="text-lg">{book.author}</p>
            <p>Kiadási év: {book.publish_year}</p>
            <p>Oldalszám: {book.page_count}</p>
            <hr className="w-11/12 border border-gray-600" />
            <img src={`/${book.author}.jpg`} alt={book.author}/>
            <button disabled={rentStatus !== undefined} className="mx-auto bg-blue-400 p-3 w-full rounded-xl" onClick={() => {
                rentBook(book.id).then((r) => {
                    setRentStatus(r)
                })
            }}>{rentStatus === undefined ? "Kölcsönzés" : rentStatus === true ? "Kölcsönözve" : rentStatus}</button>
        </div>
    )
}

import type { Book } from "../types";

export default function BookCard({book}: {book: Book}) {

   return (
        <div className=" basis-[99%] md:basis-[45%] xl:basis-[30%] border border-gray-600 flex flex-col gap-4 rounded-xl shadow-lg p-4 m-4 bg-white">
            <h2 className="text-xl font-bold">{book.title}</h2>
            <p className="text-lg">{book.author}</p>
            <p>Kiadási év: {book.publish_year}</p>
            <p>Oldalszám: {book.page_count}</p>
            <hr className="w-11/12 border border-gray-600" />
            <img src={`/${book.author}.jpg`} alt={book.author}/>
        </div>
    )
}

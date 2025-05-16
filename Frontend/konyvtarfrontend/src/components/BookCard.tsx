import { useState } from "react";
import type { Book } from "../types";
import { rentBook } from "../functions";

export default function BookCard({ book }: { book: Book }) {
  const [rentStatus, setRentStatus] = useState<true | string | undefined>();
  // A kölcsönzés státuszának tárolására szolgáló állapotváltozó
  // A useState hook segítségével létrehozunk egy állapotváltozót, amely kezdetben undefined értéket kap.
  return (
    //basis: a reszponzivitáshoz szükséges, megszabja a kártya szélességét százalékban (mindig kicsit kevesebb mint az arány)
    <div className=" basis-[99%] md:basis-[45%] xl:basis-[30%] border border-gray-600 flex flex-col gap-4 rounded-xl shadow-lg p-4 m-4 bg-white">
      <h2 className="text-xl font-bold">{book.title}</h2>{" "}
      {/* Könyv címe. Dinamikus megjelenítéshez {adattag} formátum kell. */}
      <p className="text-lg">{book.author}</p>
      <p>Kiadási év: {book.publish_year}</p>
      <p>Oldalszám: {book.page_count}</p>
      <hr className="w-11/12 border border-gray-600" />
      <img src={`/${book.author}.jpg`} alt={book.author} />{" "}
      {/*`${adattag} - stringbe változót beágyazás`*/}
      <button
        disabled={rentStatus !== undefined} // ha a kölcsönzési logika még nem futott le, akkor a gomb kattintható
        className="mx-auto bg-blue-400 p-3 w-full rounded-xl"
        onClick={() => {
          rentBook(book.id).then((r) => { // kérés után a válaszban kapott értéket beállítja
            setRentStatus(r);
          });
        }}
      >
        {rentStatus === undefined // gomb állapot alapján változik a szöveg
          ? "Kölcsönzés"
          : rentStatus === true
          ? "Kölcsönözve"
          : rentStatus}
      </button>
    </div>
  );
}

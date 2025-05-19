### Rövid leírás
Backenden megírt API-t felhasználó komplex frontend applikáció elkészítése olvasási, létrehozási funkciókkal, és állapotkezeléssel
### Pontozás

| Szempont                                             | Érték   |
| ---------------------------------------------------- | ------- |
| reszponzív viselkedésű weboldal készítés és formázás | 10 pont |
### Fájlstruktúra
```python  

- konyvtarfrontend
#	- node_modules # generált mappa, NE tartalmazza a beadott termék
	- public
		- (képek)
	- src
		- components # kisebb komponensek
			- ItemCard.tsx
			- Footer.tsx
			- Header.tsx
		- pages # nagyobb komponensek/komponens-gyűjtemények
			- FormDisplay.tsx
			- ItemGrid.tsx
		- lib # nem-kijelzett funkciók
			- types.ts # típusdefiníciók
			- functions.ts # metódusok definíciói
		- App.tsx # Főoldal
		- App.css # Tailwind import helye
		- main.tsx # ne változtasd meg
	- index.html
	- vite.config.ts
```

### Dependency-k  
- Node.js 19.0 vagy korábbi
- TypeScript
- Vite
- Tailwind CSS
### Parancssor
- `npm create vite@latest`
	- React
	- TypeScript (JS is működik, és egyszerűbb)
- `npm i` - csomagok telepítése
- `npm install tailwindcss @tailwindcss/vite`
- `npm run dev` - kiszolgáló indítása

### Típusfeladatok
- Projekt struktúra felépítése
	- lásd: Parancssor
- Dependency-k konfigurálása
	- Tailwind:
		- `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({

  plugins: [react(), tailwindcss()], // React és Tailwind CSS pluginok

})
```

```css
# App.css
@import "tailwindcss"
```
- Fetch API használata
	- GET metódus
```typescript
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
```
	- POST metódus
```typescript
async function submitData() {
    const body = JSON.stringify(formData); // JSON formátumba konvertálja a formot
    const req = await fetch("http://localhost:3000/api/books", { // API endpoint
      method: "POST", // HTTP metódus
      headers: {
        "Content-Type": "application/json", // KÖTELEZŐ fejléc
      },
      body: body, // JSON formátumú adatküldés
    });

    const res = await req.json(); // válasz feldolgozása (aszinkron)
    if (res.statusCode !== 201) {
      setErrortext(res.message); // ha van hiba, beállítja a hibaüzenetet
      return;
    }
    //ha jó a request, visszaállítja a stateket
    setErrortext("");
    setFormData({ author: "", page_count: 0, publish_year: 0, title: "" });
    window.location.reload(); // frissül az oldal
  }
```
- Statikus képek használata
	- képek helye: `/public` mappa
	- elérési útvonal: `src="/kep.png"`
- Prop kezelések
	- komponenseknél megadhatók tulajdonságok (propok)
	- a komponenst tartalmazó elemben definiálhatjuk a kapott propokat
	- a tulajdonos komponensben fel tudjuk használni a propokat kijelzésre vagy logikára
```typescript
import { useState } from "react";
import type { Book } from "../types";
import { rentBook } from "../functions";

export default function BookCard({ book }: { book: Book }) { //prop
// FunkcioNev({prop1, prop2} : {prop1: Prop1Tipus; prop2: Prop2Tipus})
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
```
- Reszponzív megjelenés
	- flexbox kezelése
		- `flex` beállítja a displayt
		- `flex-row` vízszintes sor
		- `flex-col` függőleges oszlop
		- `flex-basis` elem szélessége/magassága
		- `flex-wrap` elemek több sorba rendezése
- Form kezelés
	- state kezelést egészíti ki
	- 1. lépés: `useState` definiálása
		- `const [formState, setFormState] = useState({title: "", author: "", publish_year: 0})`
	- 2. lépés: inputok beállítása
```jsx
      <input
        onChange={(e) => //e: ChangeEvent, változáskor a setFormData csak a title változik, a ...formData hagyja a többit
          setFormData({ ...formData, title: e.currentTarget.value })
        }
        type="text"/> //típus: text vagy number
```
- Komponensek elkészítése
```jsx
// Komponens boilerplate (pl. KonyvKartya.tsx)

export default function KonyvKartya({konyv}: {konyv: Book}) { //átadott prop az elemnek
	//...logika, state-ek, hook-ok
	return (
		<>
		HTML logika
		</>
	)
}
```
- Komponens használata más fájlban
```jsx
// App.tsx
function App() {
  return ( // Header és BookGrid, BookForm és Footer külön, kiszervezett komponensek
    <main>
      <Header/>
      <BookGrid/>
      <BookForm/>
      <Footer/>
    </main>
  )
}
export default App

```
- Hook (`useEffect` és `useState`) kezelés
- Típusok/interfészek/osztályok használata
	- ajánlott külön `types.ts` fájl használata
```typescript
export interface CreateBook  {
    title: string,
    author: string,
    publish_year: number,
    page_count: number,
}
```
`import type { CreateBook } from "../types";`
- Dinamikus tartalommegjelenítés
```jsx
        <article className="flex flex-row gap-4 flex-wrap">
        {
            books.map((book) => ( // MAP függvény: végigiterál a könyvek tömbjén
                // (item) => (...) => kijelzi a könyveket
                // (book) => {...} => műveleteket végez a könyvekkel
                <BookCard key={book.id} book={book} /> //visszaad egy könyv kártyát a könyv adataival
            ))
        }
        </article>
```
- CSS stílusozás
	- Tailwind szelektorok használata
	- Flexbox, border, width, bg, text-xl, stb.
- HTML tagek használata
	- szemantikus tagek (article, section, header, nav, footer, main)
	- címsor tagek (h1-h6)
- Hibakezelés
	- dobott exceptionnél a program más eredményt dobjon
		- (pl. foglalásnál)
### Részfeladatok
- Stringbe változó ágyazás
	- `${adattag} - stringbe változót beágyazás (backtick-ek (altgr + 7))
- `useState` használat
	- az `useState` használatos a változók eltárolására (`var` helyett)
	- forma: `const [adat, setAdat] = useState<tipus>(alapertek) //típus opcionális`
- `useEffect`
	- az eseményekre hallgat, és futtat funkciókat amikor kell
	- forma:
```typescript
useEffect(() => {
...kód
}, [dependencyk]) //minden dependency változásnál lefut a kód, üres tömb [] esetén csak első betöltésen frissül, dependency tömb nélkül minden ticken frissül (ne csinálj olyat)
```

### Pontozás
| Feladat                                                                      | Részfeladat | Pont   |
| ---------------------------------------------------------------------------- | ----------- | ------ |
| **2.1 – Az alkalmazás működése**                                             |             | **15** |
| a) Projekt létrehozása, hiba nélkül fordítható                               | 1           |        |
| b) Könyvek listázása – Adatok megjelenítése a böngészőben                    | 2           |        |
| b) Könyvek listázása – Szerző fényképe megjelenik                            | 1           |        |
| b) Könyvek listázása – Adatok betöltése backend API végpontról               | 1           |        |
| c) Új könyv form – Négy input mező a táblázat alatt                          | 1           |        |
| c) Új könyv form – Adatok küldése backend API-nak megfelelő formátumban      | 2           |        |
| c) Új könyv form – Validációs hibaüzenet megjelenik                          | 1           |        |
| d) Foglalás gomb – Megjelenik minden könyvnél                                | 1           |        |
| d) Foglalás gomb – Meghívja a megfelelő backend végpontot                    | 1           |        |
| d) Foglalás gomb – Hibaüzenet megjelenik                                     | 1           |        |
| e) Fejléc, lábléc – Fejléc tartalmazza az oldal nevét és a kért linkeket     | 1           |        |
| e) Fejléc, lábléc – Láblécben szerepel a tanuló neve                         | 1           |        |
| e) Fejléc, lábléc – `<title>` tag tartalmazza az oldal nevét                 | 1           |        |
| **2.2 – Reszponzív, szemantikusan helyes weboldal**                          |             | **10** |
| f) Szemantikus HTML – `<header>` és `<footer>` tag használata                | 1           |        |
| f) Szemantikus HTML – `<main>`, `<section>`, `<article>` használata          | 1           |        |
| f) Szemantikus HTML – Navigációs linkek `<nav>` tag-ben                      | 1           |        |
| f) Szemantikus HTML – Oldalcím `<h1>`, könyvcímek alacsonyabb szintű heading | 1           |        |
| g) Reszponzív megjelenés – Mobil nézet: könyvek egymás alatt                 | 1           |        |
| g) Reszponzív megjelenés – Tablet nézet: soronként 2 könyv                   | 1           |        |
| g) Reszponzív megjelenés – Desktop nézet: soronként 3 könyv                  | 1           |        |
| g) Reszponzív megjelenés – Kártyák térközzel/szegéllyel elkülönülnek         | 1           |        |
| g) Reszponzív megjelenés – Navigációs linkek egy sorban                      | 1           |        |
| g) Reszponzív megjelenés – Hibaüzenetek színezéssel elkülönülnek             | 1           |        |

### Rövid leírás
REST API kiszolgáló elkészítése TypeScript nyelven.
### Pontozás

| Szempont                                                                                                          | Érték |
| ----------------------------------------------------------------------------------------------------------------- | ----- |
| backend programozás (adatbázis lekérdezést is végző, néhány végpontot tartalmazó REST API kiszolgáló létrehozása) | 15    |
### Dependency-k
- Node.js 19.0 vagy korábbi
- TypeScript
- Nest JS
- Prisma
- Faker.js
### Parancssor

Keret klónozása **nélkül**
`npx nest new projektneve` létrehozza az új projektet az aktuákis mappában
`cd projektneve` projekt rootba lépés
`npm install prisma --save-dev` Prisma telepítése
`npx prisma init`
.env fájl létrehozása

Keret klónozásával
`git clone [github repo linkje]`
`cd projektmappa`
`npm i`

Ezután a következő lépések közösek
`.env.example` $\rightarrow$ `.env`
`DATABASE_URL="mysql://root@localhost:3306/adatbazisneve"`
`npx prisma generate resource resourcenev` modul generálása
`npm run start:debug` kiszolgáló futtatása hot reloaddal
### Fájlstruktúra
```python  
## A .spec.ts fájlok csak tesztelésre vannak ott. Jobb meghagyni őket, ahogy vannak.
- konyvtarbackend
#	- node_modules # generált mappa, NE tartalmazza a beadott termék
	- src
		- sajatresource
			- dto
				- create-sajatresource.dto.ts # adat séma az új objektumra
				- update-sajatresource.dto.ts # adat séma az objektum frissítésére
			- entities
				- sajatresource.entity.ts # általános adat séma az objektumra
#			- sajatresource.controller.spec.ts
			- sajatresource.controller.ts # saját modul API végpontjai
			- sajatresource.module.ts # saját modul központi modulja
#			- sajatresource.service.spec.ts
			- sajatresource.service.ts # API végpontok mögöttes logikája
#		- app.controller.spec.ts
		- app.controller.ts
		- app.module.ts # importokat ide kell helyezni
		- app.service.ts
		- prisma.service.ts # dokumentációban megtalálható snippet
		- main.ts
```


### Típusfeladatok
- Service-ek importálása (pl. `prisma.service.ts` importálása)
    - `app.module.ts`-ben az összes használt importot a `providers` tömbbe hozzá kell adni.
    - `providers: [AppService, BooksService, PrismaService]`
- Séma létrehozása
    - Az ORM keretrendszerben sémában meg tudjuk adni az adatbázis struktúráját
    - Egy modelnek kell lennie egy **elsődleges kulcsnak**
        - `id  Int  @id @default(autoincrement()`
        - Ez egyedi kulcs, az autoincrement miatt mindegyik ID nagyobb lesz, mint az előző
- [Tábla kapcsolatok](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)
    - Egy tábla relációit meg lehet adni expliciten:
        - One-to-one (1:1)
        - One-to-many (1:N)
        - Many-to-many (n:m)
    - vagy impliciten (csak n:m relációnál)


Példa séma
```prisma
model books {
  id           Int       @id @default(autoincrement())
  title        String
  author       String
  publish_year Int
  page_count   Int
  created_at   DateTime  @default(now())
  updated_at   DateTime  @default(now())
  rentals      rentals[]
}
```
- Controller
    - A controller tartalmazza a modul API végpontjait.
    - Meghívja a Service-ben definiált logikát
- Service
    - Az API végpontok mögöttes logikáit tartalmazza.
    - Egy kontrollerhez jellemzően egy service tartozik.
- DTO-k
    - A DTO (Data Transfer Object) hasznos az egységes adatátvitel megszabásában.
    - Kétféle DTO készül resource generálásnál:
        - Create
            - az objektum létrehozására használt osztály
        - Update
            - az objektum szerkesztésére használt osztály
            - részlegesen örökli a Create osztályt
```typescript
export class CreateBookDto {  
    title: string  
    author: string  
    publish_year: number  
    page_count: number  
}
 ```

```typescript
export class UpdateBookDto extends PartialType(CreateBookDto) {}
```
- Seedelés
    - Az adatbázis feltöltése generált adatokkal.
    - Struktúra: (/projekt root/prisma/seed.ts)
```typescript
import {faker as f} from '@faker-js/faker'  
import {PrismaService} from "../src/prisma.service";  
  
const SEED_AMOUNT = 15 //a seedelési ciklus iterációszáma (feladatban 15)  
const prisma = new PrismaService(); // PrismaService példányosítása  
// d) A rentals táblát töltse fel véletlenül generált teszt-adatokkal, legalább 15 rekorddal!  
async function main() {  
  
    for (let i = 0; i < SEED_AMOUNT; i++) {  
        await prisma.books.create({  
            data: { // schema.prisma alapján  
                title: f.book.title(), // faker Book modulból cím  
                publish_year: f.number.int({ // faker Number modulból egész szám  
                    min: 1900, // minimum 1900 lehet a kiadás éve  
                    max: new Date().getFullYear() // maximum az idei év lehet a kiadás éve  
                }),  
                author: f.person.fullName(), // faker Person modulból teljes név  
                page_count: f.number.int({  
                    min: 1,  // minimum 1 oldal lehet  
                    max: 1000 // maximum 1000 oldal lehet  
                })  
            }  
        })  
  
        await prisma.rentals.create({  
            data: {  
                book: {  
                    connect: {  
                        id: i // az újonnan generált könyvhöz hozzárendelünk egy rentalt  
                    }  
                },  
                start_date: f.date.recent(), // faker Date modulból egy korábbi dátum  
                end_date: f.date.soon() // faker Date modulból egy későbbi dátum  
            }  
        })  
    }  
}  
main()
```

- API végpontok írása
    - Egy komponensnek három strukturális eleme van: a **modul**, **kontroller**, és **szolgáltatás** (module, controller, service)
    - A komponens CLI-vel generálható (`npx nest generate resource sajatresource`)
        - Ez a parancs létrehozza a modult, kontrollert és szolgáltatást, valamint hozzáadja az `app.module.ts` dependency tömbjébe.

- **HTTP metódusok:** (PUT, PATCH, DELETE nem kell a vizsgába)

| Név           | GET                               | GET(id)                              | POST                                     |
| ------------- | --------------------------------- | ------------------------------------ | ---------------------------------------- |
| Dekorátor     | @Get()                            | @Get(":id")                          | @Post()                                  |
| Metódus       | findAll() { }                     | findOne(@Param("id") id: string) { } | create(createItemDto: CreateItemDto) { } |
| Leírás        | Egy tábla összes elemét lekérdezi | Egy tábla egy elemét kérdezi le      | Új elemet ad hozzá a táblához            |
| SQL megfelelő | `SELECT * FROM tabla`             | `SELECT * FROM tabla WHERE id = id`  | `INSERT INTO tabla VALUES ...`           |
)

Az API végpontok írását mindig a **kontrollerben** kezdjük, ahol definiáljuk a végpont **nevét, HTTP metódusát, és argumentumait.** pl.
```typescript
// POST /api/books/{id}/rent  
@Post(":id/rent")  // POST HTTP metódusra válaszol
  rentBook(@Param("id") id: string) {  // @Param("id") id:string dekorátor: kiszedi az URL-ből a lekérdezett ID-t (pl. /api/books/19/rent -> id = "19")
    return this.booksService.rentBook(+id); //meghívja a booksService rentBook metódusát. (+id egészszé konvertálja)
  }  
}
	```
A kontrollerben meghívott funkció a komponens **szolgáltatásában** (service) található. Itt írjuk meg a teljes logikát. pl.
```typescript
async findAll() { // kötelező aszinkronnak lennie!  
  const books: Book[] = await this.prisma.books.findMany();  // visszaadja az összes könyvet  
  return {  
    data: books  
  };  
}
```
- HTTP státuszkódok

| Kód            | 200                    | 201                | 400                                                    | 404             | 409             |
| -------------- | ---------------------- | ------------------ | ------------------------------------------------------ | --------------- | --------------- |
| Jelentés       | OK                     | Created            | Bad Request                                            | Not Found       | Conflict        |
| Mikor használd | Sikeres GET lekérdezés | Sikeres POST kérés | POST kérésnél Érvénytelen adatok (pl. validációs hiba) | Nem talált adat | Már létező adat |
Példa hibakód dobására:
```typescript
if (!book) {  
  throw new NotFoundException() //ha nem létezik könyv ezzel az id-vel, hiba dobása  
}

if (isAlreadyRented) {  
  throw new ConflictException("Már ki van bérelve")  //409-es hibakód
}
```
### Hibakezelés
- Error: Nest can't resolve dependencies of the BooksService (?). Please make sure that the argument PrismaService at index [0] is available in the BooksModule context.
    - Nem írtad el a dependency nevét?
    - Importáltad az őt használó module.ts fájl Providerei közé?
    - app.module.ts-ben megjelenik?

### Hasznos linkek
- NestJS dokumentáció: https://docs.nestjs.com
- NestJS Prisma integráció https://docs.nestjs.com/recipes/prisma
- Prisma relációk: https://www.prisma.io/docs/orm/prisma-schema/data-model/relations
- CLI segítség https://docs.nestjs.com/cli/overview
- Resource generálás https://docs.nestjs.com/recipes/crud-generator
### Részpontok
| **Feladat**                   | **Leírás**                                                         | **Pont** |
| ----------------------------- | ------------------------------------------------------------------ | -------- |
| **a)** Projekt létrehozása    | Projekt neve: `KonyvtarBackend`, adatbázis betöltve                | 1        |
| **b)** Rentals adattábla      | Rentals tábla létrehozása megfelelő oszlopokkal és adattípusokkal  | 1        |
|                               | Adatbázis-migráció hozzáadva                                       | 1        |
|                               | Seedelés: min. 15 véletlen rekord létrehozása                      | 2        |
| **c)** Modell osztályok       | `Book` és `Rental` osztályok létrehozása                           | 2        |
| **d)** Könyv listázó API      | Elérhető URL-en, JSON formátumú válasz                             | 1        |
|                               | Könyvek adatainak visszaadása az adatbázisból                      | 1        |
| **e)** Új könyv létrehozó API | Elérhető URL-en, JSON formátumú válasz                             | 1        |
|                               | Bemenet validálása, hibakezelés JSON-ban és megfelelő HTTP státusz | 1        |
|                               | Sikeres létrehozás esetén az új könyv adatainak visszaadása        | 1        |
| **f)** Kölcsönzés API         | Elérhető URL-en, JSON formátumú válasz                             | 1        |
|                               | Hibás foglalás visszajelzése JSON-ban, megfelelő HTTP státusz      | 1        |
|                               | Új kölcsönzés adatainak visszaadása                                | 1        |
|                               | **Összesen**                                                       | **17**   |
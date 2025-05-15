### Szakmai vizsga gyakorlati rész felkészítő

A repóban egy **mintavizsga** (közel) maximum pontos megoldása van, kommentekkel elmagyarázva. 

- Rendelkezésre álló idő: **270 perc**  - *4 és fél óra*
- A vizsgarész súlyozásában **90%**-ot ér (a többi 10% az ágazati volt)

#### Gyakorlati vizsga részei

| Név                        | Backend fejlesztés                                                                              | Frontend fejlesztés                                                                   | Asztali alkalmazás fejlesztés                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Szempontok                 | - REST API kialakítás<br>- Adatbázisból lekérdezések<br>- Adatbázisba írás<br>- Végpontok írása | - Reszponzív kialakítás<br>- Kommunikáció az API-val<br>- Példához hasonló megjelenés | - Adatbázisból **közvetlen** lekérdezés, valamint írás<br>- Konzolos **és** grafikus alkalmazás készítése, **egy** kódbázisban. |
| Javasolt technológiák      | NestJS & Prisma                                                                                 | React & TypeScript                                                                    | C# & WPF / Java & JavaFX                                                                                                        |
| Alternatívák (ne használd) | Spring & Hibernate / ASP.NET Core & Entity Framework                                            | Angular / HTML & CSS & JavaScript                                                     |                                                                                                                                 |
| Elosztott idő              | ~30%                                                                                            | ~25%                                                                                  | ~45%                                                                                                                            |
### Előkészületek
- IDE-k megnyitása, projektek létrehozása
    - Frontend & Backend - Visual Studio Code
    - Asztali: Visual Studio / IntelliJ IDEA
    - MySQL szerver indítása
- Projektek legenerálása
    - Frontend
        - `npm create vite@latest`
        - `npm i`
        - `npm run dev`
    - Backend
        - `npx nest new projektnev`
        - vagy keretből új template, és azt klónozni
        - `npm i`
        - `npm run start:debug`
    - Asztali alkalmazás
        - C# / WPF esetén
            - Új WPF projekt
        - Java / JavaFX esetén
            - Új JavaFX projekt
        - Megjegyzés: célszerű **grafikus** projektet készíteni, mivel egy kódbázisban kell elkészíteni a konzolos, valamint a grafikus alkalmazásokat!
          `
- Adatbázis importálása
    - MySQL esetén a phpMyAdmin felületen:
        - új adatbázis létrehozása
        - importálás $\rightarrow$ dbnev.sql fájl kiválasztása
- Feladatlap elkezdése
    - Javasolt:
        - Backend $\rightarrow$ Frontend $\rightarrow$ Konzol $\rightarrow$ Grafikus

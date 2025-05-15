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

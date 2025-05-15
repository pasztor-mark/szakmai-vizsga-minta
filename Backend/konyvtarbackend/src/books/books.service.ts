import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {PrismaService} from "../prisma.service";
import {Book} from "./entities/book.entity";

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {

  }

  // Hozzon létre egy új könyvet.
  // A kérés törzse egy JSON objektum, amely tartalmazza az alábbi mezőket: title, author, publish_year,
  // page_count. Pl.:
  async create(createBookDto: CreateBookDto) {
    const {page_count, publish_year, title, author} = createBookDto // DTO elemekre bontva

    // A végpont ellenőrizze, hogy a bemeneti adatok megfelelők-e

    if (!title || !author || !publish_year || !publish_year || !page_count) { //ha valamelyik adattag nincs megadva, hibát dob
      throw new BadRequestException("Minden mező megadása kötelező.")
    }
    if (Math.round(page_count) !== page_count || page_count < 0) { // ha nem egész vagy pozitív szám
      throw new BadRequestException("Az oldalszámnak pozitív egész számnak kell lennie.")
    }
    if (Math.round(publish_year) !== publish_year || publish_year < 0) {
      throw new BadRequestException("A kiadási évnek pozitív egész számnak kell lennie.")
    }

    const res = await this.prisma.books.create({
      data: {
        ...createBookDto // spread operátorral beilleszti a DTO-t a Prisma create metódusába
      }
    })

    return {
      statusCode: 201,
      data: res // visszaadja a létrehozott könyvet
    }
  }

  // Adja vissza az összes könyv alábbi 5 adatát: id, title, author, publish_year, page_count
  // Az eredmény egy objektumokból álló lista legyen.
  async findAll() { // kötelező aszinkronnak lennie!
    const books: Book[] = await this.prisma.books.findMany();  // visszaadja az összes könyvet
    return {
      data: books
    };
  }


  // Könyv kölcsönzése: foglaljon le egy könyvet egy hétre, azaz hozzon létre egy új Rental rekordot

  async rentBook(id: number) {

    // A könyv azonosítója az URL-ben szereplő ID
    const book = await this.prisma.books.findFirst({
      where: { //megkeresi az adott id alapján feljegyzett könyvet
        id
      }
    })
    if (!book) {
      throw new NotFoundException() //ha nem létezik könyv ezzel az id-vel, hiba dobása
    }
    // A kezdődátum az aktuális dátum
    const today = new Date() // new Date() = most
    // A kölcsönzés vége a jelenlegi dátumhoz képest egy hét
    const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7)) // hozzáad 7 napot a mai naphoz
    const isAlreadyRented = await this.prisma.rentals.findFirst({
      where: { //megkeresi, hogy a könyv ki van-e bérelve
        AND: [
          { // ha
            book: {
              id
            }
          },
          {
            end_date: {
              gte: today // ha a mai napnál később van a visszaadási határidő
            }
          },
          {
            start_date: {
              lte: today // ha a mai nap előtt kezdődött
            }
          }
        ]
      }
    })
    if (isAlreadyRented) {
      throw new ConflictException("Már ki van bérelve")
    }
    const res = await this.prisma.rentals.create({
      data: {
        book: {
          connect: { // összekapcsolja az új Rentalt egy létező Book rekorddal, ID alapján
            id
          }
        },
        start_date: today,
        end_date: nextWeek
      }
    })
    return { // visszaadott JSON objektum
      id: res.id,
      book_id: res.book_id,
      start_date: res.start_date
          .toISOString() // YYYY-MM-DDTHH:mm:ss.msZ
          .split("T")[0], // YYYY-MM-DD
      end_date: res.end_date
          .toISOString()
          .split("T")[0]
    }

  }
}

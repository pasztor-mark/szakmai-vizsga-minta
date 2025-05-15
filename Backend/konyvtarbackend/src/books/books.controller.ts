import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('api/books') // a feladat API/books végpontot érne el, ezért itt a dekorátorban kell megadni
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // POST /api/books
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto); //meghívja a booksService create metódusát
  }

  // GET /api/books
  @Get()
  findAll() {
    return this.booksService.findAll(); //meghívja a booksService findAll metódusát
  }
  // POST /api/books/{id}/rent
  @Post(":id/rent")
    rentBook(@Param("id") id: string) {
      return this.booksService.rentBook(+id); //meghívja a booksService rentBook metódusát
    }
  }

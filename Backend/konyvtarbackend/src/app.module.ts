import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import {BooksService} from "./books/books.service";
import {PrismaService} from "./prisma.service";

@Module({
  imports: [BooksModule],
  controllers: [AppController],
  providers: [AppService, BooksService, PrismaService],
})
export class AppModule {}

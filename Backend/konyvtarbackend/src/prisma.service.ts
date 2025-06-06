// dokumentációban megtalálható kód
// https://docs.nestjs.com/recipes/prisma#use-prisma-client-in-your-nestjs-services
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
}
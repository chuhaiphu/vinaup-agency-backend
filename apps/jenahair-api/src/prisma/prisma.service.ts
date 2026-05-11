import { Inject, Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(
    @Inject('DATABASE')
    databaseAdapter: InstanceType<typeof PrismaPg>,
  ) {
    super({ adapter: databaseAdapter });
  }
}

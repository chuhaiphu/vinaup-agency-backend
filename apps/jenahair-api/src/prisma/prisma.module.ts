import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import databaseConfig from '../_core/configs/database.config';
import { PrismaService } from './prisma.service';
import { PrismaPg } from '@prisma/adapter-pg';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [
    PrismaService,
    {
      provide: 'DATABASE',
      useFactory: (databaseConf: ConfigType<typeof databaseConfig>) => {
        const adapter = new PrismaPg({
          connectionString: databaseConf.url,
        });
        return adapter;
      },
      inject: [databaseConfig.KEY],
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}

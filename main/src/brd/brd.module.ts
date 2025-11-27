import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrdController } from './brd.controller';
import { BrdService } from './brd.service';
import { BrdEntity } from './entity/brd.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrdEntity])], // BrdEntity의 Repository 등록
  controllers: [BrdController],
  providers: [BrdService],
  exports: [BrdService], // 다른 모듈에서 쓸 수도 있게 export 해둠 (선택)
})
export class BrdModule {}

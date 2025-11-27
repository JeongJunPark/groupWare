import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrdEntity } from './entity/brd.entity';
import { CrtBrdDto } from './dto/brdCrt.dto';

@Injectable()
export class BrdService {
  constructor(
    @InjectRepository(BrdEntity)
    private readonly brdRepository: Repository<BrdEntity>,
  ) {}

  async slctBrd(): Promise<BrdEntity[]> {
    return this.brdRepository.find();
  }

  async crtBrd(dto: CrtBrdDto): Promise<BrdEntity> {
    const brd = this.brdRepository.create(dto);
    return await this.brdRepository.save(brd);
  }
}

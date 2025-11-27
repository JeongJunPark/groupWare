
import { Controller, Get, Post, Body, Param, Delete, Query, Session, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { BrdService } from './brd.service';
import { BrdEntity } from './entity/brd.entity';
import { CrtBrdDto } from './dto/brdCrt.dto';

@Controller('brd')
export class BrdController {
  constructor(
    private brdService: BrdService
  )
   {}


    @Get('/slct')
    async slctBrd(): Promise<BrdEntity[]> {
        return await this.brdService.slctBrd();
    }

    @Post('/crt')
    async crtBrd(@Body() dto: CrtBrdDto): Promise<BrdEntity> {
    return this.brdService.crtBrd(dto);
    }
}
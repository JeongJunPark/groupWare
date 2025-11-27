import { IsString, MaxLength } from 'class-validator';

export class CrtBrdDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  userid: string;  

  @IsString()
  content: string;

  @IsString()
  @MaxLength(100)
  author: string;
}

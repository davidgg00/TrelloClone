import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { IsBoolean, IsString, Length } from 'class-validator';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  @IsString()
  @Length(3, 255)
  title: string;

  @IsBoolean()
  is_public: boolean;
}

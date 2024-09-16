import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateListDto extends PartialType(CreateListDto) {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  position: number;

  @IsNumber()
  boardId: number;
}

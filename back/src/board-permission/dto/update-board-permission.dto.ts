import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardPermissionDto } from './create-board-permission.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateBoardPermissionDto extends PartialType(
  CreateBoardPermissionDto,
) {
  @IsEnum(['read', 'write'], {
    message: 'Permission must be either read or write',
  })
  permission: 'read' | 'write';
}

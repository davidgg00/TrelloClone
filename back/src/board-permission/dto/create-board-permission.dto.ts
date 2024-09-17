import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class CreateBoardPermissionDto {
  @IsInt()
  @IsNotEmpty()
  boardId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsEnum(['read', 'write'], {
    message: 'Permission must be either read or write',
  })
  @IsNotEmpty()
  permission: 'read' | 'write';
}

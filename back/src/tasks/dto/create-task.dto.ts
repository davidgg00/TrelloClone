import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  position?: number;

  @IsNotEmpty()
  @IsInt()
  listId: number;

  @IsOptional()
  @IsInt()
  assignedUserId?: number;
}

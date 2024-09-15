import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @Length(3, 255)
  title: string;

  @IsBoolean()
  is_public: boolean;
}

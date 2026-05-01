import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFichaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  numero!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  programaFormacion!: string;
}

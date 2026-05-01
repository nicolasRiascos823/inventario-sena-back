import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateFichaDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  numero?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  programaFormacion?: string;
}

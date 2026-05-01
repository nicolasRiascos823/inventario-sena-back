import { IsInt, Max, Min } from 'class-validator';

export class UpdateBaseInventoryDto {
  @IsInt()
  @Min(0)
  @Max(10000)
  laptops!: number;

  @IsInt()
  @Min(0)
  @Max(10000)
  mouses!: number;

  @IsInt()
  @Min(0)
  @Max(10000)
  chargers!: number;

  @IsInt()
  @Min(0)
  @Max(10000)
  tables!: number;

  @IsInt()
  @Min(0)
  @Max(10000)
  chairs!: number;
}

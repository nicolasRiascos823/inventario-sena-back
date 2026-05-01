import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PartialReportCountsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000)
  laptops?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000)
  mouses?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000)
  chargers?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000)
  tables?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000)
  chairs?: number;
}

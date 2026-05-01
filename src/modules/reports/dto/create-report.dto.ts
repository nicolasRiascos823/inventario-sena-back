import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ReportType } from '../../../domain/enums/report-type.enum';

export class ReportCountsDto {
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

export class CreateReportDto {
  @IsEnum(ReportType)
  type!: ReportType;

  @IsUUID()
  classroomId!: string;

  @IsUUID()
  fichaId!: string;

  /** Obligatorio si el usuario es administrador (registro en nombre de un instructor). */
  @IsOptional()
  @IsUUID()
  instructorId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  observacion?: string;

  @ValidateNested()
  @Type(() => ReportCountsDto)
  counts!: ReportCountsDto;
}

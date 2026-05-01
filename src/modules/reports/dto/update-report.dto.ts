import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ReportType } from '../../../domain/enums/report-type.enum';
import { PartialReportCountsDto } from './partial-report-counts.dto';

export class UpdateReportDto {
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @IsOptional()
  @IsUUID()
  instructorId?: string;

  @IsOptional()
  @IsUUID()
  fichaId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  observacion?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartialReportCountsDto)
  counts?: PartialReportCountsDto;
}

import { ReportType } from '../enums/report-type.enum';
import { InventoryCounts } from '../value-objects/inventory-counts.vo';
import { ReportModel } from '../models/report.model';

export interface ReportFilters {
  from?: Date;
  to?: Date;
  instructorId?: string;
  classroomId?: string;
  fichaId?: string;
}

export interface ReportRepositoryPort {
  create(data: {
    type: ReportType;
    instructorId: string;
    classroomId: string;
    fichaId: string;
    counts: InventoryCounts;
    observacion?: string | null;
  }): Promise<ReportModel>;
  findById(id: string): Promise<ReportModel | null>;
  findMany(
    filters: ReportFilters,
    scopeInstructorId?: string,
  ): Promise<ReportModel[]>;
  update(
    id: string,
    data: Partial<{
      type: ReportType;
      counts: InventoryCounts;
      instructorId: string;
      fichaId: string;
      observacion: string | null;
    }>,
  ): Promise<ReportModel | null>;
  remove(id: string): Promise<void>;
}

export const REPORT_REPOSITORY = Symbol('REPORT_REPOSITORY');

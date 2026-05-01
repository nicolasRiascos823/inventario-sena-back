import { ReportType } from '../enums/report-type.enum';
import { InventoryCounts } from '../value-objects/inventory-counts.vo';

export interface ReportModel {
  id: string;
  type: ReportType;
  instructorId: string;
  instructorName: string;
  classroomId: string;
  classroomName: string;
  classroomCode: string;
  fichaId: string;
  fichaNumero: string;
  programaFormacion: string;
  counts: InventoryCounts;
  observacion: string;
  reportedAt: Date;
  updatedAt: Date;
}

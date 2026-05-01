import { ReportType } from '../../../domain/enums/report-type.enum';
import { ReportModel } from '../../../domain/models/report.model';
import { ReportEntity } from '../entities/report.entity';

export function mapReportEntityToModel(entity: ReportEntity): ReportModel {
  return {
    id: entity.id,
    type: entity.type as ReportType,
    instructorId: entity.instructorId,
    instructorName: `${entity.instructor.firstName} ${entity.instructor.lastName}`,
    classroomId: entity.classroomId,
    classroomName: entity.classroom.name,
    classroomCode: entity.classroom.code,
    fichaId: entity.fichaId,
    fichaNumero: entity.ficha.numero,
    programaFormacion: entity.ficha.programaFormacion,
    counts: {
      laptops: entity.laptops,
      mouses: entity.mouses,
      chargers: entity.chargers,
      tables: entity.tables,
      chairs: entity.chairs,
    },
    observacion: entity.observacion?.trim() ?? '',
    reportedAt: entity.reportedAt,
    updatedAt: entity.updatedAt,
  };
}

import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compareInventoryToBase } from '../../application/inventory/inventory-comparison';
import { AuthUser } from '../../common/interfaces/auth-user.interface';
import { RoleCode } from '../../domain/enums/role-code.enum';
import { ReportModel } from '../../domain/models/report.model';
import {
  CLASSROOM_REPOSITORY,
  ClassroomRepositoryPort,
} from '../../domain/ports/classroom.repository.port';
import {
  FICHA_REPOSITORY,
  FichaRepositoryPort,
} from '../../domain/ports/ficha.repository.port';
import {
  REPORT_REPOSITORY,
  ReportFilters,
  ReportRepositoryPort,
} from '../../domain/ports/report.repository.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../domain/ports/user.repository.port';
import { ReportType } from '../../domain/enums/report-type.enum';
import { CreateReportDto } from './dto/create-report.dto';
import { FilterReportsQueryDto } from './dto/filter-reports.query.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reports: ReportRepositoryPort,
    @Inject(CLASSROOM_REPOSITORY)
    private readonly classrooms: ClassroomRepositoryPort,
    @Inject(FICHA_REPOSITORY)
    private readonly fichas: FichaRepositoryPort,
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

  async create(user: AuthUser, dto: CreateReportDto): Promise<ReportModel> {
    const room = await this.classrooms.findById(dto.classroomId);
    if (!room) {
      throw new NotFoundException('Salón no encontrado');
    }
    const ficha = await this.fichas.findById(dto.fichaId);
    if (!ficha) {
      throw new NotFoundException('Ficha no encontrada');
    }

    let instructorId = user.userId;
    if (user.roleCode === RoleCode.ADMIN) {
      if (!dto.instructorId) {
        throw new BadRequestException(
          'El administrador debe indicar el instructor del reporte',
        );
      }
      const instr = await this.users.findById(dto.instructorId);
      if (!instr || instr.roleCode !== RoleCode.INSTRUCTOR) {
        throw new BadRequestException('Instructor no válido o no es instructor');
      }
      instructorId = dto.instructorId;
    }

    return this.reports.create({
      type: dto.type,
      instructorId,
      classroomId: dto.classroomId,
      fichaId: dto.fichaId,
      counts: dto.counts,
      observacion: dto.observacion,
    });
  }

  async list(
    _user: AuthUser,
    query: FilterReportsQueryDto,
  ): Promise<ReportModel[]> {
    const filters: ReportFilters = {
      classroomId: query.classroomId,
      fichaId: query.fichaId,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
      instructorId: query.instructorId,
    };
    return this.reports.findMany(filters, undefined);
  }

  async getOne(id: string): Promise<ReportModel> {
    const report = await this.reports.findById(id);
    if (!report) {
      throw new NotFoundException('Reporte no encontrado');
    }
    return report;
  }

  async update(user: AuthUser, id: string, dto: UpdateReportDto) {
    if (user.roleCode !== RoleCode.ADMIN) {
      throw new ForbiddenException();
    }
    const existing = await this.reports.findById(id);
    if (!existing) {
      throw new NotFoundException('Reporte no encontrado');
    }
    const counts = dto.counts
      ? { ...existing.counts, ...dto.counts }
      : existing.counts;

    let instructorId = existing.instructorId;
    if (dto.instructorId !== undefined) {
      const instr = await this.users.findById(dto.instructorId);
      if (!instr || instr.roleCode !== RoleCode.INSTRUCTOR) {
        throw new BadRequestException('Instructor no válido o no es instructor');
      }
      instructorId = dto.instructorId;
    }

    let fichaId = existing.fichaId;
    if (dto.fichaId !== undefined) {
      const ficha = await this.fichas.findById(dto.fichaId);
      if (!ficha) {
        throw new NotFoundException('Ficha no encontrada');
      }
      fichaId = dto.fichaId;
    }

    return this.reports.update(id, {
      type: dto.type ?? (existing.type as ReportType),
      counts,
      instructorId,
      fichaId,
      ...(dto.observacion !== undefined
        ? {
            observacion: dto.observacion.trim()
              ? dto.observacion.trim()
              : null,
          }
        : {}),
    });
  }

  async compare(_user: AuthUser, id: string) {
    const report = await this.getOne(id);
    const room = await this.classrooms.findById(report.classroomId);
    if (!room) {
      throw new NotFoundException('Salón no encontrado');
    }
    const comparison = compareInventoryToBase(
      room.baseInventory,
      report.counts,
    );
    return {
      report,
      baseInventory: room.baseInventory,
      comparison,
    };
  }

}

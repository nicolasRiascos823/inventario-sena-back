import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportType } from '../../../domain/enums/report-type.enum';
import { ReportModel } from '../../../domain/models/report.model';
import { InventoryCounts } from '../../../domain/value-objects/inventory-counts.vo';
import {
  REPORT_REPOSITORY,
  ReportFilters,
  ReportRepositoryPort,
} from '../../../domain/ports/report.repository.port';
import { ReportEntity } from '../entities/report.entity';
import { mapReportEntityToModel } from '../mappers/report.mapper';

@Injectable()
export class ReportTypeOrmRepository implements ReportRepositoryPort {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly repo: Repository<ReportEntity>,
  ) {}

  async create(data: {
    type: ReportType;
    instructorId: string;
    classroomId: string;
    fichaId: string;
    counts: InventoryCounts;
    observacion?: string | null;
  }): Promise<ReportModel> {
    const obs =
      data.observacion === undefined || data.observacion === null
        ? null
        : String(data.observacion).trim() || null;
    const entity = this.repo.create({
      type: data.type,
      instructorId: data.instructorId,
      classroomId: data.classroomId,
      fichaId: data.fichaId,
      observacion: obs,
      laptops: data.counts.laptops,
      mouses: data.counts.mouses,
      chargers: data.counts.chargers,
      tables: data.counts.tables,
      chairs: data.counts.chairs,
    });
    const saved = await this.repo.save(entity);
    const full = await this.repo.findOneOrFail({
      where: { id: saved.id },
      relations: { instructor: { role: true }, classroom: true, ficha: true },
    });
    return mapReportEntityToModel(full);
  }

  async findById(id: string): Promise<ReportModel | null> {
    const row = await this.repo.findOne({
      where: { id },
      relations: { instructor: { role: true }, classroom: true, ficha: true },
    });
    return row ? mapReportEntityToModel(row) : null;
  }

  async findMany(
    filters: ReportFilters,
    scopeInstructorId?: string,
  ): Promise<ReportModel[]> {
    const qb = this.repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.instructor', 'i')
      .leftJoinAndSelect('i.role', 'role')
      .leftJoinAndSelect('r.classroom', 'c')
      .leftJoinAndSelect('r.ficha', 'f')
      .orderBy('r.reportedAt', 'DESC');

    if (scopeInstructorId) {
      qb.andWhere('r.instructorId = :iid', { iid: scopeInstructorId });
    }
    if (filters.instructorId) {
      qb.andWhere('r.instructorId = :fid', { fid: filters.instructorId });
    }
    if (filters.classroomId) {
      qb.andWhere('r.classroomId = :cid', { cid: filters.classroomId });
    }
    if (filters.fichaId) {
      qb.andWhere('r.fichaId = :fid2', { fid2: filters.fichaId });
    }
    if (filters.from && filters.to) {
      qb.andWhere('r.reportedAt BETWEEN :from AND :to', {
        from: filters.from,
        to: filters.to,
      });
    } else if (filters.from) {
      qb.andWhere('r.reportedAt >= :from', { from: filters.from });
    } else if (filters.to) {
      qb.andWhere('r.reportedAt <= :to', { to: filters.to });
    }

    const rows = await qb.getMany();
    return rows.map(mapReportEntityToModel);
  }

  async update(
    id: string,
    data: Partial<{
      type: ReportType;
      counts: InventoryCounts;
      instructorId: string;
      fichaId: string;
      observacion: string | null;
    }>,
  ): Promise<ReportModel | null> {
    const patch: Partial<ReportEntity> = {};
    if (data.type !== undefined) patch.type = data.type;
    if (data.instructorId !== undefined) patch.instructorId = data.instructorId;
    if (data.fichaId !== undefined) patch.fichaId = data.fichaId;
    if (data.observacion !== undefined) {
      patch.observacion =
        data.observacion === null
          ? null
          : String(data.observacion).trim() || null;
    }
    if (data.counts) {
      patch.laptops = data.counts.laptops;
      patch.mouses = data.counts.mouses;
      patch.chargers = data.counts.chargers;
      patch.tables = data.counts.tables;
      patch.chairs = data.counts.chairs;
    }
    if (Object.keys(patch).length) {
      await this.repo.update({ id }, patch);
    }
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}

export const reportRepositoryProvider = {
  provide: REPORT_REPOSITORY,
  useClass: ReportTypeOrmRepository,
};

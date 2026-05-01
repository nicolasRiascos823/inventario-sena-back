import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassroomModel } from '../../../domain/models/classroom.model';
import { InventoryCounts } from '../../../domain/value-objects/inventory-counts.vo';
import {
  CLASSROOM_REPOSITORY,
  ClassroomRepositoryPort,
} from '../../../domain/ports/classroom.repository.port';
import { ClassroomInventoryEntity } from '../entities/classroom-inventory.entity';
import { ClassroomEntity } from '../entities/classroom.entity';
import { mapClassroomEntityToModel } from '../mappers/classroom.mapper';

@Injectable()
export class ClassroomTypeOrmRepository implements ClassroomRepositoryPort {
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classrooms: Repository<ClassroomEntity>,
    @InjectRepository(ClassroomInventoryEntity)
    private readonly inventories: Repository<ClassroomInventoryEntity>,
  ) {}

  async findAll(): Promise<ClassroomModel[]> {
    const rows = await this.classrooms.find({
      relations: { inventory: true },
      order: { name: 'ASC' },
    });
    return rows.map(mapClassroomEntityToModel);
  }

  async findById(id: string): Promise<ClassroomModel | null> {
    const row = await this.classrooms.findOne({
      where: { id },
      relations: { inventory: true },
    });
    return row ? mapClassroomEntityToModel(row) : null;
  }

  async findByCode(code: string): Promise<ClassroomModel | null> {
    const row = await this.classrooms.findOne({
      where: { code },
      relations: { inventory: true },
    });
    return row ? mapClassroomEntityToModel(row) : null;
  }

  async create(data: {
    code: string;
    name: string;
    location?: string | null;
    initialInventory?: InventoryCounts;
  }): Promise<ClassroomModel> {
    const inv = data.initialInventory ?? {
      laptops: 0,
      mouses: 0,
      chargers: 0,
      tables: 0,
      chairs: 0,
    };
    const classroom = this.classrooms.create({
      code: data.code.trim().toUpperCase(),
      name: data.name,
      location: data.location ?? null,
    });
    const savedRoom = await this.classrooms.save(classroom);
    const inventory = this.inventories.create({
      classroomId: savedRoom.id,
      laptops: inv.laptops,
      mouses: inv.mouses,
      chargers: inv.chargers,
      tables: inv.tables,
      chairs: inv.chairs,
    });
    await this.inventories.save(inventory);
    return (await this.findById(savedRoom.id)) as ClassroomModel;
  }

  async update(
    id: string,
    data: Partial<{ name: string; location: string | null }>,
  ): Promise<ClassroomModel | null> {
    const patch = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    ) as Partial<{ name: string; location: string | null }>;
    if (Object.keys(patch).length) {
      await this.classrooms.update({ id }, patch);
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.classrooms.delete({ id });
    return (res.affected ?? 0) > 0;
  }

  async updateBaseInventory(
    classroomId: string,
    counts: InventoryCounts,
  ): Promise<ClassroomModel | null> {
    await this.inventories.update(
      { classroomId },
      {
        laptops: counts.laptops,
        mouses: counts.mouses,
        chargers: counts.chargers,
        tables: counts.tables,
        chairs: counts.chairs,
      },
    );
    return this.findById(classroomId);
  }
}

export const classroomRepositoryProvider = {
  provide: CLASSROOM_REPOSITORY,
  useClass: ClassroomTypeOrmRepository,
};

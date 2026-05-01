import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClassroomModel } from '../../domain/models/classroom.model';
import {
  CLASSROOM_REPOSITORY,
  ClassroomRepositoryPort,
} from '../../domain/ports/classroom.repository.port';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(
    @Inject(CLASSROOM_REPOSITORY)
    private readonly classrooms: ClassroomRepositoryPort,
  ) {}

  list(): Promise<ClassroomModel[]> {
    return this.classrooms.findAll();
  }

  async getOne(id: string): Promise<ClassroomModel> {
    const room = await this.classrooms.findById(id);
    if (!room) {
      throw new NotFoundException('Salón no encontrado');
    }
    return room;
  }

  async create(dto: CreateClassroomDto): Promise<ClassroomModel> {
    const code = dto.code.trim().toUpperCase();
    if (await this.classrooms.findByCode(code)) {
      throw new ConflictException('Ya existe un salón con ese código');
    }
    return this.classrooms.create({
      code,
      name: dto.name,
      location: dto.location ?? null,
    });
  }

  async update(id: string, dto: UpdateClassroomDto): Promise<ClassroomModel> {
    const updated = await this.classrooms.update(id, {
      name: dto.name,
      location: dto.location,
    });
    if (!updated) {
      throw new NotFoundException('Salón no encontrado');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const ok = await this.classrooms.delete(id);
    if (!ok) {
      throw new NotFoundException('Salón no encontrado');
    }
  }
}

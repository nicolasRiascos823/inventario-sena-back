import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClassroomModel } from '../../domain/models/classroom.model';
import {
  CLASSROOM_REPOSITORY,
  ClassroomRepositoryPort,
} from '../../domain/ports/classroom.repository.port';
import { UpdateBaseInventoryDto } from './dto/update-base-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(CLASSROOM_REPOSITORY)
    private readonly classrooms: ClassroomRepositoryPort,
  ) {}

  async getBaseForClassroom(classroomId: string): Promise<ClassroomModel> {
    const room = await this.classrooms.findById(classroomId);
    if (!room) {
      throw new NotFoundException('Salón no encontrado');
    }
    return room;
  }

  async updateBase(
    classroomId: string,
    dto: UpdateBaseInventoryDto,
  ): Promise<ClassroomModel> {
    const updated = await this.classrooms.updateBaseInventory(classroomId, {
      laptops: dto.laptops,
      mouses: dto.mouses,
      chargers: dto.chargers,
      tables: dto.tables,
      chairs: dto.chairs,
    });
    if (!updated) {
      throw new NotFoundException('Salón no encontrado');
    }
    return updated;
  }
}

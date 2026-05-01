import { Module } from '@nestjs/common';
import { ClassroomsModule } from '../classrooms/classrooms.module';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [ClassroomsModule],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}

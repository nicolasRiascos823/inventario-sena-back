import { Body, Controller, Get, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../domain/enums/role-code.enum';
import { UpdateBaseInventoryDto } from './dto/update-base-inventory.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get('classrooms/:classroomId')
  getBase(@Param('classroomId', ParseUUIDPipe) classroomId: string) {
    return this.inventory.getBaseForClassroom(classroomId);
  }

  @Roles(RoleCode.ADMIN)
  @Put('classrooms/:classroomId')
  updateBase(
    @Param('classroomId', ParseUUIDPipe) classroomId: string,
    @Body() dto: UpdateBaseInventoryDto,
  ) {
    return this.inventory.updateBase(classroomId, dto);
  }
}

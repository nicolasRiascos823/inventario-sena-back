import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../domain/enums/role-code.enum';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';
import { FichasService } from './fichas.service';

@Controller('fichas')
export class FichasController {
  constructor(private readonly fichas: FichasService) {}

  @Get()
  list() {
    return this.fichas.list();
  }

  @Roles(RoleCode.ADMIN)
  @Post()
  create(@Body() dto: CreateFichaDto) {
    return this.fichas.create(dto);
  }

  @Roles(RoleCode.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFichaDto,
  ) {
    return this.fichas.update(id, dto);
  }

  @Roles(RoleCode.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.fichas.remove(id);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/interfaces/auth-user.interface';
import { RoleCode } from '../../domain/enums/role-code.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEnabledDto } from './dto/update-user-enabled.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.users.getProfile(user.userId);
  }

  @Roles(RoleCode.ADMIN, RoleCode.INSTRUCTOR)
  @Get('instructors')
  listInstructors() {
    return this.users.listInstructors();
  }

  @Roles(RoleCode.ADMIN)
  @Get()
  list() {
    return this.users.list();
  }

  @Roles(RoleCode.ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.users.createInstructor(dto);
  }

  @Roles(RoleCode.ADMIN)
  @Patch(':id/enabled')
  setEnabled(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserEnabledDto,
  ) {
    return this.users.setEnabled(user.userId, id, dto);
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/interfaces/auth-user.interface';
import { RoleCode } from '../../domain/enums/role-code.enum';
import { CreateUserDto } from './dto/create-user.dto';
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
}

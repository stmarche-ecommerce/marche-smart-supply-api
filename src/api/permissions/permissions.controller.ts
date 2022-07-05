import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permissions users')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto[]) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Post('assign/:id')
  assignToUser(@Param('id') userId: string, @Body() permissions: string[]) {
    return this.permissionsService.assignPermissionToUser(userId, permissions);
  }

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}

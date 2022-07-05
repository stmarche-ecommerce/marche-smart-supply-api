import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Users')
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 201, type: CreateUserDto })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @Permissions('create_users')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiResponse({ status: 200, type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Permissions('update_users')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiQuery({
    name: 'limit',
    example: '10',
    description: 'Number of records per page',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    example: '1',
    description: 'Number of page',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    example: 'Leonardo',
    description: 'search query',
    required: false,
  })
  @ApiResponse({ status: 200, type: [CreateUserDto] })
  @Permissions('list_users')
  @Get()
  findAll(@Query() query, @Res() response: Response) {
    const { limit, page, search } = query;

    return this.usersService.findAll({
      response,
      search,
      resultsPerPage: limit,
      currentPageNumber: page,
    });
  }

  @ApiResponse({ status: 200, type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Permissions('view_users')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiResponse({ status: 404, description: 'User not found' })
  @Permissions('delete_users')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}

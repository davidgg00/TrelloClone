import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BoardPermissionService } from './board-permission.service';
import { CreateBoardPermissionDto } from './dto/create-board-permission.dto';
import { UpdateBoardPermissionDto } from './dto/update-board-permission.dto';
import { JwtAuthGuard } from 'src/users/jwt-auth/jwt-auth.guard';

@Controller('board-permission')
export class BoardPermissionController {
  constructor(
    private readonly boardPermissionService: BoardPermissionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBoardPermissionDto: CreateBoardPermissionDto) {
    return this.boardPermissionService.create(createBoardPermissionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.boardPermissionService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardPermissionService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('board/:boardId')
  async findByBoardId(@Param('boardId') boardId: string) {
    const id = parseInt(boardId, 10); // Convertir el parámetro a número
    return await this.boardPermissionService.findByBoardId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBoardPermissionDto: UpdateBoardPermissionDto,
  ) {
    return this.boardPermissionService.update(+id, updateBoardPermissionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardPermissionService.remove(+id);
  }
}

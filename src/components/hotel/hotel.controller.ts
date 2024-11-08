import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { Hotel } from 'src/common/entities/hotel.entity';
import { Auth } from '../auth/decorators';

@ApiTags('Hotel')
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Crea un nuevo hotel' })
  @ApiBody({ type: CreateHotelDto })
  @ApiResponse({
    status: 201,
    description: 'Hotel creado!',
    type: Hotel,
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Requiere rol super' })
  create(@Body() input: CreateHotelDto) {
    return this.hotelService.create(input);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Obtener una lista de todos los hoteles' })
  @ApiResponse({ status: 200, description: 'Lista de hoteles', type: [Hotel] })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.hotelService.findAll();
  }

  @Get(':name')
  @Auth()
  @ApiOperation({ summary: 'Obtiener un hotel por su nombre' })
  @ApiParam({
    name: 'name',
    description: 'El nombre del hotel',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'El hotel solicitado', type: Hotel })
  @ApiResponse({ status: 404, description: 'Hotel no encontrado' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findOne(@Param('name') name: string) {
    return this.hotelService.findOne(name);
  }

  @Patch(':id')
  @Auth(ValidRoles.super)
  @ApiOperation({ summary: 'Actualizar un hotel por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del hotel a actualizar',
    type: String,
  })
  @ApiBody({ type: UpdateHotelDto })
  @ApiResponse({
    status: 200,
    description: 'Hotel actualizado correctamente',
    type: Hotel,
  })
  @ApiResponse({ status: 404, description: 'No se encontró un hotel' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Param('id') id: string, @Body() input: UpdateHotelDto) {
    return this.hotelService.update(+id, input);
  }

  @Delete(':id')
  @Auth(ValidRoles.super)
  @ApiOperation({ summary: 'Borrar un hotel por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del hotel a eliminar',
    type: String,
  })
  @ApiResponse({ status: 204, description: 'Hotel eliminado con éxito' })
  @ApiResponse({ status: 404, description: 'No se encontró un hotel' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.hotelService.remove(+id);
  }
}

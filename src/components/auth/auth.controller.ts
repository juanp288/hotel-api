import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Cargar usuario de prueba' })
  @ApiResponse({
    status: 200,
    description: 'Usuarios de prueba cargados correctamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al cargar usuarios de prueba',
  })
  @Get('/migrate')
  migrate() {
    return this.authService.migrate();
  }

  @ApiOperation({ summary: 'Inicio de Sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
  })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

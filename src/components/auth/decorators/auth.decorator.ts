import { ApiBearerAuth } from '@nestjs/swagger';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './role-protected.decorator';
import { ValidRoles } from '../interfaces/valid-roles.interface';
import { UserRoleGuard } from '../guards/user-role.guard';

/**
 * TODO: Validar el acceso por roles a los servicios
 * @param roles
 * @returns
 */
export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    ApiBearerAuth(),
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}

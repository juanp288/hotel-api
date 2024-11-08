import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      ctx.getHandler(),
    );
    const request = ctx.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException(
        'Token de autorización no encontrado o inválido',
      );
    }
    const token = authHeader.split(' ')[1];

    let payload: any;
    try {
      payload = jwt.verify(token, 'secret_defult_key');
    } catch (error) {
      throw new BadRequestException('Token inválido');
    }

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    if (!payload.user) throw new BadRequestException('User not found (Guard)');
    if (validRoles.includes(payload.user.role)) return true;

    throw new ForbiddenException(
      `${payload.user.username}, necesitas más permisos para realizar esta acción`,
    );
  }
}

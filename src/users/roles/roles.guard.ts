import { CanActivate, Dependencies, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
@Dependencies(Reflector)
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext) {

        const requiredRoles = this.reflector
            .getAllAndOverride(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);

        if (!requiredRoles) {
            return true;
        }
        
        const request = context.switchToHttp().getRequest();
        const user = request.decodedData.roles;

        return requiredRoles.some((role) => user.includes(role));
    }
}
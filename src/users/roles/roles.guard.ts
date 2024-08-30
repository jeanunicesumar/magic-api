import { Injectable, Dependencies, CanActivate, ExecutionContext } from '@nestjs/common';
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

        console.log(request)


        const user = request.decodedData.roles;

        console.log(user);

        return requiredRoles.some((role) => user.includes(role));
    }
}
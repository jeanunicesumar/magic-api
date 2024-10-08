import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
        const request = context.switchToHttp().getRequest();
        const { authorization }: any = request.headers;

        if (!authorization || authorization.trim() === '') {
            throw new UnauthorizedException('Please provide token');
        }
        
        const authToken = authorization.replace(/bearer/gim, '').trim();

    try{
        const resp = await this.authService.validateToken(authToken);
        request.decodedData = resp;
        return true;

      } catch (error) {
        console.log('auth error - ', error.message);
      }
    }

  }
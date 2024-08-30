import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtServ: JwtService,
        private readonly configService: ConfigService,
    ) {}
    
    validateToken(token: string) {

        const secret = this.configService.get<string>('SECRET_KEY');

        return this.jwtServ.verify(token, {
            secret : secret
        });
    }
}
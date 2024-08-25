import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtServ: JwtService) {}
    
    validateToken(token: string) {

       console.log(this.jwtServ.verify(token, {
            secret : '13813dhakj1238712'
        }))

        console.log(this.jwtServ.decode(token))

        return this.jwtServ.verify(token, {
            secret : 'teste'
        });
    }
}
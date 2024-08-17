import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';

@Injectable()
export class Password {

    private readonly salt: number = this.getSalt();

    constructor(private readonly configService: ConfigService) {}

    public async encrypt(password: string): Promise<string> {
        return bcrypt.hash(password, this.salt);
    }
    
    public compare(password: string, hashPassword: string): boolean {

        return bcrypt.compareSync(password, hashPassword);
    }

    private getSalt(): number {
        return parseInt(this.configService.get<string>('SALT_ROUNDS'));
    }

}
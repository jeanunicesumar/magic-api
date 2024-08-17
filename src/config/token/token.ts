import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Payload } from "./payload";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class Token {

    constructor(private readonly jwtService: JwtService) {}

    public async generate(user: User): Promise<String> {

        const payload: Payload = this.buildPayload(user);

        return this.jwtService.sign(payload);
    }

    private buildPayload(user: User): Payload {

        return {
            username: user.username,
            role: user.role
        }
    }

}
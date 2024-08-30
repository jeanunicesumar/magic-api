import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "../roles/role";

export class CreateUserDto {  

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(Role, { each: true })
    roles: Role[];
    
}
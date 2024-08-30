import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "../roles/role";

export class UpdateUserDto {  

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
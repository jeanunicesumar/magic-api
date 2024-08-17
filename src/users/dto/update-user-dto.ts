import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "../roles/role";

export class UpdateUserDto {  

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    role: Role;
    
}
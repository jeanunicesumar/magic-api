import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "../roles/role";
import { Deck } from "src/decks/entities/deck.entity";

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
    
    decks: Deck[]
}
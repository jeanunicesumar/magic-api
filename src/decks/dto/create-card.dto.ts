import { IsNotEmpty } from "class-validator";

export class CreateCardDto {

    @IsNotEmpty()
    name: string;

    manaCost: string;

    cmc: string;

    @IsNotEmpty()
    colors: string[];

    @IsNotEmpty()
    type: string;

    supertypes: string[];

    types: string[];

    subtypes: string[];

    rarity: string;

    set: string;

    text: string; 

    multiverseid: number;

    imageUrl: string;
    
}
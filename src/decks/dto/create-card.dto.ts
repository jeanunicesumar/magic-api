import { IsNotEmpty } from "class-validator";

export class CreateCardDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    names: string[];

    manaCost: string;

    cmc: string;

    @IsNotEmpty()
    colors: string[];

    @IsNotEmpty()
    colorIdentity: string[];

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
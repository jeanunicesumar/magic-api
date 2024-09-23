import { IsNotEmpty } from "class-validator";

export class ValidateCardDTO {

    @IsNotEmpty({ message: "Deck inválido, Card deve conter um name!" })
    name: string;

    manaCost: string;

    cmc: string;

    @IsNotEmpty({ message: "Deck inválido, deve conter uma ou mais colors separadas por -" })
    colors: string;

    @IsNotEmpty({ message: "Deck inválido, deve conter uma ou mais colorIdentity separadas por -" })
    colorIdentity: string;

    type: string;

    @IsNotEmpty({ message: "Deck inválido, deve conter um SuperType" })
    supertypes: string;

    types: string;

    subtypes: string;

    @IsNotEmpty({ message: "Deck inválido, deve conter uma rarity" })
    rarity: string;

    set: string;

    text: string; 

    multiverseid: number;

    imageUrl: string;

}
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { ValidateCardDTO } from "./validate-card.dto";

export class ValidateDeckDTO {

    @IsNotEmpty({ message: "Deck inválido, deve conter uma lista de cards!" })
    @Type(() => ValidateCardDTO)
    cards: ValidateCardDTO[];

    @IsNotEmpty({ message: "Deck inválido, deve conter um commander!" })
    @ValidateNested()
    @Type(() => ValidateCardDTO)
    commander: ValidateCardDTO;
}
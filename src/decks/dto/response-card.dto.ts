import { Card } from "../entities/card.entity";
import { CreateCardDto } from "./create-card.dto";

export class ResponseCardDto {
    cards: CreateCardDto[];
}
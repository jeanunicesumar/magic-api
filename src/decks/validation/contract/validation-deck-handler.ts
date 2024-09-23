import { ValidateDeckDTO } from "src/decks/dto/validate-deck.dto";

export interface ValidationDeckHandler {
    handle(deck: ValidateDeckDTO): void;
    setNext(next: ValidationDeckHandler): void;
}
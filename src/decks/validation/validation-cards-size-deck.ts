import { NotAcceptableException } from "@nestjs/common";
import { ValidateDeckDTO } from "../dto/validate-deck.dto";
import { ValidationDeckHandler } from "./contract/validation-deck-handler";

export class ValidationCardsSizeDeck implements ValidationDeckHandler {

    private readonly SIZE_CARDS: number = 99;
    private next: ValidationDeckHandler = null;

    constructor() {}

    handle(deck: ValidateDeckDTO): void {
        
        if (deck.cards.length !== this.SIZE_CARDS) {
            throw new NotAcceptableException(`Deck inválido, são necessários ${this.SIZE_CARDS} cards.`);
        }

        if (this.next) this.next.handle(deck);
    }

    setNext(next: ValidationDeckHandler): void {
        this.next = next;
    }

}
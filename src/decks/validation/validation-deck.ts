import { ValidateDeckDTO } from "../dto/validate-deck.dto";
import { ValidationDeckHandler } from "./contract/validation-deck-handler";
import { ValidationCardsColorDeck } from "./validation-cards-color-deck";
import { ValidationCardsSizeDeck } from "./validation-cards-size-deck";
import { ValidationCardsUniqueDeck } from "./validation-cards-unique-deck";
import { ValidationCommanderDeck } from "./validation-commander-deck";

export class ValidationDeck implements ValidationDeckHandler {
    
    private next: ValidationDeckHandler = null;

    handle(deck: ValidateDeckDTO): void {

        const validationCommander: ValidationDeckHandler = new ValidationCommanderDeck();
        const validationCardsColor: ValidationDeckHandler = new ValidationCardsColorDeck();
        const validationCardsSize: ValidationDeckHandler = new ValidationCardsSizeDeck();
        const validationCardsUnique: ValidationDeckHandler = new ValidationCardsUniqueDeck();

        this.setNext(validationCommander);
        validationCommander.setNext(validationCardsColor);
        validationCardsColor.setNext(validationCardsSize);
        validationCardsSize.setNext(validationCardsUnique);

        if (this.next) this.next.handle(deck);
    }

    setNext(next: ValidationDeckHandler): void {
        this.next = next;
    }

}
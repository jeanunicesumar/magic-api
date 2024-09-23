import { NotAcceptableException } from "@nestjs/common";
import { ValidateDeckDTO } from "../dto/validate-deck.dto";
import { ValidationDeckHandler } from "./contract/validation-deck-handler";

export class ValidationCardsColorDeck implements ValidationDeckHandler {

    private next: ValidationDeckHandler = null;

    handle(deck: ValidateDeckDTO): void {

        const colorCommander: string = deck.commander.colorIdentity;
        const regexColorCommander = new RegExp(`[${colorCommander.replace(/-/g, '')}]`);

        const invalidCards: String = deck.cards
            .filter(card => !regexColorCommander.test(card.colorIdentity))
            .map(card => card.name)
            .join(", ");

        if (invalidCards.length !== 0) {
            throw new NotAcceptableException(`Deck inválido, os cards ${invalidCards} precisam ter ao menos uma cor[${colorCommander}] do commander.`);
        }

        if (this.next) this.next.handle(deck);
    }

    setNext(next: ValidationDeckHandler): void {
        this.next = next;
    }

}
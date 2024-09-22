import { NotAcceptableException } from "@nestjs/common";
import { ValidateDeckDTO } from "../dto/validate-deck.dto";
import { ValidationDeckHandler } from "./contract/validation-deck-handler";

export class ValidationCardsUniqueDeck implements ValidationDeckHandler {

    private next: ValidationDeckHandler = null;

    handle(deck: ValidateDeckDTO): void {

        let rarityByName: Map<string, string> = new Map();
        const invalidNames: string[] = [];

        deck.cards.forEach(card => {

            const rarity: string = rarityByName.get(card.name);

            if (!rarityByName.has(card.name)) {
                rarityByName.set(card.name, card.rarity);
                return;  
            } 

            if (rarity === 'Basic Land' && !card.rarity?.includes("Basic Land")) invalidNames.push(card.name);
        });

        if (invalidNames.length !== 0) {
            throw new NotAcceptableException(`Deck inválido, os cards ${invalidNames.join(", ")} precisam estão repetidos e não são Basic Land.`);
        }

        if (this.next) this.next.handle(deck);
    }

    setNext(next: ValidationDeckHandler): void {
        this.next = next;
    }

}
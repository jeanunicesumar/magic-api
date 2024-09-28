import { NotAcceptableException } from "@nestjs/common";
import { ValidateDeckDTO } from "../dto/validate-deck.dto";
import { ValidationDeckHandler } from "./contract/validation-deck-handler";

export class ValidationCommanderDeck implements ValidationDeckHandler {

    private next: ValidationDeckHandler = null; 

    handle(deck: ValidateDeckDTO): void {
        
        if (!deck.commander.type?.startsWith('Legendary Creature')) {
            throw new NotAcceptableException("Deck inválido, um commander precisa ter um type de Legendary Creature.");
        }

        if (this.next) this.next.handle(deck);
    }

    setNext(next: ValidationDeckHandler): void {
        this.next = next;
    }

}
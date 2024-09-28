import { Injectable } from '@nestjs/common';
import { CardRepository } from 'src/decks/card.repository';
import { Card } from '../../decks/entities/card.entity';
import { Deck } from '../../decks/entities/deck.entity';

@Injectable()
export class DecksFactory {

    constructor(
        private readonly repository: CardRepository
    ) {}

    public async build(): Promise<Deck> {

        const commander = await this.repository.findCommanderRandom();
        const colors = commander.colorIdentity.split("-");

        const cards = await this.repository.findByColorIdentity(colors);

        return this.createDeck(cards, commander);
    }

    private createDeck(cards: Card[], commander: Card): Deck {
        const deck = new Deck();
        deck.cards = cards;
        deck.commander = commander;
        return deck;
    }
}

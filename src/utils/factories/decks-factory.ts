import { Injectable } from '@nestjs/common';
import CardAdapter from 'src/decks/adapter/card.adapter';
import { CreateCardDto } from 'src/decks/dto/create-card.dto';
import { Card } from '../../decks/entities/card.entity';
import { Deck } from '../../decks/entities/deck.entity';
import { MagicRequest } from '../request/magic.request';

@Injectable()
export class DecksFactory {

    constructor(
        private readonly magicRequest: MagicRequest,
        private readonly cardAdapter: CardAdapter
    ) {}

    public async build(): Promise<Deck> {  

        const commanderFound: CreateCardDto = await this.magicRequest.findCommander();
        const commander: Card = this.cardAdapter.createToEntity(commanderFound);

        const colorsFormatted: string = this.formatterColors(commander.colorIdentity);

        const cards: Card[] = await this.findCards(colorsFormatted, 99);
        cards.push(commander);
        
        const deck: Deck = new Deck();
        deck.cards = cards;

        return deck;
    }

    private formatterColors(colors: string[]): string {
        return colors.join("|");
    }

    private async findCards(colorsFormatted: string, size: number): Promise<Card[]> {

        const cardByMultiverseid: Map<number, Card> = new Map<number, Card>();
        let quantityCards: number = 0;

        while (quantityCards < size) {
            
            const cards: Card[] = (await this.magicRequest.findCardsByColors(colorsFormatted))
                .map(card => this.cardAdapter.createToEntity(card));

            for(const card of cards) {

                if (card.isCommander()) continue;
                if (card.isNotBasicLand() && cardByMultiverseid.has(card.multiverseid)) continue;
                
                cardByMultiverseid.set(card.multiverseid, card);
                quantityCards++;

                if (quantityCards === size) break;
            }
        }

        return Array.from(cardByMultiverseid.values());

    }

}
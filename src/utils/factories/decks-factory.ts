import { Injectable } from '@nestjs/common';
import { MagicRequest } from '../request/magic.request';
import { Deck } from '../../decks/entities/deck.entity';
import { Card } from '../../decks/entities/card.entity';

@Injectable()
export class DecksFactory {

    constructor(private readonly magicRequest: MagicRequest) {}

    public async build(): Promise<Deck> {

        const commander: Card = await this.findCommander();
        const colorsFormatted: string = this.formatterColors(commander.colorIdentity);

        const cards: Card[] = await this.findCards(colorsFormatted, 99);
        cards.push(commander);
        
        const deck: Deck = new Deck();
        deck.cards = cards;

        return deck;
    }

    private async findCommander(): Promise<Card> {
        return this.magicRequest.findCommander();
    }

    private formatterColors(colors: string[]): string {
        return colors.join("|");
    }

    private async findCards(colorsFormatted: string, size: number): Promise<Card[]> {

        const cardByMultiverseid: Map<number, Card> = new Map<number, Card>();
        let quantityCards: number = 0;

        while (quantityCards < size) {
            
            const cards: Card[] = await this.findCardsByColors(colorsFormatted);

            for(const card of cards) {

                if (card.supertypes?.includes('Legendary')) continue;
                if (card.rarity !== 'Basic Land' && cardByMultiverseid.has(card.multiverseid)) continue;
                
                cardByMultiverseid.set(card.multiverseid, card);
                quantityCards++;

                if (quantityCards === size) break;
            }
        }

        return Array.from(cardByMultiverseid.values());

    }

    private async findCardsByColors(colors: string): Promise<Card[]> {
        return this.magicRequest.findCardsByColors(colors);
    }

}
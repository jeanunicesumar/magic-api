import { Injectable } from '@nestjs/common';
import CardAdapter from 'src/decks/adapter/card.adapter';
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

        console.time('commander');
        const commander: Card = await this.findCommander();
        console.timeEnd('commander');

        const colorsFormatted: string = this.formatterColors(commander.colorIdentity);

        console.time('cards');
        const cards: Card[] = await this.findCards(colorsFormatted, 99);
        console.timeEnd('cards');
        cards.push(commander);
        
        const deck: Deck = new Deck();
        deck.cards = cards;

        return deck;
    }

    private formatterColors(colors: string[]): string {
        return colors.join("|");
    }

    private async findCards(colorsFormatted: string, size: number): Promise<Card[]> {

        const cardByMultiverseid: Map<string, Card> = new Map<string, Card>();
        let quantityCards: number = 0;

        while (quantityCards < size) {
            
            const cards: Card[] = (await this.magicRequest.findCardsByColors(colorsFormatted))
                .map(card => this.cardAdapter.createToEntity(card));

            for(const card of cards) {

                if (card.isCommander()) continue;
                if (card.isNotBasicLand() && cardByMultiverseid.has(card.name)) continue;
                
                cardByMultiverseid.set(card.name, card);
                quantityCards++;

                if (quantityCards === size) break;
            }
        }

        return Array.from(cardByMultiverseid.values());

    }

    private async findCommander(): Promise<Card> {
        
        while(true) {

            const cards: Card[] = (await this.magicRequest.findCommander())
                .cards
                .map(card => this.cardAdapter.createToEntity(card));

            for(const card of cards) {

                if (card.isCommander() && card.colorIdentity?.length > 0) {
                    return card;
                }
                
            }
        }

    }

}
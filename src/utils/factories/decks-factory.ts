import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/config/redis/redis.service';
import CardAdapter from 'src/decks/adapter/card.adapter';
import { CreateCardDto } from 'src/decks/dto/create-card.dto';
import { Card } from '../../decks/entities/card.entity';
import { Deck } from '../../decks/entities/deck.entity';
import { MagicRequest } from '../request/magic.request';

@Injectable()
export class DecksFactory {

    constructor(
        private readonly magicRequest: MagicRequest,
        private readonly cardAdapter: CardAdapter,
        private readonly redis: RedisService
    ) {}

    public async build(cache: boolean): Promise<Deck> {

        const commander = await this.findCommander(cache);
        const colorsFormatted = this.formatColors(commander.colorIdentity);

        const cards = await this.findCards(colorsFormatted, 99, cache);
        cards.push(commander);

        return this.createDeck(cards);
    }

    private async findCommander(cache: boolean): Promise<Card> {
        
        for (let count = 0, page = 1; count < 5; count++, page++) {

            const requestUrl = this.buildRequestUrl(page, true);
            const cards: CreateCardDto[] = await this.getOrFetchCards(requestUrl, page, cache, true);
            const commander: CreateCardDto = cards.find(this.filterCommander());

            if (commander) {
                return this.cardAdapter.createToEntity(commander);
            }
        }

        throw new NotFoundException("Não foi encontrado commander para a montagem do Deck.");
    }

    private formatColors(colors: string[]): string {
        return colors.join(" ");
    }

    private async findCards(colorsFormatted: string, size: number, cache: boolean): Promise<Card[]> {

        const cardsFound = new Set<string>();
        const cards: Card[] = [];
        let quantityCards: number = 0;
        let page: number = 1;

        while (quantityCards < size) {

            const requestUrl = this.buildRequestUrl(page);
            const cardsRaw = await this.getOrFetchCards(requestUrl, page, cache, false);

            for (const card of cardsRaw) {

                if (quantityCards >= size) break;

                if (this.isValidCard(card, colorsFormatted, cardsFound)) {
                    cardsFound.add(card.name);
                    cards.push(this.cardAdapter.createToEntity(card));
                    quantityCards++;
                }
            }

            page++;
        }

        return cards;
    }

    private buildRequestUrl(page: number, isRandom: boolean = false): string {
        return `${this.magicRequest.getUrl()}?page=${page}${isRandom ? '&random=true' : ''}`;
    }

    private async getOrFetchCards(requestUrl: string, page: number, cache: boolean, isRandom: boolean): Promise<CreateCardDto[]> {

        if (cache) {
            const cachedCards = await this.redis.getValue(requestUrl);

            if (cachedCards) {
                return JSON.parse(cachedCards) as CreateCardDto[];
            }
        }
        
        const cardsRaw = await this.magicRequest.findCards(page, isRandom);
        await this.redis.setValue(requestUrl, JSON.stringify(cardsRaw));
        return cardsRaw;
        
    }

    private isValidCard(card: CreateCardDto, colorsFormatted: string, cardsFound: Set<string>): boolean {

        const isLegendary = card.supertypes?.includes('Legendary');
        const hasInvalidColor = !card.colorIdentity?.some(color => colorsFormatted.includes(color));
        const isDuplicate = card.rarity !== 'Basic Land' && cardsFound.has(card.name);

        return !isLegendary && !hasInvalidColor && !isDuplicate;
    }

    private filterCommander() {
        return (commander: CreateCardDto) => 
            commander.supertypes?.includes('Legendary') 
            && commander.colorIdentity?.length > 0;
    }

    private createDeck(cards: Card[]): Deck {
        const deck = new Deck();
        deck.cards = cards;
        return deck;
    }
}

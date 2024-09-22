import { Injectable } from "@nestjs/common";
import CardAdapter from "src/decks/adapter/card.adapter";
import { ResponseCardDto } from "src/decks/dto/response-card.dto";
import { CardRepository } from '../../decks/card.repository';
import { MagicRequest } from "../request/magic.request";

@Injectable()
export class CardFactory {

    constructor(
        private readonly repository: CardRepository,
        private readonly adapter: CardAdapter,
        private readonly request: MagicRequest
    ) {}

    public async populate(): Promise<void> {

        console.time('Tempo de população:')

        let count = 1;
        let urls: string[] = [];
        let batchSize = 25;
        let exists = true;

        while (exists) {

            const url: string = this.request.getUrlSimple(count);
            urls.push(url);

            if (urls.length !== batchSize) {
                count++;
                continue;
            }
                
            const promises = urls.map(async (url) => {
                const response: ResponseCardDto = await this.fetchData(url);
                exists = response.cards.length !== 0;
                return response.cards.map(card =>  this.adapter.createToEntity(card));
            });

            const batchResults = await Promise.all(promises);

            this.repository.createAll(batchResults.flat());
            urls = [];
            count++;
        }

        console.timeEnd('Tempo de população:')
    }

    private async fetchData(url: string): Promise<ResponseCardDto> {
        return await fetch(url).then((response) => response.json());
    }
}
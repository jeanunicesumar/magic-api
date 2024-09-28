import { Injectable } from "@nestjs/common";
import CardAdapter from "src/decks/adapter/card.adapter";
import { CreateCardDto } from "src/decks/dto/create-card.dto";
import { ReadableStream } from "stream/web";
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

        console.time('Time');
    
        const readableStream = await this.createPaginatedStream(1, 313);
        const readableStream2 = await this.createPaginatedStream(314, 627);
        const readableStream3 = await this.createPaginatedStream(628, 937);
    
        await Promise.all([
            this.consumePaginatedStream(readableStream),
            this.consumePaginatedStream(readableStream2),
            this.consumePaginatedStream(readableStream3),
        ]);
    
        console.timeEnd('Time');
    }

    private async createPaginatedStream(currentPage: number, totalPages: number): Promise<ReadableStream<any>> {

        const readableStream = new ReadableStream({
            pull: async (controller) => {
                if (currentPage > totalPages) {
                    controller.close();
                    return;
                }

                const fetchPromises = [];
                const maxConcurrentRequests = 30;

                while (fetchPromises.length < maxConcurrentRequests && currentPage <= totalPages) {
                    fetchPromises.push(this.fetchPageData(currentPage));
                    currentPage++;
                }

                try {
                    const results = await Promise.all(fetchPromises);
                    results.forEach(data => {
                        controller.enqueue(data);
                    });
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return readableStream;
    }

    private async fetchPageData(page: number, retries: number = 3): Promise<any> {
        console.log(`Buscando página: ${page}`);
        await new Promise(resolve => setTimeout(resolve, 50));
    
        const response = await fetch(this.request.getUrlSimple(page));
    
        if (!response.ok) {
            if (retries > 0) {
                console.warn(`Erro em página: ${page}`);
                return this.fetchPageData(page, retries - 1);
            }

            return null;
        }
    
        const data = await response.json();
        return data;
    }

    private async consumePaginatedStream(stream: ReadableStream<any>) {
        const reader = stream.getReader();
        let done: boolean;

        do {
            const { value, done: isDone } = await reader.read();
            done = isDone;

            if (value) {
                this.repository.createAll(value?.cards?.map((card: CreateCardDto) => this.adapter.createToEntity(card)));
            }
        } while (!done);
    }
}

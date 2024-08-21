import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateCardDto } from "src/decks/dto/create-card.dto";
import { ResponseCardDto } from "src/decks/dto/response-card.dto";

@Injectable()
export class MagicRequest {

    private readonly url: string = this.getUrl();

    constructor(private readonly configService: ConfigService) {}

    public async findCards(page: number, isRandom: boolean = false): Promise<CreateCardDto[]> {

        const response = await fetch(`${this.url}?page=${page}${isRandom ? '&random=true' : ''}`);
        const responseJson: ResponseCardDto = await response.json();

        return responseJson.cards;
    }

    public getUrl(): string {
        return this.configService.get<string>('API_URL');
    }

}
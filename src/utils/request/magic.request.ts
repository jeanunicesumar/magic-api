import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateCardDto } from "src/decks/dto/create-card.dto";
import { ResponseCardDto } from "src/decks/dto/response-card.dto";

@Injectable()
export class MagicRequest {

    private readonly url: string = this.getUrl();

    constructor(private readonly configService: ConfigService) {}

    public async findCommander(page: number): Promise<CreateCardDto[]> {

        const response = await fetch(`${this.url}?page=${page}&random=true`);
        const responseJson: ResponseCardDto = await response.json();

        return responseJson.cards;
    }

    public async findCardsByColors(page: number): Promise<CreateCardDto[]> {

        const response = await fetch(`${this.url}?page=${page}`);
        const responseJson: ResponseCardDto = await response.json();
 
        return responseJson.cards;
    }

    public getUrl(): string {
        return this.configService.get<string>('API_URL');
    }

}
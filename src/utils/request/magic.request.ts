import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateCardDto } from "src/decks/dto/create-card.dto";
import { ResponseCardDto } from "src/decks/dto/response-card.dto";

@Injectable()
export class MagicRequest {

    private readonly url: string = this.getUrl();

    constructor(private readonly configService: ConfigService) {}

    public async findCommander(): Promise<CreateCardDto> {

        const response = await fetch(`${this.url}?supertypes=Legendary&pageSize=1&random=true&colorIdentity=G|U|B|W|R`);
        const responseJson: ResponseCardDto = await response.json();

        if (responseJson.cards.length === 0) {
            throw new NotFoundException("Não foi possível encontrar um Commander!");
        }

        return responseJson.cards[0];
    }

    public async findCardsByColors(colors: string): Promise<CreateCardDto[]> {

        const response = await fetch(`${this.url}?colorIdentity=${colors}&pageSize=${100}&random=true`);
        const responseJson: ResponseCardDto = await response.json();
 
        return responseJson.cards;
    }

    private getUrl(): string {
        return this.configService.get<string>('API_URL');
    }

}
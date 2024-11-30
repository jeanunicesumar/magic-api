import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";


@Controller()
export class NotificationService {
    @EventPattern('deck_generated')
    async handleDeckGenerated(@Payload() data: any) {
        console.log('Deck gerado com sucesso', data)
    }

    @EventPattern('deck_updated')
    async handleDeckUpdated(@Payload() data: any) {
        console.log('Deck atualizado com sucesso', data)
    }
}
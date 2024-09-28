import { Injectable } from "@nestjs/common";
import Adapter from "src/utils/adapter/adapter";
import { CreateCardDto } from "../dto/create-card.dto";
import { Card } from "../entities/card.entity";

@Injectable()
export default class CardAdapter implements Adapter<Card, CreateCardDto> {

  public createToEntity(dto: CreateCardDto): Card {

    const card: Card = new Card();
    card.name = dto.name;
    card.manaCost = dto.manaCost;
    card.cmc = dto.cmc;
    card.colors = dto.colors?.join("-");
    card.colorIdentity = dto.colorIdentity?.join("-");
    card.type = dto.type;
    card.types = dto.types?.join("-");
    card.supertypes = dto.supertypes?.join("-");
    card.subtypes = dto.subtypes?.join("-");
    card.rarity = dto.rarity;
    card.set = dto.set;
    card.text = dto.text;
    card.multiverseid = dto.multiverseid;
    card.imageUrl = dto.imageUrl;
    card.isCommander = dto.type?.startsWith('Legendary Creature');

    return card;

  }

}
import { Injectable } from "@nestjs/common";
import Adapter from "src/utils/adapter/adapter";
import { CreateCardDto } from "../dto/create-card.dto";
import { Card } from "../entities/card.entity";

@Injectable()
export default class CardAdapter implements Adapter<Card, CreateCardDto> {

  public createToEntity(dto: CreateCardDto): Card {

    const card: Card = new Card();
    card.name = dto.name;
    card.names = dto.names;
    card.manaCost = dto.manaCost;
    card.cmc = dto.cmc;
    card.colors = dto.colors;
    card.colorIdentity = dto.colorIdentity;
    card.type = dto.type;
    card.types = dto.types;
    card.supertypes = dto.supertypes;
    card.subtypes = dto.subtypes;
    card.rarity = dto.rarity;
    card.set = dto.set;
    card.set = dto.set;
    card.text = dto.text;
    card.multiverseid = dto.multiverseid;
    card.imageUrl = dto.imageUrl;
    card.isCommander = dto.supertypes?.includes('Legendary');

    return card;

  }

}
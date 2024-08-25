import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import { HydratedDocument } from "mongoose";
import { Card } from "./card.entity";

export type DeckDocument = HydratedDocument<Deck>;

@Schema({ timestamps: true })
export class Deck {

    @IsNotEmpty()
    @Prop({ required: true })
    cards: Card[];

    @IsNotEmpty()
    @Prop({ required: true })
    commander: Card;

}

export const DecksSchema = SchemaFactory.createForClass(Deck);

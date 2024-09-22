import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CardDocument = HydratedDocument<Card>;

@Schema({ timestamps: true })
export class Card {

    @Prop({ required: true, default: "Jean" })
    name: string;

    @Prop()
    manaCost: string;

    @Prop()
    cmc: string;

    @Prop()
    colors: string;

    @Prop()
    colorIdentity: string;

    @Prop()
    type: string;

    @Prop()
    supertypes: string;

    @Prop()
    types: string;

    @Prop()
    subtypes: string;

    @Prop()
    rarity: string;

    @Prop()
    set: string;

    @Prop()
    text: string;

    @Prop()
    multiverseid: number;

    @Prop()
    imageUrl: string;

    @Prop({ default: false })
    isCommander: boolean;
}

export const CardsSchema = SchemaFactory.createForClass(Card);

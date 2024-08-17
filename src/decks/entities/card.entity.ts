import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import { HydratedDocument } from "mongoose";

export type CardDocument = HydratedDocument<Card>;

@Schema({ timestamps: true })
export class Card {

    @IsNotEmpty()
    @Prop({ required: true })
    name: string;

    @IsNotEmpty()
    @Prop({ required: true })
    names: string[];

    manaCost: string;

    cmc: string;

    @IsNotEmpty()
    @Prop({ required: true })
    colors: string[];

    @IsNotEmpty()
    @Prop({ required: true })
    colorIdentity: string[];

    @IsNotEmpty()
    @Prop({ required: true })
    type: string;

    supertypes: string[];

    types: string[];

    subtypes: string[];

    rarity: string;

    set: string;

    text: string; 

    multiverseid: number;

    imageUrl: string;

}

export const CardsSchema = SchemaFactory.createForClass(Card);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { HydratedDocument, Types } from "mongoose";
import { Role } from "../roles/role";
import { Deck } from './../../decks/entities/deck.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {

    _id?: Types.ObjectId;

    @IsEmail()
    @Prop({ required: true, unique: true })
    email: string;

    @IsNotEmpty()
    @Prop({ required: true, unique: true })
    username: string;

    @IsNotEmpty()
    @Prop({ required: true, unique: true })
    password: string;

    @IsEnum(Role, { each: true })
    @Prop({ type: [String], enum: Role, default: [Role.USER] })
    roles: Role[];


    @Prop({ type: [Types.ObjectId], ref: () => Deck })
    decks: Deck[];
  
}

export const UsersSchema = SchemaFactory.createForClass(User);
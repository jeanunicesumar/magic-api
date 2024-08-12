import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { HydratedDocument } from "mongoose";
import { Role } from "./roles/role";

export type CharacterDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {

    @IsEmail()
    @Prop({ required: true, unique: true })
    email: string;

    @IsNotEmpty()
    @Prop({ required: true, unique: true })
    username: string;

    @IsNotEmpty()
    @Prop({ required: true, unique: true })
    password: string;

    @IsEnum(Role)
    @Prop({ enum: Role, default: Role.USER })
    role: Role;

}

export const UserSchema = SchemaFactory.createForClass(User);
import { Types } from "mongoose";
import { Role } from "src/users/roles/role";

export interface Payload {
    sub: Types.ObjectId;
    username: string;
    roles: Role[]
}
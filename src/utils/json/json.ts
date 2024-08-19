
export class Json {

    public static toEntity(json: string) {
        return JSON.parse(json);
    }

    public static toJson(entity: any) {
        return JSON.stringify(entity, null, 2);
    }

}
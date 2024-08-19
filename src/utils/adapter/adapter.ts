export default interface Adapter<Entity, CreateDTO> {
    createToEntity(dto: CreateDTO): Entity;
}
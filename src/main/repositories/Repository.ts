export interface Repository<T> {
    query(sql: string, params?: any[]): Promise<any>;

    create(entity: T): Promise<T>;

    findById(id: number | string): Promise<T | null>;

    findAll(id: number | string): Promise<T | null>;

    update(id: number | string, entity: Partial<T>): Promise<T>;

    delete(id: number | string): Promise<boolean>;
}
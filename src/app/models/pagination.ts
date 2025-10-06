export interface Pagination<T> {
    items: T[];
    page: number;
    totalElements: number;
}
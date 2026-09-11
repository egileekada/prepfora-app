export interface Pagination {
    total: number;
    page: number;
    per_page: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination: Pagination;
}

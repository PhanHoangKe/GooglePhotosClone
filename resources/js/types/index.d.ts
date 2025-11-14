// resources/js/types/index.d.ts

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string; // Giữ nguyên
    
    // START: Thêm các cột CSDL mới
    avatar: string | null;
    storage_used: number;
    storage_limit: number;
    // END: Thêm các cột CSDL mới
}

export interface Photo {
    id: number;
    user_id: number;
    filename: string;
    original_filename: string | null;
    path: string; // Đường dẫn công khai
    thumbnail_path: string | null;
    file_type: 'image' | 'video' | 'gif';
    mime_type: string;
    file_size: number;
    width: number | null;
    height: number | null;
    duration: number | null;
    is_deleted: boolean;
    deleted_at: string | null;
    uploaded_at: string;
    created_at: string;
    updated_at: string;
}

export interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedResult<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
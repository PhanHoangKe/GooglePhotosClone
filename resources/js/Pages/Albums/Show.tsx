import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface AlbumResource {
    id: number;
    name: string;
    description: string | null;
    photos_count: number;
    created_at: string | null;
    cover_photo: {
        id: number;
        file_path: string;
    } | null;
}

interface AlbumPhoto {
    id: number;
    original_filename: string | null;
    file_path: string;
    file_size: number;
    uploaded_at: string | null;
    mime_type: string | null;
}

type AlbumShowProps = PageProps<{ album: AlbumResource; photos: AlbumPhoto[] }>;

const formatBytes = (bytes: number): string => {
    if (!bytes) return '0 KB';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${units[i]}`;
};

export default function AlbumShow() {
    const { auth, album, photos } = usePage<AlbumShowProps>().props;
    const [activePhoto, setActivePhoto] = useState<AlbumPhoto | null>(null);
    const [isModalImageLoading, setIsModalImageLoading] = useState(false);

    const handlePhotoClick = (photo: AlbumPhoto) => {
        setIsModalImageLoading(true);
        setActivePhoto(photo);
    };

    const handleModalOpenChange = (open: boolean) => {
        if (!open) {
            setActivePhoto(null);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#252525]">
                            {album.cover_photo ? (
                                <img
                                    src={album.cover_photo.file_path}
                                    alt={album.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="h-8 w-8 text-[#757575]" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.35rem] text-[#757575]">Album</p>
                            <h2 className="text-3xl font-semibold text-[#E0E0E0] md:text-4xl">{album.name}</h2>
                            <div className="flex flex-wrap gap-3 text-xs text-[#757575]">
                                <span>
                                    {album.photos_count} ảnh · Tạo{' '}
                                    {album.created_at ? format(new Date(album.created_at), 'dd/MM/yyyy') : '—'}
                                </span>
                                {album.description && <span className="max-w-xl text-[#B0B0B0]">{album.description}</span>}
                            </div>
                        </div>
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        className="rounded-lg border-[#2A2A2A] bg-[#252525] px-4 py-2 text-sm text-[#E0E0E0] hover:border-[#1E88E5]/50 hover:bg-[#1E88E5]/10"
                    >
                        <Link href={route('albums.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Quay về danh sách album
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title={`Album ${album.name}`} />

            <div className="space-y-8">
                {photos.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {photos.map((photo) => (
                            <Card
                                key={photo.id}
                                className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] text-[#E0E0E0] backdrop-blur transition hover:border-[#1E88E5]/30 hover:bg-[#252525]"
                                onClick={() => handlePhotoClick(photo)}
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={photo.file_path}
                                        alt={photo.original_filename ?? 'Photo'}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    <div className="absolute inset-x-3 bottom-3 flex flex-col gap-1 rounded-lg border border-[#2A2A2A] bg-[#1E1E1E]/95 p-3 text-xs opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <p className="truncate text-sm font-semibold text-[#E0E0E0]">
                                            {photo.original_filename ?? `Ảnh #${photo.id}`}
                                        </p>
                                        <div className="flex items-center justify-between text-[11px] text-[#757575]">
                                            <span>{formatBytes(photo.file_size)}</span>
                                            <span>
                                                {photo.uploaded_at
                                                    ? format(new Date(photo.uploaded_at), 'dd/MM/yyyy HH:mm')
                                                    : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2A2A2A] bg-[#1E1E1E] p-16 text-center text-[#B0B0B0]">
                        <ImageIcon className="mb-4 h-10 w-10 text-[#757575]" />
                        <p className="text-sm">Album hiện chưa có ảnh nào.</p>
                        <p className="mt-1 text-xs text-[#757575]">
                            Quay lại Thư viện ảnh để thêm ảnh vào album này.
                        </p>
                    </div>
                )}
            </div>

            <Dialog open={!!activePhoto} onOpenChange={handleModalOpenChange}>
                <DialogContent className="max-w-4xl rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] text-[#E0E0E0] backdrop-blur">
                    {activePhoto ? (
                        <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
                            <div className="relative w-full overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#252525]">
                                {isModalImageLoading && (
                                    <div className="flex aspect-video w-full items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-[#757575]" />
                                    </div>
                                )}
                                <img
                                    src={activePhoto.file_path}
                                    alt={activePhoto.original_filename ?? 'Photo'}
                                    className={`w-full object-contain ${isModalImageLoading ? 'hidden' : 'block'}`}
                                    onLoad={() => setIsModalImageLoading(false)}
                                />
                            </div>
                            <div className="space-y-6">
                                <DialogHeader>
                                    <DialogTitle className="break-words text-2xl font-semibold text-[#E0E0E0]">
                                        {activePhoto.original_filename ?? `Ảnh #${activePhoto.id}`}
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-[#757575]">
                                        {activePhoto.uploaded_at
                                            ? `Tải lên ${format(new Date(activePhoto.uploaded_at), 'HH:mm, dd/MM/yyyy')}`
                                            : 'Không rõ thời gian tải lên'}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2 rounded-lg border border-[#2A2A2A] bg-[#252525] p-4 text-xs text-[#B0B0B0]">
                                    <p className="flex items-center justify-between">
                                        <span>Kích thước file</span>
                                        <span>{formatBytes(activePhoto.file_size)}</span>
                                    </p>
                                    <p className="flex items-center justify-between">
                                        <span>Định dạng</span>
                                        <span>
                                            {activePhoto.mime_type ??
                                                activePhoto.file_path.split('.').pop()?.toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    className="w-full rounded-lg bg-[#1E88E5] font-semibold text-white shadow-lg shadow-[#1E88E5]/30 transition hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1E88E5]/40"
                                >
                                    <Link href={activePhoto.file_path} target="_blank">
                                        Xem ảnh gốc
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-12 text-[#757575]">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
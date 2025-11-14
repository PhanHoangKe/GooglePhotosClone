import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Photo } from '@/types';
import { Card, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

interface PhotoCardProps {
    photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
    const { delete: inertiaDelete, processing } = useForm({});
    const [isDeleting, setIsDeleting] = useState(false);

    // Cải tiến: Để CSS (truncate/line-clamp) xử lý việc cắt ngắn.
    const displayTitle = photo.original_filename ?? photo.filename ?? `Ảnh #${photo.id}`;

    const handleDelete = () => {
        if (confirm('Bạn có chắc chắn muốn xóa ảnh này? Hành động này không thể hoàn tác.')) {
            setIsDeleting(true);
            inertiaDelete(route('photos.destroy', photo.id), {
                preserveScroll: true,
                onFinish: () => setIsDeleting(false),
            });
        }
    };

    return (
        <Card className="group relative overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] text-[#E0E0E0] backdrop-blur transition hover:border-[#1E88E5]/30 hover:bg-[#252525]">
            <div className="relative aspect-square w-full overflow-hidden">
                {photo.file_type === 'image' || photo.file_type === 'gif' ? (
                    <img
                        src={photo.path}
                        alt={photo.original_filename ?? photo.filename ?? 'Photo'}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#252525]">
                        <ImageIcon className="h-10 w-10 text-[#757575]" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {(processing || isDeleting) && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#121212]/80 backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-[#1E88E5]" />
                    </div>
                )}

                <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between rounded-lg border border-[#2A2A2A] bg-[#1E1E1E]/95 px-3 py-2 text-xs opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="max-w-[70%]">
                        <p className="truncate text-sm font-semibold text-[#E0E0E0]">{displayTitle}</p>
                        <p className="text-[11px] text-[#757575]">{formatBytes(photo.file_size)}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] hover:border-red-500/50 hover:bg-red-500/20"
                        onClick={handleDelete}
                        disabled={processing || isDeleting}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <CardFooter className="flex items-center justify-between px-4 py-3 text-xs text-[#B0B0B0]">
                <div className="flex flex-col">
                    <span className="line-clamp-1 font-medium text-[#E0E0E0]">{displayTitle}</span>
                    <span className="text-[11px] text-[#757575]">{formatBytes(photo.file_size)}</span>
                </div>
                <span className="rounded-lg border border-[#2A2A2A] bg-[#252525] px-3 py-1 text-[10px] uppercase tracking-wide text-[#757575]">
                    {photo.file_type}
                </span>
            </CardFooter>
        </Card>
    );
}
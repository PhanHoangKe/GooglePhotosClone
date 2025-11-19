import { FormEvent, useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { PageProps, PaginatedResult } from '@/types';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card } from '@/Components/ui/card';
import { CheckCircle2, Loader2, RefreshCcw, Search, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TrashPhoto {
    id: number;
    file_name: string;
    file_path: string;
    size: number;
    deleted_at: string | null;
    created_at: string | null;
}

interface TrashPageProps extends PageProps {
    photos: PaginatedResult<TrashPhoto>;
    filters: {
        search: string | null;
    };
}

const formatBytes = (bytes: number): string => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${units[i]}`;
};

export default function Trash() {
    const { auth, photos, filters } = usePage<TrashPageProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search ?? '');
    const [focused, setFocused] = useState(false);
    const { patch, delete: destroy, processing } = useForm({});
    const [actionId, setActionId] = useState<number | null>(null);
    const [actionType, setActionType] = useState<'restore' | 'delete' | null>(null);
    const firstRenderRef = useRef(true);

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }

        const timeoutId = window.setTimeout(() => {
            router.get(
                route('photos.trash'),
                { search: searchTerm || null },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 400);

        return () => window.clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleRestore = (id: number) => {
        if (!confirm('Khôi phục ảnh này?')) return;
        setActionId(id);
        setActionType('restore');
        patch(route('photos.restore', id), {
            preserveScroll: true,
            onFinish: () => {
                setActionId(null);
                setActionType(null);
            },
        });
    };

    const handleForceDelete = (id: number) => {
        if (!confirm('Xóa vĩnh viễn ảnh này? Hành động không thể hoàn tác.')) return;
        setActionId(id);
        setActionType('delete');
        destroy(route('photos.force-delete', id), {
            preserveScroll: true,
            onFinish: () => {
                setActionId(null);
                setActionType(null);
            },
        });
    };

    const isActionRunning = (id: number, type: 'restore' | 'delete') =>
        processing && actionId === id && actionType === type;

    const renderPagination = () => (
        <div className="mt-10 flex flex-wrap justify-center gap-3">
            {photos.links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url ?? '#'}
                    preserveState
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 ${
                        link.active
                            ? 'border-transparent bg-[#1E88E5] text-white shadow-lg shadow-[#1E88E5]/30 hover:scale-105 hover:bg-[#1565C0]'
                            : 'border-[#2A2A2A] bg-[#1E1E1E] text-[#B0B0B0] hover:border-[#424242] hover:bg-[#252525] hover:text-[#E0E0E0]'
                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-3">
                        <p className="text-sm uppercase tracking-[0.35rem] text-[#B0B0B0]">Quản lý</p>
                        <h1 className="text-3xl font-semibold text-white">Thùng rác</h1>
                        <p className="text-sm text-[#B0B0B0]">
                            Khôi phục những ảnh đã xóa trong 30 ngày hoặc loại bỏ vĩnh viễn để giải phóng dung lượng.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm ảnh đã xóa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            className="h-11 rounded-lg border-[#2A2A2A] bg-[#1E1E1E] text-[#E0E0E0] placeholder:text-[#757575] focus-visible:border-[#1E88E5] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                        />
                        <Button asChild variant="outline" className="h-11 rounded-lg border-[#2A2A2A] bg-[#1E1E1E] text-[#E0E0E0]">
                            <Link href={route('photos.index')} className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Quay lại thư viện
                            </Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Thùng rác" />

            <section className="space-y-8">
                {photos.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {photos.data.map((photo) => (
                            <Card
                                key={photo.id}
                                className="group relative overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#1A1A1A]"
                            >
                                <div className="relative aspect-square w-full overflow-hidden">
                                    <img
                                        src={photo.file_path}
                                        alt={photo.file_name}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute inset-x-3 top-3 rounded-lg border border-red-500/40 bg-black/60 px-3 py-2 text-xs text-white">
                                        <p className="font-semibold">Đã xóa lúc</p>
                                        <p className="text-[11px] text-red-200">
                                            {photo.deleted_at
                                                ? format(parseISO(photo.deleted_at), 'HH:mm - dd/MM/yyyy')
                                                : '—'}
                                        </p>
                                    </div>
                                    <div className="absolute inset-x-3 bottom-3 space-y-2 rounded-xl border border-[#2A2A2A] bg-[#1E1E1E]/90 p-3 text-xs text-[#E0E0E0]">
                                        <p className="truncate text-sm font-semibold">{photo.file_name}</p>
                                        <p className="text-[11px] text-[#B0B0B0]">{formatBytes(photo.size)}</p>
                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1 gap-2 rounded-lg bg-[#1E1E1E] text-white hover:bg-[#2A2A2A]"
                                                disabled={isActionRunning(photo.id, 'restore')}
                                                onClick={() => handleRestore(photo.id)}
                                            >
                                                {isActionRunning(photo.id, 'restore') ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <RefreshCcw className="h-3.5 w-3.5" />
                                                )}
                                                Khôi phục
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="flex-1 gap-2 rounded-lg"
                                                disabled={isActionRunning(photo.id, 'delete')}
                                                onClick={() => handleForceDelete(photo.id)}
                                            >
                                                {isActionRunning(photo.id, 'delete') ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                )}
                                                Xóa vĩnh viễn
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2A2A2A] bg-[#1E1E1E]/50 p-16 text-center text-[#B0B0B0]">
                        <CheckCircle2 className="mb-4 h-12 w-12 text-[#1E88E5]" />
                        <p className="text-lg font-semibold text-white">Thùng rác trống</p>
                        <p className="text-sm text-[#B0B0B0]">Không có ảnh nào đang nằm trong thùng rác.</p>
                    </div>
                )}

                {photos.data.length > 0 && renderPagination()}
            </section>
        </AuthenticatedLayout>
    );
}

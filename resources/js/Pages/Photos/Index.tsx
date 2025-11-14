import { FormEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { PageProps, PaginatedResult } from '@/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    ArrowRight,
    BadgeCheck,
    CalendarDays,
    Check,
    Loader2,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import CreateAlbumModal from '@/Components/Album/CreateAlbumModal';

interface GalleryPhoto {
    id: number;
    user_id: number;
    file_name: string;
    file_path: string;
    size: number;
    created_at: string;
}

interface PhotoIndexProps extends PageProps {
    photos: PaginatedResult<GalleryPhoto>;
    filters: {
        search: string | null;
        sort_by: string;
        sort_direction: 'asc' | 'desc';
    };
}

const formatBytes = (bytes: number): string => {
    if (!bytes) return '0 KB';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${units[i]}`;
};

export default function Index({ auth }: PhotoIndexProps) {
    const { photos, filters } = usePage<PhotoIndexProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search ?? '');
    const [processing, setProcessing] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const { delete: destroy, processing: deleteProcessing } = useForm({});

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const activeSortLabel = useMemo(() => {
        switch (filters.sort_by) {
            case 'file_name':
                return filters.sort_direction === 'asc' ? 'Tên (A-Z)' : 'Tên (Z-A)';
            case 'size':
                return filters.sort_direction === 'desc' ? 'Kích thước (Lớn nhất)' : 'Kích thước (Nhỏ nhất)';
            default:
                return filters.sort_direction === 'desc' ? 'Mới nhất' : 'Cũ nhất';
        }
    }, [filters.sort_by, filters.sort_direction]);

    const handleSort = (newSortBy: string) => {
        const newDirection =
            filters.sort_by === newSortBy && filters.sort_direction === 'asc' ? 'desc' : 'asc';

        router.get(
            route('photos.index'),
            {
                search: filters.search,
                sort_by: newSortBy,
                sort_direction: newDirection,
            },
            {
                preserveState: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const groupedPhotos = useMemo(() => {
        const groups = photos.data.reduce<Record<string, GalleryPhoto[]>>((acc, photo) => {
            const dayKey = format(new Date(photo.created_at), 'yyyy-MM-dd');
            if (!acc[dayKey]) {
                acc[dayKey] = [];
            }
            acc[dayKey].push(photo);
            return acc;
        }, {});

        return Object.entries(groups).sort(
            ([dayA], [dayB]) => parseISO(dayB).getTime() - parseISO(dayA).getTime(),
        );
    }, [photos.data]);

    const togglePhotoSelection = (photoId: number) => {
        setSelectedPhotoIds((prev) => {
            if (prev.includes(photoId)) {
                return prev.filter((id) => id !== photoId);
            }
            return [...prev, photoId];
        });
    };

    const isPhotoSelected = (photoId: number) => selectedPhotoIds.includes(photoId);

    const cancelSelection = useCallback(() => {
        setIsSelectionMode(false);
        setSelectedPhotoIds([]);
        setIsAlbumModalOpen(false);
    }, []);

    const firstRenderRef = useRef(true);

    useEffect(() => {
        cancelSelection();
    }, [photos.links, cancelSelection]);

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }

        const timeoutId = window.setTimeout(() => {
            router.get(
                route('photos.index'),
                {
                    search: searchTerm || null,
                    sort_by: filters.sort_by,
                    sort_direction: filters.sort_direction,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onStart: () => setProcessing(true),
                    onFinish: () => setProcessing(false),
                },
            );
        }, 400);

        return () => window.clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const renderPaginationLinks = () => (
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2">
                            <CalendarDays className="h-4 w-4 text-blue-300" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                                Thư viện số
                            </span>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-4xl font-bold tracking-tight text-[#E0E0E0]">
                                Quản lý khoảnh khắc
                            </h2>
                            <p className="text-base text-[#B0B0B0] max-w-lg">
                                Tìm kiếm, sắp xếp và xem lại toàn bộ bộ sưu tập ảnh của bạn trong một
                                không gian duy nhất.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-shrink-0 flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative group w-full md:w-auto md:max-w-xs">
                            <div
                                className={`absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 blur transition-opacity duration-300 ${
                                    focusedField === 'search' ? 'opacity-100' : ''
                                }`}
                            />
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757575] transition-colors group-focus-within:text-[#1E88E5]" />
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên ảnh..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-11 rounded-lg border-[#2A2A2A] bg-[#1E1E1E] pl-11 pr-4 text-[#E0E0E0] placeholder:text-[#757575] transition-all duration-200 focus-visible:border-[#1E88E5] focus-visible:bg-[#252525] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                                    disabled={processing}
                                    onFocus={() => setFocusedField('search')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="inline-flex h-11 items-center gap-2 rounded-lg border-[#2A2A2A] bg-[#1E1E1E] px-4 py-2 text-sm text-[#B0B0B0] transition-all hover:border-[#1E88E5]/50 hover:bg-[#252525] hover:text-[#E0E0E0]"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    {activeSortLabel}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-xl border border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] shadow-lg"
                            >
                                <DropdownMenuItem
                                    onClick={() => handleSort('created_at')}
                                    className="flex items-center gap-2 text-[#E0E0E0] hover:bg-blue-500/10"
                                >
                                    <CalendarDays className="h-4 w-4 text-[#757575]" />
                                    Thời gian tải lên
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleSort('file_name')}
                                    className="flex items-center gap-2 text-[#E0E0E0] hover:bg-blue-500/10"
                                >
                                    <BadgeCheck className="h-4 w-4 text-[#757575]" />
                                    Tên tệp
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleSort('size')}
                                    className="flex items-center gap-2 text-[#E0E0E0] hover:bg-blue-500/10"
                                >
                                    <SlidersHorizontal className="h-4 w-4 text-[#757575]" />
                                    Kích thước tệp
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant={isSelectionMode ? 'secondary' : 'outline'}
                                className="h-11 rounded-lg border-[#2A2A2A] bg-[#1E1E1E] px-4 py-2 text-sm font-medium text-[#B0B0B0] transition-all hover:border-[#1E88E5]/50 hover:bg-[#252525] hover:text-[#E0E0E0] data-[state=secondary]:bg-[#2A2A2A]"
                                onClick={() => {
                                    if (isSelectionMode) {
                                        cancelSelection();
                                    } else {
                                        setIsSelectionMode(true);
                                    }
                                }}
                            >
                                {isSelectionMode ? 'Hủy chọn' : 'Chọn ảnh'}
                            </Button>

                            {isSelectionMode && selectedPhotoIds.length > 0 && (
                                <Button
                                    type="button"
                                    className="group relative h-11 overflow-hidden rounded-lg bg-[#1E88E5] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#1E88E5]/30 transition-all duration-300 hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1E88E5]/40 hover:scale-[1.01] active:scale-[0.99]"
                                    onClick={() => setIsAlbumModalOpen(true)}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Tạo album ({selectedPhotoIds.length})
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Thư viện ảnh" />

            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tl from-blue-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-10">
                <div>
                    {groupedPhotos.length > 0 ? (
                        <div className="space-y-10">
                            {groupedPhotos.map(([dayKey, dayPhotos]) => (
                                <section key={dayKey} className="space-y-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <h3 className="text-lg font-semibold text-[#E0E0E0]">
                                            {format(parseISO(dayKey), 'dd/MM/yyyy')}
                                        </h3>
                                        <p className="text-xs text-[#B0B0B0]">
                                            {dayPhotos.length} ảnh được tải lên
                                        </p>
                                    </div>
                                    
                                    {/* --- SỬA KÍCH THƯỚC ẢNH & BO GÓC --- */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                        {dayPhotos.map((photo) => (
                                            <article
                                                key={photo.id}
                                                className={`group relative cursor-pointer overflow-hidden rounded-xl border bg-[#1E1E1E] transition-all duration-300 ${ // Sửa: rounded-3xl -> rounded-xl
                                                    isSelectionMode && isPhotoSelected(photo.id)
                                                        ? 'border-[#1E88E5]/60 ring-2 ring-[#1E88E5]/50'
                                                        : 'border-[#2A2A2A] hover:scale-[1.03] hover:border-[#424242] hover:shadow-2xl hover:shadow-black/50'
                                                }`}
                                                onClick={() => {
                                                    if (isSelectionMode) {
                                                        togglePhotoSelection(photo.id);
                                                    } else {
                                                        setSelectedPhoto(photo);
                                                    }
                                                }}
                                            >
                                                <div className="relative aspect-square overflow-hidden">
                                                    <img
                                                        src={photo.file_path}
                                                        alt={photo.file_name}
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                    {isSelectionMode && (
                                                        <span
                                                            className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border transition ${
                                                                isPhotoSelected(photo.id)
                                                                    ? 'border-transparent bg-[#1E88E5] text-white'
                                                                    : 'border-[#2A2A2A] bg-[#1E1E1E]/80 text-transparent'
                                                            }`}
                                                        >
                                                            {isPhotoSelected(photo.id) && (
                                                                <Check className="h-4 w-4" />
                                                            )}
                                                        </span>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                    
                                                    <div className="absolute inset-x-3 bottom-3 translate-y-4 space-y-2 rounded-2xl border border-[#2A2A2A] bg-[#252525]/90 p-3 text-xs opacity-0 shadow-lg backdrop-blur-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                        <div className="flex flex-col gap-1">
                                                            <p className="truncate text-sm font-semibold text-[#E0E0E0]">{photo.file_name}</p>
                                                            <div className="flex items-center justify-between text-[11px] text-[#B0B0B0]">
                                                                <span>{format(new Date(photo.created_at), 'HH:mm')}</span>
                                                                <span>{formatBytes(photo.size)}</span>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="h-8 w-full rounded-lg"
                                                            disabled={deleteProcessing && deletingId === photo.id}
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                if (confirm('Bạn chắc chắn muốn xóa ảnh này?')) {
                                                                    setDeletingId(photo.id);
                                                                    destroy(route('photos.destroy', photo.id), {
                                                                        preserveScroll: true,
                                                                        onFinish: () => setDeletingId(null),
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            {deleteProcessing && deletingId === photo.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                'Xóa ảnh'
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2A2A2A] bg-[#1E1E1E]/50 p-16 text-center text-[#B0B0B0]"> {/* Sửa: rounded-3xl -> rounded-xl */}
                            <Search className="mb-4 h-10 w-10 text-[#757575]" />
                            <p className="text-sm font-semibold text-[#E0E0E0]">
                                Không tìm thấy ảnh nào
                            </p>
                            <p className="text-xs text-[#757575]">
                                Hãy thử điều chỉnh lại bộ lọc tìm kiếm hoặc tải ảnh mới.
                            </p>
                        </div>
                    )}

                    {photos.data.length > 0 && renderPaginationLinks()}
                </div>

                <Dialog
                    open={!!selectedPhoto}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedPhoto(null);
                        }
                    }}
                >
                    {/* Sửa: rounded-3xl -> rounded-xl */}
                    <DialogContent className="max-w-4xl rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] text-white shadow-2xl shadow-black/50">
                        {selectedPhoto && (
                            <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
                                {/* Sửa: rounded-2xl -> rounded-xl, thêm bg, đổi object-cover -> object-contain */}
                                <div className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#252525]">
                                    <img
                                        src={selectedPhoto.file_path}
                                        alt={selectedPhoto.file_name}
                                        className="h-full w-full object-contain" 
                                    />
                                </div>
                                <div className="space-y-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-semibold text-[#E0E0E0]">
                                            {selectedPhoto.file_name}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-[#B0B0B0]">
                                            Được tải lên lúc {format(new Date(selectedPhoto.created_at), 'HH:mm, dd/MM/yyyy')}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="rounded-2xl border border-[#2A2A2A] bg-[#252525] p-4 text-sm text-[#B0B0B0]">
                                        <p className="flex items-center justify-between py-1">
                                            <span>Kích thước</span>
                                            <span className="font-medium text-[#E0E0E0]">{formatBytes(selectedPhoto.size)}</span>
                                        </p>
                                        <p className="flex items-center justify-between py-1">
                                            <span>Định dạng</span>
                                            <span className="font-medium text-[#E0E0E0]">{selectedPhoto.file_path.split('.').pop()?.toUpperCase()}</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <Link
                                            href={selectedPhoto.file_path}
                                            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#252525] px-4 py-2 text-sm font-semibold text-[#E0E0E0] transition hover:bg-[#424242]"
                                            target="_blank"
                                        >
                                            Xem ảnh gốc
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            className="h-11 rounded-xl"
                                            disabled={deleteProcessing && deletingId === selectedPhoto.id}
                                            onClick={() => {
                                                if (confirm('Bạn chắc chắn muốn xóa ảnh này?')) {
                                                    setDeletingId(selectedPhoto.id);
                                                    destroy(route('photos.destroy', selectedPhoto.id), {
                                                        preserveScroll: true,
                                                        onFinish: () => {
                                                            setDeletingId(null);
                                                            setSelectedPhoto(null);
                                                        },
                                                    });
                                                }
                                            }}
                                        >
                                            {deleteProcessing && deletingId === selectedPhoto.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                'Xóa ảnh'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                <CreateAlbumModal
                    isOpen={isAlbumModalOpen}
                    onClose={() => setIsAlbumModalOpen(false)}
                    photoIds={selectedPhotoIds}
                    onSuccess={cancelSelection} 
                />
            </div>
        </AuthenticatedLayout>
    );
}
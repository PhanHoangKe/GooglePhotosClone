import { useEffect, useMemo, useRef, useState, FormEventHandler } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Progress } from '@/Components/ui/progress';
import InputError from '../InputError';
import { ImagePlus, Sparkles, Upload, X } from 'lucide-react';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FileItem {
    id: string;
    file: File;
    preview: string;
    title: string;
}

const MAX_FILES = 20;

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const {
        auth: { user },
    } = usePage<PageProps>().props;
    const { post, progress, errors, processing, reset, setData } = useForm({
        photos: [] as File[],
        titles: [] as string[],
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const [fileItems, setFileItems] = useState<FileItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const errorMessage = errors.photos ?? errors['photos.0'];

    const generateId = () =>
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`;

    const syncFormData = (items: FileItem[]) => {
        setData('photos', items.map((item) => item.file));
        setData('titles', items.map((item) => item.title));
    };

    const addFiles = (fileList: FileList | File[]) => {
        const incoming = Array.from(fileList).filter((file) => file.type.startsWith('image/'));
        if (!incoming.length) {
            return;
        }

        setFileItems((prev) => {
            if (prev.length >= MAX_FILES) {
                return prev;
            }

            const available = MAX_FILES - prev.length;
            const accepted = incoming.slice(0, available);

            const next: FileItem[] = [...prev];
            accepted.forEach((file) => {
                const preview = URL.createObjectURL(file);
                next.push({
                    id: generateId(),
                    file,
                    preview,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                });
            });

            return next;
        });
    };

    useEffect(() => {
        syncFormData(fileItems);
        return () => {
            fileItems.forEach((item) => URL.revokeObjectURL(item.preview));
        };
    }, [fileItems]);

    useEffect(() => {
        const handler = (event: ClipboardEvent) => {
            if (!isOpen || !event.clipboardData) return;
            const files = event.clipboardData.files;
            if (files && files.length) {
                addFiles(files);
            }
        };

        window.addEventListener('paste', handler);
        return () => window.removeEventListener('paste', handler);
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        addFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) {
            addFiles(e.dataTransfer.files);
        }
    };

    const removeFile = (id: string) => {
        setFileItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateTitle = (id: string, title: string) => {
        setFileItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, title } : item)),
        );
    };

    const totalSize = useMemo(
        () => fileItems.reduce((acc, item) => acc + item.file.size, 0),
        [fileItems],
    );

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('photos.store'), {
            forceFormData: true,
            onSuccess: () => {
                handleClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        setFileItems([]);
        setIsDragging(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-xl rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] text-[#E0E0E0] backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-[#E0E0E0]">
                        <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#252525]">
                            <Upload className="h-5 w-5 text-[#1E88E5]" />
                        </span>
                        Tải ảnh lên PixelVault
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#757575]">
                        Chọn ảnh yêu thích của bạn để đồng bộ vào kho lưu trữ an toàn của {user.name}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6">
                    <div
                        className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 text-center transition ${
                            isDragging
                                ? 'border-[#1E88E5] bg-[#1E88E5]/10'
                                : 'border-[#2A2A2A] bg-[#252525] hover:border-[#1E88E5]/50'
                        } min-h-[260px]`}
                        ref={dropZoneRef}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                        }}
                        onDrop={handleDrop}
                    >
                        {fileItems.length ? (
                            <div className="flex w-full flex-col gap-4">
                                <div className="flex items-center justify-between text-sm text-[#B0B0B0]">
                                    <span>
                                        Đã chọn {fileItems.length}/{MAX_FILES} ảnh
                                    </span>
                                    <span>{formatBytes(totalSize)}</span>
                                </div>
                                <div className="w-full overflow-hidden rounded-lg border border-[#2A2A2A]/40">
                                    <div className="max-h-[360px] w-full grid grid-cols-1 gap-4 overflow-y-auto p-3 pr-4 sm:grid-cols-2">
                                        {fileItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="rounded-lg border border-[#2A2A2A] bg-[#1B1B1B] p-3 shadow-sm"
                                            >
                                                <div className="relative mb-3">
                                                    <img
                                                        src={item.preview}
                                                        alt={item.title}
                                                        className="h-32 w-full rounded-md object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(item.id)}
                                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <Label className="text-xs text-[#8C8C8C]">Tiêu đề</Label>
                                                <Input
                                                    value={item.title}
                                                    onChange={(e) => updateTitle(item.id, e.target.value)}
                                                    className="mt-1 rounded-lg border-[#2A2A2A] bg-[#252525] text-sm text-[#E0E0E0] placeholder:text-[#757575] focus-visible:border-[#1E88E5] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-lg border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] hover:border-[#1E88E5]/50 hover:bg-[#1E88E5]/10"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Thêm ảnh khác
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#252525]">
                                    <ImagePlus className="h-8 w-8 text-[#757575]" />
                                </div>
                                <div className="space-y-1 text-sm text-[#B0B0B0]">
                                    <p className="font-semibold text-[#E0E0E0]">Kéo & thả ảnh vào đây</p>
                                    <p>Hoặc chọn từ thiết bị, hỗ trợ Paste trực tiếp (tối đa 20 ảnh)</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-lg border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] hover:border-[#1E88E5]/50 hover:bg-[#1E88E5]/10"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Chọn ảnh từ máy
                                </Button>
                            </>
                        )}
                        <Input
                            ref={fileInputRef}
                            id="photo"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleInputChange}
                        />
                    </div>
                    {errorMessage && <InputError message={errorMessage} className="text-red-400" />}

                    {progress && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-[#B0B0B0]">
                                <Sparkles className="h-3.5 w-3.5 text-[#1E88E5]" />
                                Đang tải lên {progress.percentage}%
                            </div>
                            <Progress value={progress.percentage} className="h-2 rounded-full bg-[#252525]" />
                        </div>
                    )}

                    <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-lg border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] hover:border-[#2A2A2A] hover:bg-[#2A2A2A] sm:w-auto"
                            onClick={handleClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="w-full rounded-lg bg-[#1E88E5] font-semibold text-white shadow-lg shadow-[#1E88E5]/30 transition hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1E88E5]/40 sm:w-auto"
                            disabled={processing || !fileItems.length}
                        >
                            {processing ? 'Đang tải...' : 'Hoàn tất tải lên'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
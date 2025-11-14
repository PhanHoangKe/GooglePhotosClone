import { useRef, useState, FormEventHandler } from 'react';
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
import { ImagePlus, Sparkles, Upload } from 'lucide-react';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const {
        auth: { user },
    } = usePage<PageProps>().props;
    const { data, setData, post, progress, errors, processing, reset } = useForm({
        photo: null as File | null,
        title: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (file: File | null) => {
        setData('photo', file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        handleFileChange(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0] ?? null;
        handleFileChange(file);
    };

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
        setPreviewUrl(null);
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
                        }`}
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
                        {previewUrl ? (
                            <div className="relative w-full max-w-sm overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#252525]">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full max-h-80 object-contain mx-auto" 
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#252525]">
                                    <ImagePlus className="h-8 w-8 text-[#757575]" />
                                </div>
                                <div className="space-y-1 text-sm text-[#B0B0B0]">
                                    <p className="font-semibold text-[#E0E0E0]">Kéo và thả ảnh vào đây</p>
                                    <p>Hoặc chọn từ thiết bị của bạn (tối đa 5MB)</p>
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
                            accept="image/*"
                            className="hidden"
                            onChange={handleInputChange}
                        />
                    </div>
                    {errors.photo && <InputError message={errors.photo} className="text-red-400" />}

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-[#E0E0E0]">
                            Tiêu đề (tùy chọn)
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            value={data.title}
                            placeholder="Ví dụ: Hoàng hôn trên biển"
                            onChange={(e) => setData('title', e.target.value)}
                            className="rounded-lg border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] placeholder:text-[#757575] focus-visible:border-[#1E88E5] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                        />
                        {errors.title && <InputError message={errors.title} className="text-red-400" />}
                    </div>

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
                            disabled={processing || !data.photo}
                        >
                            {processing ? 'Đang tải...' : 'Hoàn tất tải lên'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
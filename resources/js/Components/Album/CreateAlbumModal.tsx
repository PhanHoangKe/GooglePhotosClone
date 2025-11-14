import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import InputError from '@/Components/InputError';
import { Album, Image as ImageIcon } from 'lucide-react';

interface CreateAlbumModalProps {
    isOpen: boolean;
    onClose: () => void;
    photoIds: number[];
    onSuccess: () => void;
}

export default function CreateAlbumModal({ isOpen, onClose, photoIds, onSuccess }: CreateAlbumModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        photo_ids: [] as number[],
    });

    useEffect(() => {
        if (isOpen) {
            setData('photo_ids', photoIds);
        }
    }, [isOpen, photoIds]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(route('albums.store'), {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
        >
            <DialogContent className="max-w-2xl rounded-lg border-[#2A2A2A] bg-[#1E1E1E] text-[#E0E0E0]">
                <DialogHeader className="space-y-3 pb-2 text-center">
                    <div className="mx-auto inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-blue-300 backdrop-blur-sm">
                        <Album className="h-3 w-3" />
                        Tạo album mới
                    </div>
                    <DialogTitle className="text-3xl font-semibold tracking-tight text-[#E0E0E0]">
                        Tạo album ảnh mới
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm leading-relaxed text-[#B0B0B0]">
                        Nhóm các khoảnh khắc yêu thích của bạn vào một bộ sưu tập
                    </DialogDescription>
                </DialogHeader>

                <div className="relative overflow-hidden rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 backdrop-blur-sm">
                    <div className="relative flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                            <ImageIcon className="h-5 w-5 text-blue-300" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-white">
                                <span className="text-2xl font-bold text-blue-300">{photoIds.length}</span> ảnh đã
                                được chọn
                            </p>
                            <p className="text-xs text-[#B0B0B0]">Tất cả sẽ được thêm vào album mới</p>
                        </div>
                    </div>
                    {errors.photo_ids && <InputError message={errors.photo_ids} className="mt-3 text-red-400" />}
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="album-name" className="text-sm font-medium text-[#E0E0E0]">
                            Tên album <span className="text-red-400">*</span>
                        </Label>
                        <Input
                            id="album-name"
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                            required
                            placeholder="Ví dụ: Kỳ nghỉ hè 2024, Sinh nhật, ..."
                            className="h-11 rounded-lg border-[#2A2A2A] bg-[#1E1E1E] px-4 text-[#E0E0E0] placeholder:text-[#757575] transition-all duration-200 focus-visible:border-[#1E88E5] focus-visible:bg-[#252525] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                        />
                        <InputError message={errors.name} className="text-xs text-red-400" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="album-description" className="text-sm font-medium text-[#E0E0E0]">
                            Mô tả <span className="text-xs font-normal text-[#B0B0B0]">(tùy chọn)</span>
                        </Label>
                        <textarea
                            id="album-description"
                            value={data.description}
                            onChange={(event) => setData('description', event.target.value)}
                            rows={3}
                            placeholder="Thêm mô tả ngắn gọn về album này..."
                            className="w-full resize-none rounded-lg border-[#2A2A2A] bg-[#1E1E1E] p-3 text-sm text-[#E0E0E0] placeholder:text-[#757575] transition-all duration-200 focus:border-[#1E88E5] focus:bg-[#252525] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30"
                        />
                        <InputError message={errors.description} className="text-xs text-red-400" />
                        <p className="text-xs text-[#B0B0B0]">Bạn có thể chỉnh sửa thông tin này sau</p>
                    </div>

                    <DialogFooter className="flex flex-col-reverse gap-3 border-t border-[#2A2A2A] pt-6 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-lg border-[#2A2A2A] bg-[#1E1E1E] px-6 py-2.5 text-sm font-medium text-[#E0E0E0] transition-colors hover:border-[#424242] hover:bg-[#252525] sm:w-auto"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="group relative h-11 w-full overflow-hidden rounded-lg bg-[#1E88E5] text-sm font-semibold text-white shadow-lg shadow-[#1E88E5]/30 transition-all duration-300 hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1E88E5]/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 sm:w-auto"
                            disabled={processing || !data.name.trim()}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {processing ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <Album className="h-4 w-4" />
                                        Tạo album
                                    </>
                                )}
                            </span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
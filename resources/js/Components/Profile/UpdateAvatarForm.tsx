import { FormEventHandler, useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Loader2, Trash2, Camera, UserCircle, UploadCloud } from 'lucide-react'; // Thêm icon UploadCloud

export default function UpdateAvatarForm() {
    const user = usePage<PageProps>().props.auth.user;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState(user.avatar || null);

    const {
        data,
        setData,
        post,
        errors,
        processing,
        recentlySuccessful,
        delete: inertiaDelete,
    } = useForm({
        avatar: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.avatar) return;

        post(route('avatar.store'), {
            forceFormData: true,
            onSuccess: () => {
                setData('avatar', null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const handleDelete = () => {
        if (confirm('Bạn có chắc chắn muốn xóa ảnh đại diện?')) {
            inertiaDelete(route('avatar.destroy'), {
                preserveScroll: true,
                onSuccess: () => {
                    setPreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                },
            });
        }
    };

    return (
        <Card className="rounded-xl border-[#2A2A2A] bg-[#1E1E1E] text-[#E0E0E0] backdrop-blur">
            <CardHeader className="space-y-2">
                <CardTitle className="text-lg font-semibold text-[#E0E0E0]">Ảnh đại diện</CardTitle>
                <CardDescription className="text-xs text-[#757575]">
                    Tải ảnh đại diện sắc nét nhất của bạn (dung lượng tối đa 5MB).
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                    <div className="relative h-28 w-28 overflow-hidden rounded-full border border-[#2A2A2A] bg-[#252525]">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Ảnh đại diện" className="h-full w-full object-cover" />
                        ) : (
                            <UserCircle className="h-full w-full text-[#757575]" />
                        )}
                        <span className="absolute -bottom-2 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] shadow-lg backdrop-blur">
                            <Camera className="h-4 w-4" />
                        </span>
                    </div>
                    <p className="text-xs text-[#757575]">
                        Gợi ý: sử dụng hình ảnh có độ phân giải cao và nền tối giản để hiển thị đẹp nhất trong thư
                        viện.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* --- PHẦN ĐÃ SỬA --- */}
                    <div className="flex items-center gap-3">
                        {/* 1. Nút giả mà người dùng nhấn vào */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-auto rounded-lg border-[#2A2A2A] bg-[#252525] px-4 py-2 text-sm text-[#E0E0E0] hover:border-[#1E88E5]/50 hover:bg-[#1E88E5]/10"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Chọn file
                        </Button>

                        {/* 2. Hiển thị tên file đã chọn */}
                        <span className="truncate text-xs text-[#B0B0B0]">
                            {data.avatar ? data.avatar.name : 'Chưa có file nào được chọn'}
                        </span>

                        {/* 3. Thẻ input thật, bị ẩn đi */}
                        <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden" // QUAN TRỌNG: ẩn thẻ input thật
                        />
                    </div>
                    {/* --- HẾT PHẦN SỬA --- */}

                    {errors.avatar && (
                        <Alert variant="destructive" className="border-red-500/40 bg-red-500/20 text-red-300">
                            <AlertDescription>{errors.avatar}</AlertDescription>
                        </Alert>
                    )}

                    {recentlySuccessful && (
                        <Alert className="border-green-500/40 bg-green-500/20 text-green-300">
                            <AlertDescription>Ảnh đại diện mới đã được lưu!</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                        {user.avatar && (
                            <Button
                                type="button"
                                onClick={handleDelete}
                                variant="destructive"
                                disabled={processing}
                                className="flex h-11 w-full items-center justify-center rounded-lg border border-red-500/40 bg-red-500/20 px-6 text-red-300 hover:border-red-400/50 hover:bg-red-500/30 sm:w-auto"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa ảnh hiện tại
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={processing || !data.avatar}
                            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#1E88E5] px-6 font-semibold text-white shadow-lg shadow-[#1E88E5]/30 transition hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1E88E5]/40 sm:w-auto"
                        >
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Cập nhật ảnh đại diện'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
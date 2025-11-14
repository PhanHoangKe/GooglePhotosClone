import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteUserForm({ className = '' }: { className?: string }) {
    const [open, setOpen] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const closeModal = () => {
        setOpen(false);
        clearErrors();
        reset();
    };

    const confirmUserDeletion = () => {
        setOpen(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="space-y-2">
                <div className="flex items-center gap-3 text-sm font-semibold text-red-300/80">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/20">
                        <AlertTriangle className="h-4 w-4" />
                    </span>
                    Nguy hiểm tiềm ẩn
                </div>
                <h2 className="text-xl font-semibold text-white">Xóa vĩnh viễn tài khoản</h2>
                <p className="text-sm text-white/60">
                    Sau khi xóa, mọi ảnh và dữ liệu liên quan sẽ bị loại bỏ khỏi PixelVault và không thể khôi phục.
                </p>
            </header>

            <Button
                variant="destructive"
                onClick={confirmUserDeletion}
                className="rounded-xl border border-red-500/40 bg-red-500/20 text-red-200 hover:border-red-400 hover:bg-red-500/30"
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa tài khoản
            </Button>

            <Dialog
                open={open}
                onOpenChange={(value) => {
                    if (!value) {
                        closeModal();
                    } else {
                        setOpen(true);
                    }
                }}
            >
                <DialogContent className="max-w-lg rounded-3xl border border-white/10 bg-slate-950/95 text-white backdrop-blur">
                    <form onSubmit={deleteUser} className="space-y-6">
                        <DialogHeader className="space-y-3">
                            <DialogTitle className="text-2xl font-semibold text-white">
                                Bạn có chắc chắn?
                            </DialogTitle>
                            <DialogDescription className="text-sm text-white/60">
                                Hành động này sẽ xóa vĩnh viễn toàn bộ ảnh, album và dữ liệu hồ sơ của bạn. Nhập mật khẩu để
                                xác nhận.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white/80">
                                Mật khẩu
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/40"
                                placeholder="Nhập mật khẩu hiện tại"
                                autoComplete="current-password"
                                required
                            />
                            <InputError message={errors.password} className="text-red-200" />
                        </div>

                        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full rounded-xl border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20 sm:w-auto"
                                onClick={closeModal}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                className="w-full rounded-xl border border-red-500/50 bg-red-500/30 hover:border-red-400 hover:bg-red-500/40 sm:w-auto"
                                disabled={processing}
                            >
                                {processing ? 'Đang xóa...' : 'Xóa ngay'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}

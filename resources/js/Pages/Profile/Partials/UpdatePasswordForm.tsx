import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import InputError from '@/Components/InputError';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Loader2, ShieldCheck } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'; 

export default function UpdatePasswordForm({ className = '' }: { className?: string }) {
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <CardHeader className="space-y-2 p-0">
                <CardTitle className="text-lg font-semibold text-[#E0E0E0]">Đổi mật khẩu đăng nhập</CardTitle>
                <CardDescription className="text-xs text-[#757575]">
                    Tạo mật khẩu mạnh hơn để bảo vệ thư viện ảnh của bạn khỏi truy cập trái phép.
                </CardDescription>
            </CardHeader>

            <form onSubmit={updatePassword} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="current_password" className="text-sm font-medium text-[#E0E0E0]">
                        Mật khẩu hiện tại
                    </Label>
                    <Input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        className="h-11 rounded-lg border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] placeholder:text-[#757575] transition-all duration-200 focus-visible:border-[#1E88E5] focus-visible:bg-[#252525] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                    />
                    <InputError message={errors.current_password} className="text-xs text-red-400" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-[#E0E0E0]">
                        Mật khẩu mới
                    </Label>
                    <Input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        className="h-11 rounded-lg border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] placeholder:text-[#757575] transition-all duration-200 focus-visible:border-[#1E88E5] focus-visible:bg-[#252525] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                    />
                    <InputError message={errors.password} className="text-xs text-red-400" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-[#E0E0E0]">
                        Xác nhận mật khẩu
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        className="h-11 rounded-lg border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] placeholder:text-[#757575] transition-all duration-200 focus-visible:border-[#1E88E5] focus-visible:bg-[#252525] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                    />
                    <InputError message={errors.password_confirmation} className="text-xs text-red-400" />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="group relative h-11 w-full overflow-hidden rounded-lg bg-[#1E88E5] px-6 text-sm font-semibold text-white shadow-lg shadow-[#1E88E5]/30 transition-all duration-300 hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1E88E5]/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 sm:w-auto"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Đang cập nhật...
                                </>
                            ) : (
                                'Cập nhật mật khẩu'
                            )}
                        </span>
                    </Button>
                    {recentlySuccessful && (
                        <p className="flex items-center gap-2 text-sm text-green-300">
                            <ShieldCheck className="h-4 w-4" />
                            Đã lưu thành công
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
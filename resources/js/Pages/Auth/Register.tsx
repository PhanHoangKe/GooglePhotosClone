import { FormEventHandler, useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import InputError from '@/Components/InputError';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Đăng ký" />

            <div className="space-y-7">
                {/* Header */}
                <div className="space-y-3 text-center">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-blue-300 backdrop-blur-sm">
                        <UserPlus className="h-3 w-3" />
                        Tạo tài khoản
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold tracking-tight text-[#E0E0E0]">Chào mừng đến với PixelVault</h2>
                        <p className="text-sm leading-relaxed text-[#B0B0B0]">
                            Đăng ký tài khoản miễn phí để đồng bộ và lưu trữ mọi khoảnh khắc đáng nhớ
                        </p>
                    </div>
                </div>

                {/* Success Alert */}
                {recentlySuccessful && (
                    <Alert className="border-green-500/40 bg-green-500/15 text-green-300 backdrop-blur-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription className="text-sm">Tạo tài khoản thành công!</AlertDescription>
                    </Alert>
                )}

                {/* Form */}
                <form onSubmit={submit} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-[#E0E0E0]">
                            Họ và tên
                        </Label>
                        <div className="relative group">
                            <div
                                className={`absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 blur transition-opacity duration-300 ${
                                    focusedField === 'name' ? 'opacity-100' : ''
                                }`}
                            />
                            <div className="relative">
                                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757575] transition-colors group-focus-within:text-[#1E88E5]" />
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="h-11 rounded-lg border-[#2A2A2A] bg-[#1E1E1E] pl-10 pr-4 text-[#E0E0E0] placeholder:text-[#757575] transition-all duration-200 focus-visible:border-[#1E88E5] focus-visible:bg-[#252525] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                                    placeholder="Nguyễn Văn A"
                                    autoComplete="name"
                                    onChange={(e) => setData('name', e.target.value)}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                            </div>
                        </div>
                        <InputError message={errors.name} className="text-xs text-red-400" />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-[#E0E0E0]">
                            Địa chỉ email
                        </Label>
                        <div className="relative group">
                            <div
                                className={`absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 blur transition-opacity duration-300 ${
                                    focusedField === 'email' ? 'opacity-100' : ''
                                }`}
                            />
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757575] transition-colors group-focus-within:text-[#1E88E5]" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="h-11 rounded-lg border-[#2A2A2A] bg-[#1E1E1E] pl-10 pr-4 text-[#E0E0E0] placeholder:text-[#757575] transition-all duration-200 focus-visible:border-[#1E88E5] focus-visible:bg-[#252525] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                                    placeholder="name@example.com"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                            </div>
                        </div>
                        <InputError message={errors.email} className="text-xs text-red-400" />
                    </div>

                    {/* Passwords */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-[#E0E0E0]">
                                Mật khẩu
                            </Label>
                            <div className="relative group">
                                <div
                                    className={`absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 blur transition-opacity duration-300 ${
                                        focusedField === 'password' ? 'opacity-100' : ''
                                    }`}
                                />
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757575] transition-colors group-focus-within:text-[#1E88E5]" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="h-11 rounded-lg border-[#2A2A2A] bg-[#1E1E1E] pl-10 pr-11 text-[#E0E0E0] placeholder:text-[#757575] transition-all duration-200 focus-visible:border-[#1E88E5] focus-visible:bg-[#252525] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] transition-colors hover:text-[#E0E0E0]"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <InputError message={errors.password} className="text-xs text-red-400" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-[#E0E0E0]">
                                Xác nhận mật khẩu
                            </Label>
                            <div className="relative group">
                                <div
                                    className={`absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 blur transition-opacity duration-300 ${
                                        focusedField === 'password_confirmation' ? 'opacity-100' : ''
                                    }`}
                                />
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757575] transition-colors group-focus-within:text-[#1E88E5]" />
                                    <Input
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="h-11 rounded-lg border-[#2A2A2A] bg-[#1E1E1E] pl-10 pr-11 text-[#E0E0E0] placeholder:text-[#757575] transition-all duration-200 focus-visible:border-[#1E88E5] focus-visible:bg-[#252525] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        onFocus={() => setFocusedField('password_confirmation')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] transition-colors hover:text-[#E0E0E0]"
                                        tabIndex={-1}
                                    >
                                        {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <InputError message={errors.password_confirmation} className="text-xs text-red-400" />
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] px-4 py-3 text-xs text-[#B0B0B0] backdrop-blur-sm">
                        Bằng việc đăng ký, bạn đồng ý với{' '}
                        <span className="font-semibold text-[#1E88E5]">Điều khoản sử dụng</span> và{' '}
                        <span className="font-semibold text-[#1E88E5]">Chính sách bảo mật</span> của PixelVault.
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={processing}
                        className="group relative h-11 w-full overflow-hidden rounded-lg bg-[#1E88E5] text-sm font-semibold text-white shadow-lg shadow-[#1E88E5]/30 transition-all duration-300 hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1E88E5]/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {processing ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Đang tạo tài khoản...
                                </>
                            ) : (
                                <>
                                    Đăng ký tài khoản
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </>
                            )}
                        </span>
                    </Button>
                </form>

                {/* Footer */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#2A2A2A]" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-[#1E1E1E] px-4 py-1.5 text-[#B0B0B0] backdrop-blur-sm rounded-lg">
                            Đã có tài khoản?{' '}
                            <Link
                                href={route('login')}
                                className="font-semibold text-[#1E88E5] transition-colors hover:text-[#42A5F5]"
                            >
                                Đăng nhập ngay
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

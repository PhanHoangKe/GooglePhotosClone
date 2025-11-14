import { FormEventHandler, useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import InputError from '@/Components/InputError';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        return () => reset('password');
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Đăng nhập" />

            <div className="space-y-7">
                {/* Header */}
                <div className="space-y-3 text-center">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-blue-300 backdrop-blur-sm">
                        <LogIn className="h-3 w-3" />
                        Chào mừng trở lại
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold tracking-tight text-[#E0E0E0]">Đăng nhập</h2>
                        <p className="text-sm leading-relaxed text-[#B0B0B0]">
                            Nhập thông tin đăng nhập để truy cập vào thư viện ảnh của bạn
                        </p>
                    </div>
                </div>

                {/* Status Alert */}
                {status && (
                    <Alert className="border-green-500/40 bg-green-500/15 text-green-300 backdrop-blur-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription className="text-sm">{status}</AlertDescription>
                    </Alert>
                )}

                {/* Form */}
                <form onSubmit={submit} className="space-y-5">
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

                    {/* Password */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-medium text-[#E0E0E0]">
                                Mật khẩu
                            </Label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs font-medium text-[#1E88E5] transition-colors hover:text-[#42A5F5]"
                                >
                                    Quên mật khẩu?
                                </Link>
                            )}
                        </div>
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
                                    autoComplete="current-password"
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

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <label className="group flex cursor-pointer items-center gap-2.5 text-sm text-[#B0B0B0] transition-colors hover:text-[#E0E0E0]">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded border-[#2A2A2A] bg-[#1E1E1E] text-[#1E88E5] transition-all focus:ring-2 focus:ring-[#1E88E5]/50 focus:ring-offset-0"
                            />
                            <span>Ghi nhớ đăng nhập trên thiết bị này</span>
                        </label>
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
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    Đăng nhập
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
                            Chưa có tài khoản?{' '}
                            <Link
                                href={route('register')}
                                className="font-semibold text-[#1E88E5] transition-colors hover:text-[#42A5F5]"
                            >
                                Đăng ký ngay
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
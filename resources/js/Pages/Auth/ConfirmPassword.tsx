import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react'; // Import useState
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { BadgeCheck, Lock, ShieldAlert, Eye, EyeOff } from 'lucide-react'; // Import Eye, EyeOff

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [focusedField, setFocusedField] = useState<string | null>(null); // State for focus effect

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Xác nhận mật khẩu" />

            <div className="relative">
                {/* Decorative Elements - Same as Login */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-slate-400/20 via-gray-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tl from-slate-500/15 via-gray-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative space-y-8">
                    {/* Header - Styled to match Login */}
                    <div className="space-y-4 text-center">
                        <div className="inline-flex items-center gap-2.5 rounded-lg border border-slate-300/20 bg-gradient-to-br from-slate-100/10 to-gray-100/5 px-4 py-2 backdrop-blur-xl shadow-lg shadow-slate-500/5">
                            <ShieldAlert className="h-4 w-4 text-slate-300" /> {/* Changed icon to ShieldAlert */}
                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                                Khu vực bảo mật
                            </span>
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold tracking-tight">
                                <span className="bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300 bg-clip-text text-transparent">
                                    Xác nhận danh tính
                                </span>
                            </h1>
                            <p className="text-base text-slate-400 max-w-sm mx-auto leading-relaxed">
                                Vui lòng nhập lại mật khẩu để tiếp tục truy cập các tính năng bảo mật của PixelVault.
                            </p>
                        </div>
                    </div>

                    {/* Status Alert - Styled to match Login */}
                    {recentlySuccessful && (
                        <Alert className="border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-green-500/5 backdrop-blur-xl shadow-lg shadow-emerald-500/10">
                            <BadgeCheck className="h-5 w-5 text-emerald-400" />
                            <AlertDescription className="text-sm font-medium text-emerald-300">
                                Mật khẩu đã được xác nhận.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Form with Modern Glass Card - Same as Login */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 via-gray-800/30 to-slate-900/40 rounded-2xl blur-2xl" />

                        <div className="relative border border-slate-700/50 bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-slate-950/50 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl shadow-slate-900/50">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Password Field - Styled to match Login */}
                                <div className="space-y-2.5">
                                    <Label htmlFor="password" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                        <Lock className="h-3.5 w-3.5 text-slate-400" />
                                        Mật khẩu hiện tại
                                    </Label>
                                    <div className="relative group">
                                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-slate-400 to-gray-400 rounded-lg opacity-0 blur transition-all duration-500 ${
                                            focusedField === 'password' ? 'opacity-30' : 'group-hover:opacity-10'
                                        }`} />
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                className="h-12 rounded-lg border-slate-700/50 bg-slate-900/50 pl-4 pr-12 text-slate-100 placeholder:text-slate-500 transition-all duration-300 focus-visible:border-slate-400/50 focus-visible:bg-slate-900/70 focus-visible:ring-2 focus-visible:ring-slate-400/20 focus-visible:shadow-lg focus-visible:shadow-slate-400/10"
                                                placeholder="••••••••••"
                                                autoComplete="current-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                onFocus={() => setFocusedField('password')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-all hover:text-slate-300 hover:scale-110"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <InputError message={errors.password} className="text-xs text-rose-400 font-medium" />
                                </div>

                                {/* Submit Button - Styled to match Login */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="group relative h-13 w-full overflow-hidden rounded-xl bg-gradient-to-r from-slate-400 via-gray-400 to-slate-500 text-sm font-bold tracking-wide text-slate-950 shadow-xl shadow-slate-400/25 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-400/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-lg"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    <span className="relative z-10 flex items-center justify-center gap-2.5 py-0.5">
                                        {processing ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                                                <span>Đang xác nhận...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Xác nhận</span>
                                                <BadgeCheck className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
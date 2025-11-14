import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/Components/ui/button';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { BadgeCheck, MailOpen, RefreshCcw } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Xác thực email" />

            <div className="relative">
                {/* Decorative Elements - Đồng bộ với các form khác */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-slate-400/20 via-gray-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tl from-slate-500/15 via-gray-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative space-y-8">
                    {/* Header - Styled to match previous forms */}
                    <div className="space-y-4 text-center">
                        {/* Chip/Badge - Đồng bộ với style Glass */}
                        <div className="inline-flex items-center gap-2.5 rounded-lg border border-slate-300/20 bg-gradient-to-br from-slate-100/10 to-gray-100/5 px-4 py-2 backdrop-blur-xl shadow-lg shadow-slate-500/5">
                            <MailOpen className="h-4 w-4 text-slate-300" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                                Gần hoàn tất
                            </span>
                        </div>
                        
                        {/* Title & Description */}
                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold tracking-tight">
                                <span className="bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300 bg-clip-text text-transparent">
                                    Xác nhận email của bạn
                                </span>
                            </h1>
                            <p className="text-base text-slate-400 max-w-sm mx-auto leading-relaxed">
                                Chúng tôi đã gửi một liên kết xác minh tới hộp thư của bạn. Vui lòng kiểm tra email và nhấn vào liên kết đó để kích hoạt tài khoản.
                            </p>
                        </div>
                    </div>

                    {/* Success Alert - Styled to match previous forms */}
                    {status === 'verification-link-sent' && (
                        <Alert className="border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-green-500/5 backdrop-blur-xl shadow-lg shadow-emerald-500/10">
                            <AlertDescription className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                                <BadgeCheck className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                                Liên kết xác minh mới đã được gửi. Vui lòng kiểm tra hộp thư của bạn.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Form/Action Buttons - Wrapped in a Glass Card for consistency */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 via-gray-800/30 to-slate-900/40 rounded-2xl blur-2xl" />

                        <div className="relative border border-slate-700/50 bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-slate-950/50 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl shadow-slate-900/50">
                            <form onSubmit={submit} className="space-y-5">
                                {/* Resend Button (Primary Action) - Matching submit button style */}
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
                                                <span>Đang gửi lại...</span>
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCcw className="h-4 w-4" />
                                                <span>Gửi lại liên kết xác minh</span>
                                            </>
                                        )}
                                    </span>
                                </Button>

                                {/* Logout Button (Secondary Action) - Matching secondary button style */}
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="group relative h-13 w-full overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-300 shadow-lg shadow-slate-900/50 transition-all duration-300 hover:border-slate-500/70 hover:bg-slate-800/60 hover:text-slate-200 hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    Đăng xuất
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
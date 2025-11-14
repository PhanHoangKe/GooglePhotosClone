import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import InputError from '@/Components/InputError';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { ArrowLeft, CheckCircle2, Mail, Send } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        email: '',
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Quên mật khẩu" />

            <div className="space-y-7">
                {/* Header */}
                <div className="space-y-3 text-center">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-blue-300 backdrop-blur-sm">
                        <Send className="h-3 w-3" />
                        Khôi phục mật khẩu
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold tracking-tight text-[#E0E0E0]">Quên mật khẩu?</h2>
                        <p className="text-sm leading-relaxed text-[#B0B0B0]">
                            Không vấn đề gì. Nhập email của bạn và chúng tôi sẽ gửi cho bạn một liên kết đặt lại mật khẩu.
                        </p>
                    </div>
                </div>

                {/* Status Alerts */}
                {status && (
                    <Alert className="border-green-500/40 bg-green-500/15 text-green-300 backdrop-blur-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription className="text-sm">{status}</AlertDescription>
                    </Alert>
                )}

                {recentlySuccessful && (
                    <Alert className="border-green-500/40 bg-green-500/15 text-green-300 backdrop-blur-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                            Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!
                        </AlertDescription>
                    </Alert>
                )}

                {/* Form */}
                <form onSubmit={submit} className="space-y-5">
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
                                    placeholder="your.email@example.com"
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                            </div>
                        </div>
                        <InputError message={errors.email} className="text-xs text-red-400" />
                    </div>

                    {/* Info Box */}
                    <div className="rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] px-4 py-3 text-xs text-[#B0B0B0] backdrop-blur-sm">
                        💡 Kiểm tra hộp thư đến và cả thư mục spam nếu bạn không thấy email trong vài phút.
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
                                    <Send className="h-4 w-4 animate-pulse" />
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Gửi liên kết đặt lại mật khẩu
                                </>
                            )}
                        </span>
                    </Button>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-center gap-2 text-sm text-[#B0B0B0]">
                    <ArrowLeft className="h-4 w-4" />
                    <Link
                        href={route('login')}
                        className="font-medium text-[#1E88E5] transition-colors hover:text-[#42A5F5]"
                    >
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
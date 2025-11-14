import { FormEventHandler } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import InputError from '@/Components/InputError';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { BadgeCheck, MailWarning } from 'lucide-react';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        _method: 'patch' as const,
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'));
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="space-y-2">
                <h2 className="text-xl font-semibold text-[#E0E0E0]">Thông tin cá nhân</h2>
                <p className="text-sm text-[#757575]">
                    Cập nhật tên hiển thị và email để đồng bộ trải nghiệm của bạn trên toàn bộ hệ sinh thái PixelVault.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-[#E0E0E0]">
                        Họ và tên
                    </Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        className="rounded-lg border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] placeholder:text-[#757575] focus-visible:border-[#1E88E5] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                    />
                    <InputError message={errors.name} className="text-red-400" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[#E0E0E0]">
                        Email đăng nhập
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        className="rounded-lg border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] placeholder:text-[#757575] focus-visible:border-[#1E88E5] focus-visible:ring-2 focus-visible:ring-[#1E88E5]/30"
                    />
                    <InputError message={errors.email} className="text-red-400" />

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="mt-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-xs text-yellow-300">
                            <p className="flex items-center gap-2">
                                <MailWarning className="h-4 w-4" />
                                Email của bạn chưa được xác minh.
                            </p>
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="mt-2 inline-flex items-center gap-2 rounded-lg border border-yellow-400/30 bg-yellow-500/10 px-3 py-2 text-left text-yellow-300 transition hover:border-yellow-300/50 hover:bg-yellow-500/20"
                            >
                                Gửi lại mail xác nhận
                            </Link>
                            {status === 'verification-link-sent' && (
                                <p className="mt-2 text-green-300">
                                    Liên kết xác minh mới đã được gửi tới email của bạn.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-[#1E88E5] font-semibold text-white shadow-lg shadow-[#1E88E5]/30 transition hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1E88E5]/40 sm:w-auto"
                    >
                        Lưu thay đổi
                    </Button>
                    {recentlySuccessful && (
                        <p className="flex items-center gap-2 text-sm text-green-300">
                            <BadgeCheck className="h-4 w-4" />
                            Thông tin đã được cập nhật
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}

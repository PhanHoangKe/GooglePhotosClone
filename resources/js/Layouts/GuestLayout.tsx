import ApplicationLogo from '@/Components/ApplicationLogo';
import { Card } from '@/Components/ui/card';
import { PropsWithChildren, ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { Camera, Cloud, ShieldCheck, Sparkles } from 'lucide-react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#121212' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#121212]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,136,229,0.08),_transparent_60%)]" />
            <div
                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0H100V100H0z\' fill=\'rgba(18,18,18,0.9)\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'1\' fill=\'rgba(148,163,184,0.2)\'/%3E%3C/svg%3E")',
                }}
            />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12 sm:px-8 lg:flex-row lg:items-center lg:gap-20 lg:py-20">
                <div className="mx-auto mb-12 max-w-xl space-y-10 text-center lg:mx-0 lg:mb-0 lg:text-left">
                    <Link href="/" className="inline-flex items-center gap-3 text-[#E0E0E0] transition hover:text-white">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] backdrop-blur-sm transition hover:border-[#1E88E5]/30">
                            <ApplicationLogo className="h-8 w-8 fill-current text-white" />
                        </span>
                        <span className="text-2xl font-semibold tracking-tight">PixelVault</span>
                    </Link>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-[#E0E0E0] sm:text-5xl">
                            Lưu trữ khoảnh khắc của bạn với giao diện hoàn toàn mới
                        </h1>
                        <p className="text-lg text-[#B0B0B0]">
                            Sắp xếp, bảo vệ và chia sẻ bộ sưu tập ảnh của bạn trên một không gian hiện đại, đầy cảm
                            hứng.
                        </p>
                    </div>

                    <div className="grid gap-4 text-left sm:grid-cols-2">
                        <Feature
                            icon={<Sparkles className="h-4 w-4" />}
                            label="Trải nghiệm tinh gọn"
                            description="Bố cục trực quan, thao tác nhanh chóng."
                        />
                        <Feature
                            icon={<ShieldCheck className="h-4 w-4" />}
                            label="Bảo mật vượt trội"
                            description="Mã hóa và bảo vệ dữ liệu của bạn."
                        />
                        <Feature
                            icon={<Cloud className="h-4 w-4" />}
                            label="Đồng bộ mượt mà"
                            description="Sẵn sàng ở mọi thiết bị bạn dùng."
                        />
                        <Feature
                            icon={<Camera className="h-4 w-4" />}
                            label="Tối ưu cho ảnh"
                            description="Hiển thị sắc nét và động mượt mà."
                        />
                    </div>
                </div>

                <Card className="relative w-full max-w-md overflow-hidden rounded-xl border-[#2A2A2A] bg-[#1E1E1E] p-8 shadow-2xl backdrop-blur-xl transition hover:border-[#1E88E5]/20 hover:bg-[#252525]">
                    <div className="absolute -top-32 right-10 h-56 w-56 rounded-full bg-[#1E88E5]/10 blur-3xl" />
                    <div className="absolute -bottom-24 left-0 h-48 w-48 rounded-full bg-[#1E88E5]/8 blur-3xl" />
                    <div className="relative z-10 space-y-6">{children}</div>
                </Card>
            </div>
        </div>
    );
}

function Feature({
    icon,
    label,
    description,
}: {
    icon: ReactNode;
    label: string;
    description: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-4 backdrop-blur-sm transition hover:border-[#1E88E5]/20 hover:bg-[#252525]">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E88E5]/10 text-[#1E88E5]">
                {icon}
            </span>
            <div>
                <p className="text-sm font-semibold text-[#E0E0E0]">{label}</p>
                <p className="text-xs text-[#B0B0B0]">{description}</p>
            </div>
        </div>
    );
}
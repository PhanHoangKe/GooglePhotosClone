import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps, Photo } from '@/types';
import { ReactNode, useMemo, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import UploadModal from '@/Components/Photo/UploadModal';
import PhotoCard from '@/Components/Photo/PhotoCard';
import { ArrowUpRight, CloudRain, HardDrive, Image as ImageIcon, Upload, Wand2 } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';

interface DashboardProps extends PageProps {
    photos: Photo[];
}

const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function Dashboard() {
    const { auth, photos } = usePage<DashboardProps>().props;
    const user = auth.user;
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const used = user.storage_used || 0;
    const limit = user.storage_limit || 5 * 1024 * 1024 * 1024;
    const percentage = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

    const recentPhotos = useMemo(() => photos.slice(0, 6), [photos]);

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                        <p className="text-sm uppercase tracking-[0.35rem] text-white/50">Xin chào, {user.name}</p>
                        <h2 className="text-3xl font-semibold text-white md:text-4xl">Thư viện của bạn hôm nay</h2>
                        <p className="text-sm leading-relaxed text-white/70">
                            Theo dõi dung lượng, tải ảnh mới và khám phá bộ sưu tập của bạn
                        </p>
                    </div>
                    <Button
                        className="group w-full rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-400 hover:via-indigo-400 hover:to-purple-400 hover:shadow-xl hover:shadow-sky-500/40 lg:w-auto"
                        onClick={() => setIsUploadModalOpen(true)}
                    >
                        <Upload className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                        Tải ảnh ngay
                    </Button>
                </div>
            }
        >
            <Head title="Dashboard" />

            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />

            <div className="space-y-8">
                {/* Stats Section - Cải thiện layout */}
                <section className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
                    {/* Main Stats Card */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/[0.03] p-8 shadow-xl backdrop-blur">
                        <div className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
                        <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-sky-500/20 to-indigo-500/20">
                                    <Wand2 className="h-6 w-6 text-sky-300" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white">Tổng quan thư viện</h3>
                                    <p className="mt-1 text-sm text-white/60">
                                        Giao diện PixelVault mới mang đến trải nghiệm trực quan hơn bao giờ hết
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <StatCard
                                    label="Tổng số ảnh"
                                    value={photos.length}
                                    icon={<ImageIcon className="h-5 w-5" />}
                                    color="sky"
                                />
                                <StatCard
                                    label="Dung lượng đã dùng"
                                    value={formatBytes(used)}
                                    icon={<HardDrive className="h-5 w-5" />}
                                    color="indigo"
                                />
                                <StatCard
                                    label="Dung lượng còn lại"
                                    value={formatBytes(limit - used)}
                                    icon={<CloudRain className="h-5 w-5" />}
                                    color="purple"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Storage Card - Compact và rõ ràng */}
                    <Card className="flex flex-col rounded-3xl border-white/10 bg-white/5 text-white backdrop-blur">
                        <CardHeader className="space-y-3 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-white">Dung lượng sử dụng</CardTitle>
                                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                    {percentage}%
                                </span>
                            </div>
                            <CardDescription className="text-xs text-white/60">
                                Giới hạn: {formatBytes(limit)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <Progress value={percentage} className="h-2.5 rounded-full bg-white/10" />
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-white/60">Đã dùng</p>
                                    <p className="mt-1 text-sm font-semibold text-white">{formatBytes(used)}</p>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-white/60">Còn lại</p>
                                    <p className="mt-1 text-sm font-semibold text-white">{formatBytes(Math.max(0, limit - used))}</p>
                                </div>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 p-3 text-xs text-white/70">
                                💡 Mẹo: Dọn dẹp ảnh trùng để tiết kiệm dung lượng
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Photos Section - Layout cải thiện */}
                <section className="grid gap-6 lg:grid-cols-[1fr,20rem]">
                    <Card className="rounded-3xl border-white/10 bg-white/5 text-white backdrop-blur">
                        <CardHeader className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="text-xl font-semibold text-white">
                                    Thư viện ảnh
                                </CardTitle>
                                <CardDescription className="mt-1 text-sm text-white/60">
                                    {photos.length} ảnh · Sắp xếp theo thời gian tải lên
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                className="rounded-xl border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/20"
                                onClick={() => setIsUploadModalOpen(true)}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Thêm ảnh
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {photos.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                    {photos.map((photo) => (
                                        <PhotoCard key={photo.id} photo={photo} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 p-16 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                                        <ImageIcon className="h-8 w-8 text-white/40" />
                                    </div>
                                    <p className="mb-2 text-sm font-medium text-white">Chưa có ảnh nào</p>
                                    <p className="mb-4 text-xs text-white/60">Bắt đầu xây dựng thư viện của bạn</p>
                                    <Button
                                        variant="link"
                                        className="text-sky-300 hover:text-sky-200"
                                        onClick={() => setIsUploadModalOpen(true)}
                                    >
                                        Tải ảnh đầu tiên →
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activity Sidebar */}
                    <Card className="flex h-fit flex-col rounded-3xl border-white/10 bg-white/5 text-white backdrop-blur">
                        <CardHeader className="space-y-2 border-b border-white/10 pb-4">
                            <CardTitle className="text-lg font-semibold text-white">Hoạt động gần đây</CardTitle>
                            <CardDescription className="text-xs text-white/60">
                                {recentPhotos.length} ảnh mới nhất
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            {recentPhotos.length > 0 ? (
                                recentPhotos.map((photo) => (
                                    <div
                                        key={photo.id}
                                        className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10"
                                    >
                                        <img
                                            src={photo.path}
                                            alt={photo.original_filename ?? photo.filename}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <p className="truncate text-xs font-medium text-white">
                                                {photo.original_filename ?? photo.filename}
                                            </p>
                                            <p className="text-[11px] text-white/50">{formatBytes(photo.file_size)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="py-8 text-center text-sm text-white/60">Chưa có hoạt động</p>
                            )}
                        </CardContent>
                        <Separator className="border-white/10" />
                        <CardContent className="pt-4">
                            <div className="rounded-xl border border-white/10 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 p-4 text-xs text-white/70">
                                <p className="mb-1 font-semibold text-white">💡 Mẹo nhanh</p>
                                <p>Kéo thả nhiều ảnh cùng lúc để tải nhanh hơn</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({
    label,
    value,
    icon,
    color = 'sky',
}: {
    label: string;
    value: number | string;
    icon: ReactNode;
    color?: 'sky' | 'indigo' | 'purple';
}) {
    const colorClasses = {
        sky: 'from-sky-500/20 to-sky-500/5 text-sky-300',
        indigo: 'from-indigo-500/20 to-indigo-500/5 text-indigo-300',
        purple: 'from-purple-500/20 to-purple-500/5 text-purple-300',
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-50`} />
            <div className="relative z-10 space-y-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-white/60">{label}</p>
                    <p className="mt-1 text-2xl font-bold text-white">{value}</p>
                </div>
            </div>
        </div>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { format } from 'date-fns';
import { ArrowRight, Image as ImageIcon, Plus } from 'lucide-react';

interface AlbumResource {
    id: number;
    name: string;
    description: string | null;
    photos_count: number;
    created_at: string | null;
    cover_photo: {
        id: number;
        file_path: string;
    } | null;
}

type AlbumsPageProps = PageProps<{ albums: AlbumResource[] }>;

export default function AlbumsIndex() {
    const { auth, albums } = usePage<AlbumsPageProps>().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2">
                            <ImageIcon className="h-4 w-4 text-blue-300" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                                Bộ sưu tập
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-[#E0E0E0]">
                            Albums của bạn
                        </h2>
                        <p className="text-base text-[#B0B0B0]">
                            Tổng cộng {albums.length} albums
                        </p>
                    </div>

                    <Button
                        asChild
                        className="group relative h-11 overflow-hidden rounded-lg bg-[#1E88E5] px-5 text-sm font-semibold text-white shadow-lg shadow-[#1E88E5]/30 transition-all duration-300 hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1E88E5]/40 hover:scale-[1.01] active:scale-[0.99]"
                    >
                        <Link href={route('photos.index')}>
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Plus className="h-4 w-4" /> Tạo album mới
                            </span>
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title="Albums" />

            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tl from-blue-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="relative z-10 space-y-6">
                {albums.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {albums.map((album) => (
                            <Card
                                key={album.id}
                                className="group cursor-pointer overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] text-[#E0E0E0] backdrop-blur transition-all duration-300 hover:border-[#1E88E5]/30 hover:bg-[#252525] hover:shadow-2xl hover:shadow-black/50"
                            >
                                <Link href={route('albums.show', album.id)}>
                                    <div className="relative aspect-square overflow-hidden bg-[#252525]">
                                        {album.cover_photo ? (
                                            <img
                                                src={album.cover_photo.file_path}
                                                alt={album.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <ImageIcon className="h-12 w-12 text-[#757575]" />
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader className="p-3">
                                        <CardTitle className="truncate text-sm font-semibold text-[#E0E0E0]">
                                            {album.name}
                                        </CardTitle>
                                        {album.description && (
                                            <CardDescription className="truncate text-xs text-[#B0B0B0]">
                                                {album.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardFooter className="p-3 pt-0">
                                        <p className="text-xs text-[#B0B0B0]">
                                            {album.photos_count} ảnh
                                        </p>
                                    </CardFooter>
                                </Link>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2A2A2A] bg-[#1E1E1E]/50 p-16 text-center text-[#B0B0B0]">
                        <ImageIcon className="mb-4 h-12 w-12 text-[#757575]" />
                        <p className="mb-2 text-sm font-medium text-[#E0E0E0]">
                            Chưa có album nào
                        </p>
                        <p className="mb-4 text-xs text-[#757575]">
                            Tạo album đầu tiên để sắp xếp ảnh của bạn
                        </p>
                        <Button
                            asChild
                            className="group relative h-11 overflow-hidden rounded-lg bg-[#1E88E5] px-5 text-sm font-semibold text-white shadow-lg shadow-[#1E88E5]/30 transition-all duration-300 hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1E88E5]/40 hover:scale-[1.01] active:scale-[0.99]"
                        >
                            <Link href={route('photos.index')}>
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Plus className="h-4 w-4" /> Tạo album
                                </span>
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
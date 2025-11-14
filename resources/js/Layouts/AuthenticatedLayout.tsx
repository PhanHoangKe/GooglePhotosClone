import { PropsWithChildren, ReactNode, useMemo, useState } from 'react';
import { User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import UploadModal from '@/Components/Photo/UploadModal';
import { Home, Image as ImageIcon, Layers, LogOut, Settings, Upload, User as UserIcon, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import ApplicationLogo from '@/Components/ApplicationLogo';

interface AuthenticatedLayoutProps extends PropsWithChildren {
    user: User;
    header: ReactNode;
}

const getInitials = (name: string) =>
    name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

export default function AuthenticatedLayout({ user, header, children }: AuthenticatedLayoutProps) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const { component } = usePage();

    const avatarSrc = user.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${user.name}&background=random`;

    const navigation = useMemo(
        () => [
            {
                label: 'Tổng quan',
                href: route('dashboard'),
                icon: <Home className="h-4 w-4" />,
                match: ['Dashboard'],
            },
            {
                label: 'Thư viện ảnh',
                href: route('photos.index'),
                icon: <ImageIcon className="h-4 w-4" />,
                match: ['Photos/Index'],
            },
            {
                label: 'Album',
                href: route('albums.index'),
                icon: <Layers className="h-4 w-4" />,
                match: ['Albums/Index', 'Albums/Show'],
            },
            {
                label: 'Hồ sơ cá nhân',
                href: route('profile.edit'),
                icon: <UserCog className="h-4 w-4" />,
                match: ['Profile/Edit'],
            },
        ],
        [],
    );

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#101010] text-[#E0E0E0]">
            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />

            <nav className="sticky top-0 z-50 border-b border-[#2A2A2A] bg-[#101010]/80 backdrop-blur-lg">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
                    <div className="flex items-center gap-10">
                        <Link href={route('dashboard')} className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] text-white">
                                <ApplicationLogo className="h-7 w-7 fill-current" />
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-[0.35rem] text-[#B0B0B0]">PixelVault</p>
                                <p className="text-lg font-semibold text-[#E0E0E0]">Không gian ảnh của bạn</p>
                            </div>
                        </Link>

                        <div className="hidden items-center gap-1 rounded-2xl border border-[#2A2A2A] bg-[#1E1E1E] p-1 lg:flex">
                            {navigation.map((item) => {
                                const active = item.match.includes(component);
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E88E5]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E1E]',
                                            active
                                                ? 'bg-[#1E88E5] text-white shadow-lg shadow-[#1E88E5]/20'
                                                : 'text-[#B0B0B0] hover:text-[#E0E0E0] hover:bg-[#2A2A2A]',
                                        )}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="default"
                            className="group relative hidden h-11 items-center gap-2 overflow-hidden rounded-lg bg-[#1E88E5] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#1E88E5]/30 transition-all duration-300 hover:bg-[#1565C0] hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] sm:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E88E5]/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101010]"
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            <Upload className="h-4 w-4" />
                            Tải ảnh lên
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#1E1E1E] px-3 py-1.5 text-left transition-all hover:border-[#424242] hover:bg-[#252525] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E88E5]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101010]">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={avatarSrc} alt={user.name} />
                                        <AvatarFallback className="bg-[#1E88E5] font-semibold text-white">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden text-sm sm:block">
                                        <p className="font-medium text-[#E0E0E0]">{user.name}</p>
                                        <p className="text-xs text-[#B0B0B0]">{user.email}</p>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 rounded-xl border border-[#2A2A2A] bg-[#252525] text-[#E0E0E0] shadow-lg">
                                <DropdownMenuLabel className="border-b border-[#2A2A2A] pb-3">
                                    <p className="text-sm font-semibold">{user.name}</p>
                                    <p className="text-xs text-[#B0B0B0]">{user.email}</p>
                                </DropdownMenuLabel>

                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer hover:!bg-[#1E88E5]/20"
                                    >
                                        <Link href={route('profile.edit')} className="flex w-full items-center gap-2">
                                            <UserIcon className="h-4 w-4" />
                                            Hồ sơ cá nhân
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator className="bg-[#2A2A2A]" />

                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer hover:!bg-red-500/10 hover:!text-red-400"
                                >
                                    <Link
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        className="flex w-full items-center gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Đăng xuất
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>

            <div className="relative z-10">
                {header && (
                    <header className="mx-auto max-w-7xl px-6 pt-12 sm:px-8">
                        {header}
                    </header>
                )}

                <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 sm:px-8">{children}</main>
            </div>
        </div>
    );
}
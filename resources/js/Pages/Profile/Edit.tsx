import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import UpdateAvatarForm from '@/Components/Profile/UpdateAvatarForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.35rem] text-[#757575]">Cài đặt tài khoản</p>
                    <h2 className="text-3xl font-semibold text-[#E0E0E0] md:text-4xl">Tùy chỉnh hồ sơ PixelVault</h2>
                    <p className="text-sm text-[#B0B0B0]">
                        Quản lý thông tin cá nhân, bảo mật và dữ liệu của bạn chỉ trong vài thao tác.
                    </p>
                </div>
            }
        >
            <Head title="Hồ sơ cá nhân" />

            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-6 text-[#E0E0E0] backdrop-blur">
                        <UpdateAvatarForm />
                    </div>

                    <div className="lg:col-span-3 rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-6 text-[#E0E0E0] backdrop-blur">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="space-y-6"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-6 text-[#E0E0E0] backdrop-blur">
                        <UpdatePasswordForm className="space-y-6" />
                    </div>

                    <div className="rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-6 text-[#E0E0E0] backdrop-blur">
                        <DeleteUserForm className="space-y-6" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
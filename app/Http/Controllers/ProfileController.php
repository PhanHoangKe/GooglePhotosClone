<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,jpg,gif'], 
            ], [
                'avatar.image' => 'File tải lên phải là hình ảnh.',
                'avatar.max' => 'Ảnh đại diện không được vượt quá 2MB.',
            ]);

            $avatarFile = $request->file('avatar');
            $fileName = time() . '_' . $avatarFile->getClientOriginalName();

            $path = $avatarFile->storeAs('public/avatars', $fileName);
            $newAvatarPath = Storage::url($path);

            if ($user->avatar) { 
                $oldPath = str_replace(Storage::url(''), 'public/', $user->avatar); 
                Storage::delete($oldPath);
            }

            $user->avatar = $newAvatarPath; 
        }

        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        $user->save(); 

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}

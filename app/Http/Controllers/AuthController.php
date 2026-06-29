<?php

namespace App\Http\Controllers;

use App\Models\Pengguna;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function registerSiswa(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nisn' => ['required', 'string', 'max:30', 'unique:pengguna,nisn'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'nisn.required' => 'NISN wajib diisi.',
            'nisn.unique' => 'NISN sudah digunakan.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak sesuai.',
        ]);

        $Pengguna = Pengguna::create([
            'name' => $validated['name'],
            'nisn' => $validated['nisn'],
            'nip' => null,
            'email' => null,
            'phone' => null,
            'password' => Hash::make($validated['password']),
            'role' => Pengguna::ROLE_SISWA,
            'status' => 'active',
            'last_login_at' => now(),
        ]);

        Auth::login($Pengguna);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Registrasi siswa berhasil.',
            'data' => [
                'token' => null,
                'user' => $this->serializeUser($Pengguna),
            ],
            'user' => $this->serializeUser($Pengguna),
            'redirect' => '/siswa/dashboard',
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'role' => ['nullable', Rule::in([Pengguna::ROLE_SISWA, Pengguna::ROLE_GURU])],
            'email' => ['nullable', 'email'],
            'nisn' => ['nullable', 'string'],
            'nip' => ['nullable', 'string'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data login tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = $request->string('email')->trim()->toString();
        $role = $request->string('role')->toString();
        $password = $request->string('password')->toString();

        if ($email !== '') {
            $credentials = [
                'email' => $email,
                'password' => $password,
            ];
        } elseif ($role === Pengguna::ROLE_SISWA && $request->filled('nisn')) {
            $credentials = [
                'nisn' => $request->string('nisn')->toString(),
                'password' => $password,
                'role' => Pengguna::ROLE_SISWA,
            ];
        } elseif ($role === Pengguna::ROLE_GURU && $request->filled('nip')) {
            $credentials = [
                'nip' => $request->string('nip')->toString(),
                'password' => $password,
                'role' => Pengguna::ROLE_GURU,
            ];
        } else {
            return response()->json([
                'message' => 'Email dan password wajib diisi.',
                'errors' => [
                    'email' => ['Email wajib diisi.'],
                ],
            ], 422);
        }

        if (! Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Kredensial login tidak sesuai.',
            ], 422);
        }

        $request->session()->regenerate();
        /** @var \App\Models\Pengguna $Pengguna */
        $Pengguna = $request->user();
        $Pengguna->forceFill(['last_login_at' => now()])->save();

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'token' => null,
                'user' => $this->serializeUser($Pengguna),
            ],
            'user' => $this->serializeUser($Pengguna),
            'redirect' => $Pengguna->isGuru() ? '/guru/dashboard' : '/siswa/dashboard',
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        /** @var Pengguna $Pengguna */
        $Pengguna = $request->user();

        return response()->json($this->serializeUser($Pengguna));
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink([
            'email' => $validated['email'],
        ]);

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'message' => 'Link reset password telah dikirim ke email Anda.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $status = Password::reset(
            $validated,
            function (Pengguna $Pengguna, string $password): void {
                $Pengguna->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($Pengguna));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'message' => 'Password berhasil diperbarui.',
            'redirect' => '/login',
        ]);
    }

    private function serializeUser(Pengguna $Pengguna): array
    {
        return [
            'id' => $Pengguna->id,
            'name' => $Pengguna->name,
            'email' => $Pengguna->email,
            'phone' => $Pengguna->phone,
            'nisn' => $Pengguna->nisn,
            'nip' => $Pengguna->nip,
            'role' => $Pengguna->role,
        ];
    }
}

<?php
//Api/AuthController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    // POST /api/register
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'phone'    => 'required|string|max:20',
            'role'     => 'required|string|max:255',
            'address'  => 'nullable|string|max:500',
            'photo'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // អតិបរមា 2MB
            'password' => 'required|string|min:6|confirmed', // ទាមទារ password_confirmation
            'status'   => 'nullable|string',
            'permissions' => 'nullable|array', // 💡 បន្ថែមការ validate សម្រាប់ permissions ពេលចុះឈ្មោះ
        ]);

        // ដំណើរការ Upload រូបភាព (បើមាន)
        $photoUrl = null;
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('users', 'public');
            $photoUrl = asset('storage/' . $path);
        }

        // បង្កើត User ថ្មី
        $user = User::create([
            'name'        => $validated['name'],
            'email'       => $validated['email'],
            'phone'       => $validated['phone'],
            'role'        => $validated['role'],
            'address'     => $validated['address'] ?? null,
            'photo'       => $photoUrl,
            'password'    => Hash::make($validated['password']),
            'status'      => $validated['status'] ?? 'Active', // កំណត់តម្លៃលំនាំដើម Active បើគ្មានផ្ញើមក
            'permissions' => $validated['permissions'] ?? [], // រក្សាទុក permissions ចូល MongoDB
        ]);

        // បង្កើត Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'បង្កើតគណនីជោគជ័យ!',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user
        ], 201);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->_id, '_id')
            ],
            'phone'    => 'required|string|max:20',
            'address'  => 'nullable|string|max:500',
            'photo'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        // Update រូបថត ប្រសិនបើមាន Upload រូបថ្មី
        if ($request->hasFile('photo')) {
            if ($user->photo) {
                $oldPath = str_replace(asset('storage/'), '', $user->photo);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('photo')->store('users', 'public');
            $user->photo = asset('storage/' . $path);
        }

        $user->name    = $validated['name'];
        $user->email   = $validated['email'];
        $user->phone   = $validated['phone'];
        $user->address = $validated['address'] ?? null;

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានជោគជ័យ!',
            'user'    => $user
        ], 200);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ], [
            'current_password.required' => 'សូមបញ្ជូលលេខសម្ងាត់ចាស់!',
            'password.required' => 'សូមបញ្ជូលលេខសម្ងាត់ថ្មី!',
            'password.confirmed' => 'ការផ្ទៀងផ្ទាត់លេខសម្ងាត់មិនត្រូវគ្នាទេ!',
        ]);

        $user = $request->user();

        // ផ្ទៀងផ្ទាត់លេខសម្ងាត់ចាស់
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'លេខសម្ងាត់ចាស់មិនត្រឹមត្រូវទេ!'
            ], 400);
        }

        // ធ្វើបច្ចុប្បន្នភាពលេខសម្ងាត់ថ្មី
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => 'ផ្លាស់ប្តូរលេខសម្ងាត់ជោគជ័យ!'
        ], 200);
    }

    // 1. GET /api/users (ទាញយកបញ្ជី Users ទាំងអស់)
    public function getUsers(Request $request)
    {
        $query = User::query();

        // Search តាម name, email, phone (បើមាន)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter តាម Role (បើមាន)
        if ($request->has('role') && $request->role != 'All') {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data'   => $users
        ], 200);
    }

    // 2. PUT /api/users/{id} (កែប្រែទិន្នន័យ User និង Permissions)
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'រកមិនឃើញអ្នកប្រើប្រាស់នេះទេ!'], 404);
        }

        // ពិនិត្យ Email ស្ទួន manually ដើម្បីការពារ Error 500
        if ($request->has('email') && $request->email !== $user->email) {
            $emailExists = User::where('email', $request->email)
                ->where('_id', '!=', $id)
                ->exists();
            if ($emailExists) {
                return response()->json([
                    'errors' => ['email' => ['អ៊ីមែលនេះមានគេប្រើប្រាស់រួចហើយ!']]
                ], 422);
            }
        }

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|string|email|max:255',
            'phone'       => 'nullable|string|max:20',
            'role'        => 'nullable|string|max:255',
            'status'      => 'nullable|string',
            'address'     => 'nullable|string|max:500',
            'permissions' => 'nullable|array', // អនុញ្ញាតទិន្នន័យ permissions ជា array/object
        ]);

        // អាប់ដេតទិន្នន័យទាំងអស់រួមទាំង permissions ចូល MongoDB
        $user->update($validated);

        return response()->json([
            'message' => 'ធ្វើបច្ចុប្បន្នភាពជោគជ័យ!',
            'data'    => $user
        ], 200);
    }

    // 3. DELETE /api/users/{id} (លុប User)
    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'រកមិនឃើញអ្នកប្រើប្រាស់នេះទេ!'], 404);
        }

        // លុបរូបថតចេញពី Storage បើមាន
        if ($user->photo) {
            $oldPath = str_replace(asset('storage/'), '', $user->photo);
            Storage::disk('public')->delete($oldPath);
        }

        $user->delete();

        return response()->json([
            'message' => 'លុបអ្នកប្រើប្រាស់ជោគជ័យ!'
        ], 200);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email ឬ លេខសម្ងាត់មិនត្រឹមត្រូវ'], 401);
        }

        // ពិនិត្យមើល Status
        $status = strtolower($user->status ?? '');

        if ($status !== 'active') {
            return response()->json([
                'message' => 'គណនីរបស់អ្នកមិនទាន់សកម្ម (Inactive) ឬគ្មាន Status ឡើយ! សូមទាក់ទង Admin។'
            ], 403);
        }

        // បង្កើត Token ប្រសិនបើ Active
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 200);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }
}

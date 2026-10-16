<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserPermisstion;
use Illuminate\Http\Request;

class UserPermisstionController extends Controller
{
    // 1. បង្ហាញបញ្ជីសិទ្ធិទាំងអស់ (List All Permissions)
    public function index()
    {
        // ប្រើ latest()->get() ដើម្បី Sort តាម created_at ពីថ្មីទៅចាស់
        $permissions = UserPermisstion::latest()->get();
        return response()->json([
            'success' => true,
            'data'    => $permissions
        ], 200);
    }

    // 2. បន្ថែមសិទ្ធិថ្មី (Store New Permission)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'path'        => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status'      => 'nullable|string|max:50',
        ]);

        $permission = UserPermisstion::create($validated);

        return response()->json([
            'message' => 'បង្កើតសិទ្ធិថ្មីបានជោគជ័យ!',
            'data'    => $permission
        ], 201);
    }

    // 3. បង្ហាញព័ត៌មានលម្អិតនៃសិទ្ធិមួយ (Show Single Permission)
    public function show($id)
    {
        $permission = UserPermisstion::find($id);

        if (!$permission) {
            return response()->json([
                'message' => 'រកមិនឃើញសិទ្ធិប្រព័ន្ធនេះទេ!'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $permission
        ], 200);
    }

    // 4. កែប្រែសិទ្ធិ (Update Permission)
    public function update(Request $request, $id)
    {
        $permission = UserPermisstion::find($id);

        if (!$permission) {
            return response()->json([
                'message' => 'រកមិនឃើញសិទ្ធិប្រព័ន្ធនេះទេ!'
            ], 404);
        }

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'path'        => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status'      => 'nullable|string|max:50',
        ]);

        $permission->update($validated);

        return response()->json([
            'message' => 'ធ្វើបច្ចុប្បន្នភាពសិទ្ធិបានជោគជ័យ!',
            'data'    => $permission
        ], 200);
    }

    // 5. លុបសិទ្ធិ (Delete Permission)
    public function destroy($id)
    {
        $permission = UserPermisstion::find($id);

        if (!$permission) {
            return response()->json([
                'message' => 'រកមិនឃើញសិទ្ធិប្រព័ន្ធនេះទេ!'
            ], 404);
        }

        $permission->delete();

        return response()->json([
            'message' => 'លុបសិទ្ធិប្រព័ន្ធបានជោគជ័យ!'
        ], 200);
    }
}

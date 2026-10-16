<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserRoleController extends Controller
{
    // List All Roles
    public function index()
    {
        $roles = UserRole::latest()->get();
        return response()->json($roles, 200);
    }

    // Add New Role
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'position'    => 'nullable|string|max:255',
            'path_name'   => 'nullable|string|max:255',
            'photo'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('user_roles', 'public');
            $validated['photo'] = Storage::url($path);
        }

        $role = UserRole::create($validated);
        return response()->json($role, 201);
    }

    // Show Single Role Details
    public function show($id)
    {
        $role = UserRole::findOrFail($id);
        return response()->json($role, 200);
    }

    // Update Role
    public function update(Request $request, $id)
    {
        $role = UserRole::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'position'    => 'nullable|string|max:255',
            'path_name'   => 'nullable|string|max:255',
            'photo'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($role->photo) {
                $oldPath = str_replace('/storage/', '', $role->photo);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('photo')->store('user_roles', 'public');
            $validated['photo'] = Storage::url($path);
        }

        $role->update($validated);
        return response()->json($role, 200);
    }

    // Delete Role
    public function destroy($id)
    {
        $role = UserRole::findOrFail($id);

        if ($role->photo) {
            $oldPath = str_replace('/storage/', '', $role->photo);
            Storage::disk('public')->delete($oldPath);
        }

        $role->delete();
        return response()->json(['message' => 'Role deleted successfully'], 200);
    }
}

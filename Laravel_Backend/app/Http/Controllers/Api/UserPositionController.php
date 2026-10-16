<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\UserPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserPositionController extends Controller
{
    public function index()
    {
        // $roles = UserPosition::all();

        // 💡 ប្រើ latest()->get() ដើម្បី Sort តាម created_at ពីថ្មីទៅចាស់
        $roles = UserPosition::latest()->get();
        return response()->json($roles, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'photo'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'start_time'  => 'required',
            'end_time'    => 'required',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('user_roles', 'public');
            $validated['photo'] = Storage::url($path);
        }

        $role = UserPosition::create($validated);
        return response()->json($role, 201);
    }

    // Show Single Role Details
    public function show($id)
    {
        $role = UserPosition::findOrFail($id);
        return response()->json($role, 200);
    }

    // Update Role
    public function update(Request $request, $id)
    {
        $role = UserPosition::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'photo'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'start_time'  => 'required',
            'end_time'    => 'required',
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
        $role = UserPosition::findOrFail($id);

        if ($role->photo) {
            $oldPath = str_replace('/storage/', '', $role->photo);
            Storage::disk('public')->delete($oldPath);
        }

        $role->delete();
        return response()->json(['message' => 'Role deleted successfully'], 200);
    }
}

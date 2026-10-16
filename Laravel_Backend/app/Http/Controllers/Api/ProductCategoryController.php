<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductCategoryController extends Controller
{
    // List All categorys
    public function index()
    {
        // $categorys = ProductCategory::all();

        // 💡 ប្រើ latest()->get() ដើម្បី Sort តាម created_at ពីថ្មីទៅចាស់
        $categorys = ProductCategory::latest()->get();
        return response()->json($categorys, 200);
    }

    // Add New Role
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'photo'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('product_categorys', 'public');
            $validated['photo'] = Storage::url($path);
        }

        $role = ProductCategory::create($validated);
        return response()->json($role, 201);
    }

    // Show Single Role Details
    public function show($id)
    {
        $role = ProductCategory::findOrFail($id);
        return response()->json($role, 200);
    }

    // Update Role
    public function update(Request $request, $id)
    {
        $role = ProductCategory::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'photo'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($role->photo) {
                $oldPath = str_replace('/storage/', '', $role->photo);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('photo')->store('product_categorys', 'public');
            $validated['photo'] = Storage::url($path);
        }

        $role->update($validated);
        return response()->json($role, 200);
    }

    // Delete Role
    public function destroy($id)
    {
        $role = ProductCategory::findOrFail($id);

        if ($role->photo) {
            $oldPath = str_replace('/storage/', '', $role->photo);
            Storage::disk('public')->delete($oldPath);
        }

        $role->delete();
        return response()->json(['message' => 'Role deleted successfully'], 200);
    }
}

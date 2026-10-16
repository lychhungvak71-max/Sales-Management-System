<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // List All Products
    public function index()
    {
        // $Products = Product::all();

        // 💡 ប្រើ latest()->get() ដើម្បី Sort តាម created_at ពីថ្មីទៅចាស់
        $Products = Product::latest()->get();
        return response()->json($Products, 200);
    }

    // Add New Role
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description'    => 'nullable|string',
            'category_id'    => 'nullable|string|max:255',
            'category_name'  => 'nullable|string|max:255',
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'stock'          => 'required|integer|min:0',
            'photo'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            // 'category_id'    => 'required|exists:product_categories,id', // ឬ ប្រើប្រភេទ Table របស់អ្នក
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('products', 'public');
            $validated['photo'] = Storage::url($path);
        }

        $role = Product::create($validated);
        return response()->json($role, 201);
    }

    // Show Single Role Details
    public function show($id)
    {
        $role = Product::findOrFail($id);
        return response()->json($role, 200);
    }

    // Update Role
    public function update(Request $request, $id)
    {
        $role = Product::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description'    => 'nullable|string',
            'category_id'    => 'nullable|string|max:255',
            'category_name'  => 'nullable|string|max:255',
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'stock'          => 'required|integer|min:0',
            'photo'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($role->photo) {
                $oldPath = str_replace('/storage/', '', $role->photo);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('photo')->store('products', 'public');
            $validated['photo'] = Storage::url($path);
        }

        $role->update($validated);
        return response()->json($role, 200);
    }

    // Delete Role
    public function destroy($id)
    {
        $role = Product::findOrFail($id);

        if ($role->photo) {
            $oldPath = str_replace('/storage/', '', $role->photo);
            Storage::disk('public')->delete($oldPath);
        }

        $role->delete();
        return response()->json(['message' => 'Role deleted successfully'], 200);
    }
}

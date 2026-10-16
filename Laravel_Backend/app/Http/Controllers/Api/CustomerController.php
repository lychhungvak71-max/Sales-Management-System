<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    // ទាញយកបញ្ជី Customer ទាំងអស់
    public function index()
    {
        try {
            $customers = Customer::all();
            return response()->json([
                'success' => true,
                'data' => $customers
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'មិនអាចទាញយកទិន្នន័យអតិថិជនបានទេ: ' . $e->getMessage()
            ], 500);
        }
    }

    // បញ្ចូល Customer ថ្មី (Store)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'gender' => 'nullable|in:Male,Female,Other', // ឬ ស្រី, ប្រុស, ភេទទី៣
            'email' => 'nullable|email',
            'phone' => 'required|string',
            'address' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_id' => 'nullable|string',
            'category_name' => 'nullable|string',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->except('photo');

            // កំណត់តម្លៃដើមសម្រាប់ field ស្ថិតិបញ្ជាទិញ
            $data['total_order_completed'] = 0;
            $data['total_order_cancel'] = 0;

            // គ្រប់គ្រងការផ្ទុកឡើងរូបភាព (Handle Image Upload)
            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('customers', 'public');
                $data['photo'] = '/storage/' . $path;
            }

            $customer = Customer::create($data);

            return response()->json([
                'success' => true,
                'message' => 'បានបន្ថែមអតិថិជនថ្មីដោយជោគជ័យ!',
                'data' => $customer
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'មានបញ្ហាក្នុងការបន្ថែម: ' . $e->getMessage()
            ], 500);
        }
    }

    // កែប្រែព័ត៌មាន Customer (Update)
    public function update(Request $request, $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'រកមិនឃើញអតិថិជននេះទេ!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'gender' => 'nullable|in:Male,Female,Other', // ឬ ស្រី, ប្រុស, ភេទទី៣
            'email' => 'nullable|email',
            'phone' => 'required|string',
            'address' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_id' => 'nullable|string',
            'category_name' => 'nullable|string',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->except('photo');

            // ជំនួសរូបភាពថ្មី ប្រសិនបើមាន Upload មក
            if ($request->hasFile('photo')) {
                // លុបរូបភាពចាស់ចេញពី Storage ប្រសិនបើមាន
                if ($customer->photo && str_starts_with($customer->photo, '/storage/')) {
                    $oldPath = str_replace('/storage/', '', $customer->photo);
                    Storage::disk('public')->delete($oldPath);
                }

                $path = $request->file('photo')->store('customers', 'public');
                $data['photo'] = '/storage/' . $path;
            }

            $customer->update($data);

            return response()->json([
                'success' => true,
                'message' => 'បានកែប្រែព័ត៌មានអតិថិជនដោយជោគជ័យ!',
                'data' => $customer
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'មានបញ្ហាក្នុងការកែប្រែ: ' . $e->getMessage()
            ], 500);
        }
    }

    // លុប Customer (Destroy)
    public function destroy($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'រកមិនឃើញអតិថិជននេះទេ!'
            ], 404);
        }

        try {
            // លុបរូបភាពចេញពី Storage ពេលលុប Profile
            if ($customer->photo && str_starts_with($customer->photo, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $customer->photo);
                Storage::disk('public')->delete($oldPath);
            }

            $customer->delete();

            return response()->json([
                'success' => true,
                'message' => 'បានលុបអតិថិជនដោយជោគជ័យ!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'មិនអាចលុបទិន្នន័យបានទេ: ' . $e->getMessage()
            ], 500);
        }
    }
}

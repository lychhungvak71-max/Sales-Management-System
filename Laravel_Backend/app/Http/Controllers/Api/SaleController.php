<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    // GET /api/sales (ជាមួយ Search, Filter & Pagination)
    public function index(Request $request)
    {
        $query = Sale::query();

        // Search តាមឈ្មោះអតិថិជន ឬ ទំនិញ
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                    ->orWhere('product_name', 'like', "%{$search}%");
            });
        }

        // Filter តាម Status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        $sales = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($sales, 200);
    }

    // public function index()
    // {
    //     // Dummy Data សម្រាប់ Test (អ្នកអាចដូរទៅទាញចេញពី Database បាន: Sale::all())
    //     $sales = [
    //         [
    //             'id' => 1,
    //             'customer_name' => 'សុខ ជា',
    //             'item_name' => 'Coca Cola',
    //             'quantity' => 2,
    //             'total_price' => 2.50,
    //             'created_at' => '2026-10-05',
    //         ],
    //         [
    //             'id' => 2,
    //             'customer_name' => 'មករា វុធ',
    //             'item_name' => 'IPhone 15 Pro',
    //             'quantity' => 1,
    //             'total_price' => 999.00,
    //             'created_at' => '2026-10-05',
    //         ],
    //     ];

    //     return response()->json([
    //         'status' => 'success',
    //         'data' => $sales,
    //     ]);
    // }

    // POST /api/sales (បង្កើតការលក់ថ្មី)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'product_name'  => 'required|string|max:255',
            'quantity'      => 'required|integer|min:1',
            'unit_price'    => 'required|numeric|min:0',
            'status'        => 'required|in:Pending,Completed,Cancelled',
            'sale_date'     => 'required|date',
        ]);

        $validated['total_price'] = $validated['quantity'] * $validated['unit_price'];

        $sale = Sale::create($validated);

        return response()->json([
            'message' => 'Sales record created successfully!',
            'data'    => $sale
        ], 201);
    }

    // GET /api/sales/{id}
    public function show($id)
    {
        $sale = Sale::find($id);
        if (!$sale) {
            return response()->json(['message' => 'Record not found'], 404);
        }
        return response()->json($sale, 200);
    }

    // PUT /api/sales/{id}
    public function update(Request $request, $id)
    {
        $sale = Sale::find($id);
        if (!$sale) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $validated = $request->validate([
            'customer_name' => 'sometimes|required|string|max:255',
            'product_name'  => 'sometimes|required|string|max:255',
            'quantity'      => 'sometimes|required|integer|min:1',
            'unit_price'    => 'sometimes|required|numeric|min:0',
            'status'        => 'sometimes|required|in:Pending,Completed,Cancelled',
            'sale_date'     => 'sometimes|required|date',
        ]);

        if (isset($validated['quantity']) || isset($validated['unit_price'])) {
            $qty = $validated['quantity'] ?? $sale->quantity;
            $price = $validated['unit_price'] ?? $sale->unit_price;
            $validated['total_price'] = $qty * $price;
        }

        $sale->update($validated);

        return response()->json([
            'message' => 'Sales record updated successfully!',
            'data'    => $sale
        ], 200);
    }

    // DELETE /api/sales/{id}
    public function destroy($id)
    {
        $sale = Sale::find($id);
        if (!$sale) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $sale->delete();

        return response()->json(['message' => 'Sales record deleted successfully!'], 200);
    }

    public function summary()
    {
        // គណនាទិន្នន័យពី MongoDB Sale collection
        $totalSalesCount = Sale::count();
        $totalRevenue = Sale::sum('total_price');
        $pendingOrders = Sale::where('status', 'Pending')->count();

        return response()->json([
            'data' => [
                'total_sales_count' => $totalSalesCount,
                'total_revenue'     => $totalRevenue,
                'pending_orders'    => $pendingOrders,
            ]
        ]);
    }

    // GET /api/sales-summary (សម្រាប់ Dashboard Stats)
    // public function summary()
    // {
    //     $totalSalesCount = Sale::count();
    //     $totalRevenue = Sale::where('status', 'Completed')->sum('total_price');
    //     $pendingCount = Sale::where('status', 'Pending')->count();

    //     return response()->json([
    //         'total_sales_count' => $totalSalesCount,
    //         'total_revenue'     => $totalRevenue,
    //         'pending_orders'    => $pendingCount
    //     ], 200);
    // }
}

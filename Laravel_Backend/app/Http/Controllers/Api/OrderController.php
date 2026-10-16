<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        try {
            $orders = Order::orderBy('created_at', 'desc')->get();
            return response()->json(['success' => true, 'data' => $orders], 200);
        } catch (\Exception $e) {
            Log::error('Order Index Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'nullable|string',
            'customer_name' => 'nullable|string',
            'customer_phone' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.quantity' => 'required|integer|min:1',
            'subtotal' => 'required|numeric',
            'total' => 'required|numeric',
            'payment_method' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            // កាត់ស្តុកផលិតផល (Stock Reduction)
            foreach ($request->items as $cartItem) {
                $product = Product::find($cartItem['product_id']);
                if ($product) {
                    $newStock = max(0, (int)$product->stock - (int)$cartItem['quantity']);
                    $product->update(['stock' => $newStock]);
                }
            }

            // បង្កើត Order ដោយកំណត់ Status ដំបូង 'Completed' ឬ 'Pending'
            $orderData = $request->all();
            if (!isset($orderData['status'])) {
                $orderData['status'] = 'Completed';
            }

            $order = Order::create($orderData);

            return response()->json([
                'success' => true,
                'message' => 'ការបញ្ជាទិញបានសម្រេចជោគជ័យ!',
                'data' => $order
            ], 201);
        } catch (\Exception $e) {
            Log::error('Order Store Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function refund($id)
    {
        try {
            $order = Order::find($id);

            if (!$order) {
                return response()->json(['success' => false, 'message' => 'រកមិនឃើញ Order នេះឡើយ!'], 404);
            }

            if ($order->status === 'Cancelled' || $order->status === 'Refunded') {
                return response()->json(['success' => false, 'message' => 'Order នេះត្រូវបានលុប ឬ Refund រួចរាល់ហើយ!'], 400);
            }

            // បូកចំនួនស្តុកផលិតផលចូលក្នុង Database វិញស្វ័យប្រវត្តិ
            if ($order->items && is_array($order->items)) {
                foreach ($order->items as $cartItem) {
                    $productId = $cartItem['product_id'] ?? null;
                    if ($productId) {
                        $product = Product::find($productId);
                        if ($product) {
                            $product->increment('stock', (int)$cartItem['quantity']);
                        }
                    }
                }
            }

            $order->update(['status' => 'Cancelled']);

            return response()->json([
                'success' => true,
                'message' => 'ការប្រគល់ទំនិញត្រឡប់មកវិញបានជោគជ័យ និងបានបន្ថែមស្តុកវិញរួចរាល់!',
                'data' => $order
            ], 200);
        } catch (\Exception $e) {
            Log::error('Order Refund Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}

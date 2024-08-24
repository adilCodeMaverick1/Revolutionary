<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('categories')->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $product = Product::create($request->only(['name', 'description', 'price']));
        $product->categories()->attach($request->categories);
        return response()->json($product);
    }

    public function show($id)
    {
        $product = Product::with('categories')->find($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        $product->update($request->only(['name', 'description', 'price']));
        $product->categories()->sync($request->categories);
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        $product->categories()->detach();
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}

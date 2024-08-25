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
        return response()->json($products, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'categoryIds' => 'array', 
        ]);

        $product = Product::create($request->only(['name', 'description', 'price']));
        $product->categories()->sync($request->input('categoryIds'));

        return response()->json($product->load('categories'), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load('categories'), 200);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'categoryIds' => 'array', 
        ]);

        $product->update($request->only(['name', 'description', 'price']));
        $product->categories()->sync($request->input('categoryIds'));

        return response()->json($product->load('categories'), 200);
    }

    public function destroy(Product $product)
    {
        $product->categories()->detach();
        $product->delete();

        return response()->json(null, 204);
    }
}

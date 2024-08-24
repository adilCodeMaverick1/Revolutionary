<?php
// app/Http/Controllers/ProductController.php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'categoryIds' => 'array', // Ensure this is an array of category IDs
        ]);

        $product = Product::create($request->only(['name', 'description', 'price']));
        $product->categories()->sync($request->input('categoryIds')); // Sync categories

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'categoryIds' => 'array', // Ensure this is an array of category IDs
        ]);

        $product->update($request->only(['name', 'description', 'price']));
        $product->categories()->sync($request->input('categoryIds')); // Sync categories

        return response()->json($product, 200);
    }
}

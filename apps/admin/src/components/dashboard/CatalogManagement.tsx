'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Edit, Trash2, Package } from 'lucide-react';

export default function CatalogManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock products data
  const products = [
    {
      id: 'prod-001',
      name: 'Smartphone Pro Max',
      category: 'Electronics',
      price: 999.99,
      stock: 50,
      status: 'active',
      lastModified: '2024-11-15',
    },
    {
      id: 'prod-002',
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 299.99,
      stock: 8,
      status: 'low-stock',
      lastModified: '2024-11-20',
    },
    {
      id: 'prod-003',
      name: 'Designer Watch',
      category: 'Accessories',
      price: 599.99,
      stock: 0,
      status: 'out-of-stock',
      lastModified: '2024-11-10',
    },
  ];

  // Mock categories with materialized path
  const categories = [
    { id: '1', name: 'Electronics', path: 'Electronics', level: 0, productCount: 245 },
    { id: '1.1', name: 'Smartphones', path: 'Electronics/Smartphones', level: 1, productCount: 89 },
    { id: '1.2', name: 'Laptops', path: 'Electronics/Laptops', level: 1, productCount: 67 },
    { id: '1.3', name: 'Audio', path: 'Electronics/Audio', level: 1, productCount: 89 },
    { id: '2', name: 'Clothing', path: 'Clothing', level: 0, productCount: 543 },
    { id: '2.1', name: 'Men', path: 'Clothing/Men', level: 1, productCount: 289 },
    { id: '2.2', name: 'Women', path: 'Clothing/Women', level: 1, productCount: 254 },
    { id: '3', name: 'Home & Garden', path: 'Home & Garden', level: 0, productCount: 187 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'low-stock':
        return <Badge className="bg-yellow-600">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-600">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product List</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="pl-10 pr-4 py-2 border rounded-md w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-semibold">${product.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Stock</p>
                        <p className="font-semibold">{product.stock}</p>
                      </div>
                      <div>
                        {getStatusBadge(product.status)}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Tree</CardTitle>
              <CardDescription>
                Hierarchical category structure (materialized path for O(log n) queries)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center justify-between p-3 hover:bg-gray-50 rounded ${
                      category.level > 0 ? 'ml-' + category.level * 8 : ''
                    }`}
                    style={{ paddingLeft: `${category.level * 32 + 12}px` }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({category.productCount} products)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
              <CardDescription>
                Import/export products and perform bulk updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop CSV file or click to browse
                  </p>
                  <Button>
                    Select File
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">CSV Format Requirements</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Required columns: name, price, category, stock</li>
                    <li>• Optional: description, image, tags</li>
                    <li>• Bloom filter pre-check for duplicates before DB write</li>
                    <li>• Max 10,000 rows per import</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


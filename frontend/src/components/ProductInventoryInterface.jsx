import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPackage, FiShoppingCart, FiSettings, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { supabase } from '../services/supabase';

const ProductInventoryInterface = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [reorderQuantity, setReorderQuantity] = useState(0);

  // Load products from Supabase on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products with inventory data
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          inventory (
            current_stock,
            minimum_stock,
            maximum_stock,
            status,
            location
          ),
          suppliers (
            company_name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error loading products:', productsError);
        toast.error('Failed to load products from database');
        return;
      }

      // Transform data to match component format
      const transformedProducts = (productsData || []).map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: parseFloat(p.selling_price || 0),
        stock: p.inventory?.[0]?.current_stock || 0,
        minStock: p.inventory?.[0]?.minimum_stock || 10,
        maxStock: p.inventory?.[0]?.maximum_stock || 100,
        status: calculateStatus(
          p.inventory?.[0]?.current_stock || 0,
          p.inventory?.[0]?.minimum_stock || 10
        ),
        location: p.inventory?.[0]?.location || 'Not assigned',
        supplier: p.suppliers?.company_name || 'No supplier',
        productId: p.id,
        inventoryId: p.inventory?.[0]?.id
      }));

      setProducts(transformedProducts);
      console.log(`✅ Loaded ${transformedProducts.length} products from Supabase`);
      
    } catch (error) {
      console.error('Error in loadProducts:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStatus = (stock, minStock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= minStock) return 'Low Stock';
    return 'In Stock';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleReorder = (product) => {
    setSelectedProduct(product);
    const suggestedQuantity = product.maxStock - product.stock;
    setReorderQuantity(suggestedQuantity);
    setShowReorderModal(true);
  };

  const handleAdjust = (product) => {
    setSelectedProduct(product);
    setAdjustmentAmount(0);
    setAdjustmentReason('');
    setShowAdjustModal(true);
  };

  const processReorder = async () => {
    if (selectedProduct && reorderQuantity > 0) {
      try {
        toast.info(
          <div>
            <div className="font-bold">🔄 Processing Reorder...</div>
            <div className="text-sm mt-1">
              <div>{selectedProduct.name}</div>
              <div>Quantity: {reorderQuantity} units</div>
              <div>Estimated Cost: {formatCurrency(selectedProduct.price * reorderQuantity)}</div>
              <div>Supplier: {selectedProduct.supplier}</div>
            </div>
          </div>,
          { autoClose: 2000 }
        );

        const newStock = selectedProduct.stock + reorderQuantity;
        
        // Update inventory in Supabase
        const { error: updateError } = await supabase
          .from('inventory')
          .update({
            current_stock: newStock,
            last_restocked_at: new Date().toISOString(),
            status: calculateStatus(newStock, selectedProduct.minStock).toLowerCase().replace(' ', '_')
          })
          .eq('product_id', selectedProduct.productId);

        if (updateError) {
          throw updateError;
        }

        // Update local state
        setProducts(prev => prev.map(p => {
          if (p.id === selectedProduct.id) {
            return {
              ...p,
              stock: newStock,
              status: calculateStatus(newStock, p.minStock)
            };
          }
          return p;
        }));

        toast.success(
          <div>
            <div className="font-bold">✅ Reorder Completed!</div>
            <div className="text-sm mt-1">
              <div>{selectedProduct.name}</div>
              <div>Added: {reorderQuantity} units</div>
              <div>New Stock Level: {newStock}</div>
            </div>
          </div>,
          { autoClose: 3000 }
        );

        setShowReorderModal(false);
      } catch (error) {
        console.error('Error processing reorder:', error);
        toast.error('Failed to update inventory in database');
      }
    }
  };

  const processAdjustment = async () => {
    if (selectedProduct && adjustmentAmount !== 0 && adjustmentReason.trim()) {
      try {
        const newStock = Math.max(0, selectedProduct.stock + adjustmentAmount);
        
        // Update inventory in Supabase
        const { error: updateError } = await supabase
          .from('inventory')
          .update({
            current_stock: newStock,
            status: calculateStatus(newStock, selectedProduct.minStock).toLowerCase().replace(' ', '_'),
            updated_at: new Date().toISOString()
          })
          .eq('product_id', selectedProduct.productId);

        if (updateError) {
          throw updateError;
        }

        // Log the adjustment (optional - create stock_adjustments table later)
        console.log('Stock adjustment:', {
          product: selectedProduct.name,
          amount: adjustmentAmount,
          reason: adjustmentReason,
          newStock
        });

        // Update local state
        setProducts(prev => prev.map(p => {
          if (p.id === selectedProduct.id) {
            return {
              ...p,
              stock: newStock,
              status: calculateStatus(newStock, p.minStock)
            };
          }
          return p;
        }));

        toast.success(
          <div>
            <div className="font-bold">📦 Stock Adjusted Successfully</div>
            <div className="text-sm mt-1">
              <div>{selectedProduct.name}</div>
              <div>Adjustment: {adjustmentAmount > 0 ? '+' : ''}{adjustmentAmount} units</div>
              <div>Reason: {adjustmentReason}</div>
              <div>New Stock: {newStock} units</div>
            </div>
          </div>,
          { autoClose: 4000 }
        );

        setShowAdjustModal(false);
      } catch (error) {
        console.error('Error processing adjustment:', error);
        toast.error('Failed to update inventory in database');
      }
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiPackage className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Products ({loading ? '...' : products.length})
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={loadProducts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              disabled={loading}
            >
              {loading ? '🔄 Loading...' : '🔄 Refresh'}
            </button>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Food & Beverages</option>
              <option>Household</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading products from database...</p>
        </div>
      )}

      {/* No Products State */}
      {!loading && products.length === 0 && (
        <div className="p-12 text-center">
          <FiPackage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600 mb-4">Add products to your inventory to get started</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              {/* Product Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</div>
              </div>

              {/* Stock Info */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stock: {product.stock}</span>
                  <span className="text-gray-600">Min: {product.minStock}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      product.stock === 0 ? 'bg-red-500' :
                      product.stock <= product.minStock ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((product.stock / product.maxStock) * 100, 100)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>📍 {product.location}</span>
                  <span>🏢 {product.supplier}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleReorder(product)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <FiShoppingCart className="h-4 w-4" />
                  <span>Reorder</span>
                </button>
                <button
                  onClick={() => handleAdjust(product)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <FiSettings className="h-4 w-4" />
                  <span>Adjust</span>
                </button>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Reorder Modal */}
      {showReorderModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🔄 Reorder Product
            </h3>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="font-medium text-gray-900">{selectedProduct.name}</div>
              <div className="text-sm text-gray-600">Current Stock: {selectedProduct.stock} units</div>
              <div className="text-sm text-gray-600">Supplier: {selectedProduct.supplier}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reorder Quantity
                </label>
                <input
                  type="number"
                  value={reorderQuantity}
                  onChange={(e) => setReorderQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <div className="mt-2 text-sm text-gray-600">
                  Suggested: {selectedProduct.maxStock - selectedProduct.stock} units
                </div>
              </div>

              {reorderQuantity > 0 && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-800">
                    <strong>Estimated Cost:</strong> {formatCurrency(selectedProduct.price * reorderQuantity)}
                  </div>
                  <div className="text-sm text-green-800">
                    <strong>New Stock Level:</strong> {selectedProduct.stock + reorderQuantity} units
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={processReorder}
                disabled={reorderQuantity <= 0}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Confirm Reorder
              </button>
              <button
                onClick={() => setShowReorderModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              📦 Adjust Stock
            </h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">{selectedProduct.name}</div>
              <div className="text-sm text-gray-600">Current Stock: {selectedProduct.stock} units</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Amount
                </label>
                <div className="flex space-x-2 mb-2">
                  <button
                    onClick={() => setAdjustmentAmount(-10)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => setAdjustmentAmount(-5)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => setAdjustmentAmount(5)}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => setAdjustmentAmount(10)}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                  >
                    +10
                  </button>
                </div>
                <input
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter adjustment amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Adjustment
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select reason...</option>
                  <option value="Stock count correction">Stock count correction</option>
                  <option value="Damaged goods removal">Damaged goods removal</option>
                  <option value="Emergency restock">Emergency restock</option>
                  <option value="Return from customer">Return from customer</option>
                  <option value="Transfer between locations">Transfer between locations</option>
                  <option value="Manager override">Manager override</option>
                </select>
              </div>

              {adjustmentAmount !== 0 && (
                <div className={`p-3 rounded-lg ${adjustmentAmount > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className={`text-sm ${adjustmentAmount > 0 ? 'text-green-800' : 'text-red-800'}`}>
                    <strong>Preview:</strong> Stock will change from {selectedProduct.stock} to {Math.max(0, selectedProduct.stock + adjustmentAmount)} units
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={processAdjustment}
                disabled={adjustmentAmount === 0 || !adjustmentReason.trim()}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Apply Adjustment
              </button>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInventoryInterface;
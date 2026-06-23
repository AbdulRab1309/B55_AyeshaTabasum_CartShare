import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, DollarSign, RefreshCw, ShoppingBag, Receipt } from 'lucide-react';

/**
 * Cart component. Handles rendering items list, search filtering,
 * add/edit item form validation, and summarizing cart totals.
 */
export default function Cart({
  items = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
  onClearCart,
  onOpenReceipt,
  currentUsername
}) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Allow only digits (positive whole numbers) for quantity input
  const handleQuantityChange = (val) => {
    if (val === '' || /^\d*$/.test(val)) {
      setQuantity(val);
    }
  };

  // Allow only digits and at most one decimal point for price input
  const handlePriceChange = (val) => {
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setPrice(val);
    }
  };

  // Populate form if editing
  const startEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setQuantity(item.quantity.toString());
    setPrice(item.price.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setQuantity('1');
    setPrice('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const itemData = {
      name: name.trim(),
      quantity: parseInt(quantity, 10) || 1,
      price: parseFloat(price) || 0
    };

    if (editingId) {
      onEditItem(editingId, itemData);
      cancelEdit();
    } else {
      onAddItem(itemData);
      // Reset form
      setName('');
      setQuantity('1');
      setPrice('');
    }
  };

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Totals calculations
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Search and Form Section */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Form Card (Add/Edit Item) */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:col-span-1">
          <h2 className="mb-4 text-lg font-bold text-slate-800 dark:text-slate-200">
            {editingId ? 'Edit Item Details' : 'Add Item to Cart'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Item Name */}
            <div>
              <label htmlFor="itemName" className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                Item Name *
              </label>
              <input
                id="itemName"
                type="text"
                required
                placeholder="e.g., Apple, Bread, Milk"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-850 dark:focus:border-blue-500"
              />
            </div>

            {/* Quantity and Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="quantity" className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Qty *
                </label>
                <input
                  id="quantity"
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-850 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="price" className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Price ($)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    $
                  </span>
                  <input
                    id="price"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-7 pr-3.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-850 dark:focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="submit"
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white shadow-md transition-all ${
                  editingId 
                    ? 'bg-amber-500 shadow-amber-100 hover:bg-amber-600 dark:shadow-none' 
                    : 'bg-blue-600 shadow-blue-100 hover:bg-blue-700 dark:shadow-none'
                }`}
              >
                {editingId ? <RefreshCw className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingId ? 'Update' : 'Add Item'}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Dashboard Summary Card */}
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          {/* Total Cost Card */}
          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-lg shadow-blue-100 dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-100">Estimated Total Cost</span>
              <DollarSign className="h-6 w-6 text-blue-200" />
            </div>
            <div>
              <p className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
                ${totalCost.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-blue-100">Calculated automatically</p>
            </div>
          </div>

          {/* Cart Status Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Items (Summed)</span>
              <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {totalItemsCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Across {items.length} unique items
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Cart Items List Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        
        {/* Cart List Header & Search */}
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Shopping List</h3>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute inset-y-0 left-3 h-4 w-4 self-center text-slate-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-60 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:focus:border-blue-500"
              />
            </div>

            {/* Clear Cart Button */}
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-950/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 transition-all"
                title="Clear Cart"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            )}

            {/* Checkout/Receipt Button */}
            {items.length > 0 && (
              <button
                onClick={onOpenReceipt}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-750 shadow-md shadow-emerald-100 dark:shadow-none transition-all"
                title="Generate Receipt"
              >
                <Receipt className="h-3.5 w-3.5" />
                <span>Receipt</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty Cart State */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {searchQuery ? 'No matching items found.' : 'Your cart is empty.'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery ? 'Try checking your spelling or search terms' : 'Add items using the panel on the left'}
            </p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase text-slate-400">
                    <th className="py-3 pr-4">Item Name</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4">Added/Updated By</th>
                    <th className="py-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 pr-4 font-semibold text-slate-850 dark:text-slate-100">
                        {item.name}
                      </td>
                      <td className="py-4 px-4 text-center font-mono">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-semibold text-slate-850 dark:text-slate-100">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                        {item.updatedBy || item.addedBy}
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800 dark:hover:text-amber-400 transition-colors"
                            title="Edit Item"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800 dark:hover:text-red-400 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="grid gap-3 md:hidden">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-slate-850 dark:text-slate-150">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        By {item.updatedBy || item.addedBy}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => startEdit(item)}
                        className="rounded-lg bg-white p-2 text-slate-500 border border-slate-150 hover:text-amber-500 dark:bg-slate-850 dark:border-slate-850 dark:text-slate-400 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="rounded-lg bg-white p-2 text-slate-500 border border-slate-150 hover:text-red-500 dark:bg-slate-850 dark:border-slate-850 dark:text-slate-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100/80 pt-3 text-xs dark:border-slate-850">
                    <div>
                      <span className="block text-slate-400">Qty</span>
                      <span className="font-mono text-sm font-semibold">{item.quantity}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Price</span>
                      <span className="font-mono text-sm font-semibold text-slate-650 dark:text-slate-350">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-slate-400">Total</span>
                      <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      
    </div>
  );
}

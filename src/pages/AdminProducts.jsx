import React, { useState, useEffect, useMemo, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Plus, Search, Edit2, Trash2, X, FolderPlus, ArrowLeft, Layers, Package, AlertTriangle, Camera, Upload, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Skeleton, { TableSkeleton } from '../components/Skeleton';

export default function AdminProducts() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Category State for Level 2 Product Listing View
  const [selectedCatId, setSelectedCatId] = useState(null);

  // Search States
  const [catSearch, setCatSearch] = useState('');
  const [prodSearch, setProdSearch] = useState('');

  // Modals & Confirmation States
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCatConfirmId, setDeleteCatConfirmId] = useState(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductConfirmId, setDeleteProductConfirmId] = useState(null);

  // Category Form State
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    image_url: '',
  });

  // Product Form State
  const [productForm, setProductForm] = useState({
    title: '',
    category_id: '',
    specifications_text: '',
    description: '',
    is_featured: false,
    is_new: true,
    image_url: '',
  });

  const { showSuccess, showError } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const catFileInputRef = useRef(null);
  const prodFileInputRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/admin/categories'),
        api.get('/admin/products'),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Find active category object
  const activeCategory = useMemo(() => {
    if (!selectedCatId) return null;
    return categories.find((c) => String(c.id) === String(selectedCatId));
  }, [categories, selectedCatId]);

  // Product Count Map by Category ID
  const productCountMap = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.category_id] = (map[p.category_id] || 0) + 1;
    });
    return map;
  }, [products]);

  // Filtered Categories (Level 1)
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => c.name.toLowerCase().includes(catSearch.toLowerCase()));
  }, [categories, catSearch]);

  // Filtered Products for Selected Category (Level 2)
  const categoryProducts = useMemo(() => {
    if (!selectedCatId) return [];
    return products.filter(
      (p) =>
        String(p.category_id) === String(selectedCatId) &&
        p.title.toLowerCase().includes(prodSearch.toLowerCase())
    );
  }, [products, selectedCatId, prodSearch]);

  // --- CATEGORY HANDLERS ---
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatForm({
      name: '',
      description: '',
      image_url: '', // Clean empty image by default
    });
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCatForm({
      name: cat.name,
      description: cat.description || '',
      image_url: cat.image_url || '',
    });
    setIsCatModalOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingCat(true);

    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, catForm);
        showSuccess('Category updated successfully!');
      } else {
        await api.post('/admin/categories', catForm);
        showSuccess('New category added successfully!');
      }
      setIsCatModalOpen(false);
      loadData();
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to save category.');
    } finally {
      setIsSubmittingCat(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/categories/${id}`);
      showSuccess('Category deleted successfully!');
      setDeleteCatConfirmId(null);
      if (String(selectedCatId) === String(id)) {
        setSelectedCatId(null);
      }
      loadData();
    } catch (err) {
      showError('Failed to delete category. Ensure linked products are removed first.');
    } finally {
      setIsDeleting(false);
    }
  };

  // --- PRODUCT HANDLERS ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category_id: selectedCatId || categories[0]?.id || '',
      specifications_text: '',
      description: '',
      is_featured: false,
      is_new: true,
      image_url: '', // Clean empty image by default
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    const specsStr = Array.isArray(prod.specifications) ? prod.specifications.join('\n') : (prod.description || '');
    setProductForm({
      title: prod.title,
      category_id: prod.category_id,
      specifications_text: specsStr,
      description: prod.description || '',
      is_featured: prod.is_featured,
      is_new: prod.is_new,
      image_url: prod.images?.[0]?.image_url || '',
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingProduct(true);

    const targetCatId = selectedCatId || productForm.category_id || categories[0]?.id;

    const specsArray = (productForm.specifications_text || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      product_code: productForm.title,
      title: productForm.title,
      category_id: parseInt(targetCatId),
      specifications: specsArray,
      description: productForm.description,
      is_featured: productForm.is_featured,
      is_new: productForm.is_new,
      images: productForm.image_url
        ? [{ image_url: productForm.image_url, is_primary: true, display_order: 0 }]
        : [],
    };

    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, payload);
        showSuccess('Product updated successfully!');
      } else {
        await api.post('/admin/products', payload);
        showSuccess('New product added successfully!');
      }
      setIsProductModalOpen(false);
      loadData();
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to save product details.');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/products/${id}`);
      showSuccess('Product deleted successfully!');
      setDeleteProductConfirmId(null);
      loadData();
    } catch (err) {
      showError('Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Image Upload Helper
  const handleFileUpload = async (e, isCategory = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('kind', isCategory ? 'category' : 'product');

    const existingUrl = isCategory ? catForm.image_url : productForm.image_url;
    if (existingUrl) {
      data.append('existing_url', existingUrl);
    }

    setUploadingImage(true);
    try {
      const res = await api.post('/admin/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const freshUrl = `${res.data.image_url}?t=${Date.now()}`;
      if (isCategory) {
        setCatForm((prev) => ({ ...prev, image_url: freshUrl }));
      } else {
        setProductForm((prev) => ({ ...prev, image_url: freshUrl }));
      }
      showSuccess('Photo uploaded successfully!');
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ========================================================= */}
        {/* LEVEL 1: CATEGORY MANAGEMENT TABLE VIEW */}
        {/* ========================================================= */}
        {!selectedCatId && (
          <div className="space-y-4">

            {/* Toolbar: Search Input & Add Category Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">

              <div className="relative w-full sm:w-80 md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search category by name..."
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5D7CD] rounded-md text-slate-900 text-xs font-bold focus:outline-none focus:border-[#B17F59] shadow-xs"
                />
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs font-mono font-bold text-[#B17F59] uppercase tracking-wider hidden md:inline-block">
                  {filteredCategories.length} CATEGORIES TOTAL
                </span>

                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-[#B17F59] hover:bg-[#8E5832] text-white font-bold rounded-md text-xs transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer shrink-0"
                >
                  <FolderPlus className="w-4 h-4" /> Add New Category
                </button>
              </div>

            </div>

            {/* TABLE SCROLL CONTAINER (FITS CONTENTS SNUGLY WITHOUT HUGE BOTTOM GAP) */}
            <div className="overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
              <table className="w-full text-left text-xs text-slate-800 border-separate border-spacing-y-2">
                <thead className="bg-[#B17F59] text-white font-serif font-black uppercase text-xs tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-6 rounded-l-md">Category Name</th>
                    <th className="py-3 px-6">Products Listed</th>
                    <th className="py-3 px-6 text-right rounded-r-md">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="py-2">
                        <TableSkeleton rows={5} />
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-12 text-center text-slate-500 font-medium">
                        No categories found matching "{catSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat) => {
                      const count = productCountMap[cat.id] || 0;
                      return (
                        <tr
                          key={cat.id}
                          className="bg-white hover:bg-[#EAE0D5] border border-[#E5D7CD] rounded-md shadow-xs transition-all duration-200"
                        >

                          {/* Category Name */}
                          <td className="py-3 px-6 rounded-l-md border-y border-l border-[#E5D7CD]/70">
                            <div className="font-serif font-bold text-sm text-slate-900 flex items-center gap-3 tracking-wide">
                              <div className="w-7 h-7 rounded-md bg-[#F0E8E1] border border-[#E5D7CD] flex items-center justify-center text-[#B17F59] shrink-0">
                                <Layers className="w-3.5 h-3.5" />
                              </div>
                              <span>{cat.name}</span>
                            </div>
                          </td>

                          {/* Products Count */}
                          <td className="py-3 px-6 border-y border-[#E5D7CD]/70">
                            <span className="text-slate-700 font-mono font-bold text-xs">
                              {count} {count === 1 ? 'Item' : 'Items'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-6 text-right rounded-r-md border-y border-r border-[#E5D7CD]/70">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedCatId(cat.id)}
                                className="px-4 py-2 bg-[#C89B7B] hover:bg-[#B17F59] text-white font-serif font-bold text-xs rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Package className="w-3.5 h-3.5" /> Edit Collection ({count})
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditCategory(cat)}
                                title="Edit Category"
                                className="p-2 bg-[#F0E8E1] hover:bg-[#E5D7CD] text-[#8E5832] rounded-md transition-all cursor-pointer shadow-xs"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeleteCatConfirmId(cat.id)}
                                title="Delete Category"
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-all cursor-pointer shadow-xs"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* LEVEL 2: PRODUCT LISTING FOR SELECTED CATEGORY */}
        {/* ========================================================= */}
        {selectedCatId && (
          <div className="space-y-4">

            {/* Toolbar: Arrow Back & Consistent Search / Add Product Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCatId(null)}
                  title="Back to Categories"
                  className="p-2 bg-[#F0E8E1] hover:bg-[#E5D7CD] text-[#B17F59] font-bold text-xs rounded-md transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                  <h2 className="font-serif font-black text-xl text-slate-950">
                    {activeCategory?.name}
                  </h2>
                  <span className="text-[11px] font-mono text-slate-500">
                    {categoryProducts.length} items in this collection
                  </span>
                </div>
              </div>

              {/* Product Search & Add Product Button */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-80 md:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search product title..."
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5D7CD] rounded-md text-slate-900 text-xs font-bold focus:outline-none focus:border-[#B17F59] shadow-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[#B17F59] hover:bg-[#8E5832] text-white font-bold rounded-md text-xs transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

            </div>

            {/* TABLE SCROLL CONTAINER (FITS CONTENTS SNUGLY WITHOUT HUGE BOTTOM GAP) */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
              <table className="w-full text-left text-xs text-slate-800 border-separate border-spacing-y-2">
                <thead className="bg-[#B17F59] text-white font-serif font-black uppercase text-xs tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-6 rounded-l-md">Product Title / Name</th>
                    <th className="py-3 px-6 text-right rounded-r-md">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan="2" className="py-2">
                        <TableSkeleton rows={5} />
                      </td>
                    </tr>
                  ) : categoryProducts.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="py-12 text-center text-slate-500 font-medium">
                        No products found in {activeCategory?.name}. Click "+ Add New Product" on top to add one.
                      </td>
                    </tr>
                  ) : (
                    categoryProducts.map((prod) => {
                      return (
                        <tr
                          key={prod.id}
                          className="bg-white hover:bg-[#EAE0D5] border border-[#E5D7CD] rounded-md shadow-xs transition-all duration-200"
                        >

                          {/* Product Title ONLY */}
                          <td className="py-3 px-6 rounded-l-md border-y border-l border-[#E5D7CD]/70">
                            <div className="font-serif font-bold text-sm text-slate-900 tracking-wide">
                              {prod.title}
                            </div>
                          </td>

                          {/* Actions: Edit & Delete */}
                          <td className="py-3 px-6 text-right rounded-r-md border-y border-r border-[#E5D7CD]/70">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(prod)}
                                className="px-4 py-2 bg-[#F0E8E1] hover:bg-[#E5D7CD] text-[#8E5832] font-bold text-xs rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Edit2 className="w-3.5 h-3.5" /> Edit Product
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeleteProductConfirmId(prod.id)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-all cursor-pointer shadow-xs"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* EDIT / ADD CATEGORY MODAL (UPLOAD BOX IF NO IMAGE DEFAULT) */}
        {/* ========================================================= */}
        {isCatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white border border-[#E5D7CD] rounded-md p-6 space-y-5 text-slate-900 shadow-xl">

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-950">
                  {editingCategory ? 'Edit Category Details' : 'Add New Category'}
                </h3>
                <button onClick={() => setIsCatModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-4 text-xs">

                {/* CATEGORY PHOTO PREVIEW & UPLOAD BOX */}
                <div>
                  <label className="block text-slate-700 font-bold mb-2">Category Photo</label>
                  <div className="flex items-center gap-4">
                    {catForm.image_url ? (
                      <>
                        <img
                          src={catForm.image_url}
                          alt="Category Preview"
                          className="w-20 h-20 rounded-md object-cover border border-[#E5D7CD] shadow-xs bg-[#F0E8E1]"
                        />
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() => catFileInputRef.current?.click()}
                          className="px-4 py-2.5 bg-[#B17F59] hover:bg-[#8E5832] disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                        >
                          {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                          {uploadingImage ? 'Uploading...' : 'Update Photo'}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => catFileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-[#B17F59] hover:bg-[#8E5832] disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                      >
                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                      </button>
                    )}

                    <input
                      ref={catFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleFileUpload(e, true);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WALL HUNG CLOSET"
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-950 font-bold text-sm focus:outline-none focus:border-[#B17F59]"
                  />
                </div>

                {/* CATEGORY DESCRIPTION TEXTAREA */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Description</label>
                  <textarea
                    rows="3"
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    placeholder="Category overview..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 text-xs focus:outline-none focus:border-[#B17F59]"
                  ></textarea>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCatModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-[#8E5832] font-bold rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCat}
                    className="px-5 py-2 bg-[#B17F59] hover:bg-[#8E5832] disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-sm cursor-pointer flex items-center gap-2"
                  >
                    {isSubmittingCat && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmittingCat ? 'Saving...' : editingCategory ? 'Update Category' : 'Save Category'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* EDIT / ADD PRODUCT MODAL (UPLOAD BOX IF NO IMAGE DEFAULT) */}
        {/* ========================================================= */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
            <div className="relative w-full max-w-lg bg-white border border-[#E5D7CD] rounded-md p-6 space-y-5 text-slate-900 shadow-xl overflow-y-auto max-h-[90vh]">

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-950">
                  {editingProduct ? 'Edit Product Details' : 'Add Product to Category'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">

                {/* PRODUCT PHOTO PREVIEW & UPLOAD BOX */}
                <div>
                  <label className="block text-slate-700 font-bold mb-2">Product Photo</label>
                  <div className="flex items-center gap-4">
                    {productForm.image_url ? (
                      <>
                        <img
                          src={productForm.image_url}
                          alt="Product Preview"
                          className="w-20 h-20 rounded-md object-cover border border-[#E5D7CD] shadow-xs bg-[#F0E8E1]"
                        />
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() => prodFileInputRef.current?.click()}
                          className="px-4 py-2.5 bg-[#B17F59] hover:bg-[#8E5832] disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                        >
                          {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                          {uploadingImage ? 'Uploading...' : 'Update Photo'}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => prodFileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-[#B17F59] hover:bg-[#8E5832] disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                      >
                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                      </button>
                    )}

                    <input
                      ref={prodFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleFileUpload(e, false);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* PRODUCT TITLE / NAME */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product Title / Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CELESTE - 3010"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-950 font-bold text-sm focus:outline-none focus:border-[#B17F59]"
                  />
                </div>

                {/* SPECIFICATIONS LIST */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Specifications List (1 item per line)</label>
                  <textarea
                    rows="4"
                    value={productForm.specifications_text}
                    onChange={(e) => setProductForm({ ...productForm, specifications_text: e.target.value })}
                    placeholder={`550x360x360 mm\nRimless Tornado\nP-Trap: 180 mm\nWall Mount`}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 font-mono text-xs focus:outline-none focus:border-[#B17F59]"
                  ></textarea>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-[#8E5832] font-bold rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProduct}
                    className="px-5 py-2 bg-[#B17F59] hover:bg-[#8E5832] disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-sm cursor-pointer flex items-center gap-2"
                  >
                    {isSubmittingProduct && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmittingProduct ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {(deleteProductConfirmId || deleteCatConfirmId) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
            <div className="bg-white border border-red-200 rounded-md p-6 max-w-sm w-full space-y-4 text-center shadow-xl">
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
              <p className="text-xs text-slate-500 font-medium">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setDeleteProductConfirmId(null);
                    setDeleteCatConfirmId(null);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-md text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={() => {
                    if (deleteProductConfirmId) handleDeleteProduct(deleteProductConfirmId);
                    if (deleteCatConfirmId) handleDeleteCategory(deleteCatConfirmId);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-md text-xs cursor-pointer flex items-center gap-2"
                >
                  {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

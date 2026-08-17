import React, { useState, useEffect, useRef } from 'react';
import {
  Upload, Plus, Trash2, Image as ImageIcon, Film, X, Check,
  AlertCircle, Sparkles, RefreshCw, Eye, GripVertical, Save, Move, Info
} from 'lucide-react';
import { getAdminGallery, uploadGalleryMedia, deleteGalleryItem, reorderGalleryItems } from '../services/api';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Reorder state
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Upload form state
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null); // 'photo' or 'video'
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await getAdminGallery();
      setItems(res.data || []);
      setIsOrderChanged(false);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- DRAG AND DROP REORDER HANDLERS ---
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);

    setItems(newItems);
    setDraggedIdx(index);
    setIsOrderChanged(true);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const payload = items.map((item, index) => ({
        id: item.id,
        display_order: index,
      }));
      await reorderGalleryItems(payload);
      setIsOrderChanged(false);
      setSuccessMsg('Gallery order saved! Changes are now live on the website.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to save order:', err);
      setErrorMsg('Failed to save reorder sequence. Please try again.');
    } finally {
      setSavingOrder(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    validateAndSetFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setErrorMsg('');
    const type = file.type;
    const name = file.name.toLowerCase();

    const isImage = ALLOWED_IMAGE_TYPES.includes(type) || /\.(jpg|jpeg|png|webp|gif|svg)$/.test(name);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(type) || /\.(mp4|webm|ogg|mov|avi|mkv)$/.test(name);

    if (!isImage && !isVideo) {
      setErrorMsg('Invalid file type! Only photos (JPG, PNG, WEBP, GIF, SVG) and videos (MP4, WEBM, MOV, AVI) are allowed.');
      setSelectedFile(null);
      setFilePreview(null);
      setFileType(null);
      return;
    }

    const detectedType = isVideo ? 'video' : 'photo';
    setSelectedFile(file);
    setFileType(detectedType);

    // Create live preview URL
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a photo or video to upload.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (title.trim()) {
        formData.append('title', title.trim());
      }

      await uploadGalleryMedia(formData);
      setSuccessMsg('Media uploaded successfully to Supabase Storage!');

      setTimeout(() => {
        closeUploadModal();
        fetchGallery();
      }, 1000);
    } catch (err) {
      console.error('Upload error:', err);
      const detail = err.response?.data?.detail || 'Failed to upload media. Please try again.';
      setErrorMsg(detail);
    } finally {
      setUploading(false);
    }
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    setFileType(null);
    setTitle('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await deleteGalleryItem(deletingId);
      setItems((prev) => prev.filter((item) => item.id !== deletingId));
      setDeleteModalOpen(false);
      setDeletingId(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const totalPhotos = items.filter((i) => i.item_type === 'photo').length;
  const totalVideos = items.filter((i) => i.item_type === 'video').length;

  return (
    <div className="space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-[#B17F59]" /> Gallery Management
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Upload photos & videos stored in Supabase Storage (`gallery` bucket) for public gallery page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchGallery}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#B17F59] hover:bg-slate-50 transition-colors"
            title="Refresh Gallery"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B17F59] hover:bg-[#986743] text-white text-xs font-bold shadow-md transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Photo or Video
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#F0E8E1] text-[#B17F59] rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Media</p>
            <p className="text-2xl font-bold text-slate-900">{items.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#F0E8E1] text-[#B17F59] rounded-xl">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Photos</p>
            <p className="text-2xl font-bold text-slate-900">{totalPhotos}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#F0E8E1] text-[#8E5832] rounded-xl">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Videos</p>
            <p className="text-2xl font-bold text-slate-900">{totalVideos}</p>
          </div>
        </div>
      </div>

      {/* GALLERY ITEMS GRID (WITH DRAG & DROP REORDERING) */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#B17F59] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F0E8E1] text-[#B17F59] flex items-center justify-center">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-slate-900">No Gallery Items Uploaded</h3>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              Click the button below to upload new photos or videos to the Supabase `gallery` bucket.
            </p>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B17F59] hover:bg-[#986743] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Upload Media
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const isVideo = item.item_type === 'video';
            const defaultName = `Media ${idx + 1}`;
            const displayName = item.title || defaultName;
            const isBeingDragged = draggedIdx === idx;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col cursor-grab active:cursor-grabbing ${isBeingDragged
                  ? 'opacity-40 border-dashed border-[#B17F59] scale-95 shadow-2xl'
                  : 'border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#B17F59]/80'
                  }`}
              >
                {/* MEDIA THUMBNAIL (UNIFORM SAME SIZE CONTAINER) */}
                <div className="relative w-full aspect-square bg-slate-950 overflow-hidden select-none">
                  {isVideo ? (
                    <video
                      src={`${item.file_url}#t=1.0`}
                      preload="metadata"
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.file_url}
                      alt={displayName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                    />
                  )}

                  {/* DRAG GRIP HANDLE BADGE */}
                  <div
                    className="absolute top-3 left-3 z-20 p-1.5 rounded-lg bg-slate-950/80 text-slate-200 backdrop-blur-md shadow-md hover:bg-[#B17F59] transition-colors flex items-center justify-center"
                    title="Drag & drop to reorder"
                  >
                    <GripVertical className="w-4 h-4 text-slate-300" />
                  </div>

                  {/* DELETE OVERLAY BUTTON */}
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* CARD DETAILS */}
                <div className="p-4 space-y-1 bg-white flex-1 flex flex-col justify-between select-none">
                  <h4 className="font-serif font-bold text-slate-900 text-sm truncate">
                    {displayName}
                  </h4>
                  <div className="text-[11px] text-slate-400 font-medium pt-1">
                    <span>
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BOTTOM FLOATING SAVE ORDER ACTION BAR WITH INFO TOOLTIP (PROPER THEME) */}
      {isOrderChanged && (
        <div className="fixed bottom-6 right-6 z-40 animate-slideUp">
          <div className="text-white p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">

            {/* Save Order Button (Brand Terracotta Theme) */}
            <button
              onClick={handleSaveOrder}
              disabled={savingOrder}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B17F59] hover:bg-[#986743] disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all cursor-pointer hover-shine"
            >
              <Save className="w-4 h-4" />
              <span>{savingOrder ? 'Saving Order...' : 'Save Order'}</span>
            </button>

            {/* Info Icon with Hover Tooltip */}
            <div className="relative group/tooltip">
              <button
                type="button"
                className="p-2.5 rounded-xl bg-[#2B1D14] hover:bg-[#B17F59] text-[#D8A279] hover:text-white transition-colors cursor-help flex items-center justify-center border border-[#B17F59]/30"
              >
                <Info className="w-4 h-4" />
              </button>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full right-0 mb-3 w-64 p-3 bg-[#1C1613] text-slate-200 text-[11px] leading-relaxed font-medium rounded-xl shadow-2xl border border-[#B17F59]/40 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <p>
                  Drag & drop media cards to rearrange their order, then click <strong className="text-[#D8A279]">Save Order</strong> to update the live website gallery sequence.
                </p>
                {/* Tooltip Arrow */}
                <div className="absolute top-full right-3.5 -mt-1 border-6 border-transparent border-t-[#1C1613]"></div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* UPLOAD MEDIA MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#F0E8E1] text-[#B17F59] rounded-xl">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Upload Photo or Video</h3>
              </div>
              <button
                onClick={closeUploadModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* DROPZONE / FILE SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Media File (Photo or Video)
                </label>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${selectedFile ? 'border-[#B17F59] bg-[#F0E8E1]/30' : 'border-slate-300 hover:border-[#B17F59] bg-slate-50'
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {filePreview ? (
                    <div className="space-y-3">
                      <div className="max-h-48 rounded-xl overflow-hidden shadow-sm mx-auto flex items-center justify-center bg-slate-900">
                        {fileType === 'video' ? (
                          <video src={filePreview} controls className="max-h-48 w-full object-contain" />
                        ) : (
                          <img src={filePreview} alt="Preview" className="max-h-48 object-contain" />
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#B17F59]">
                        {fileType === 'video' ? <Film className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                        <span>{selectedFile.name}</span>
                        <span className="text-slate-400 font-normal">
                          ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Click or drag another file to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#B17F59]">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Click to upload or drag & drop</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Photos (JPG, PNG, WEBP, GIF) or Videos (MP4, WEBM, MOV)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* TITLE / CAPTION INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Media Title / Caption (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern Sanitaryware Showcase 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#B17F59] transition-colors"
                />
              </div>

              {/* MODAL FOOTER BUTTONS */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={uploading}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B17F59] hover:bg-[#986743] text-white text-xs font-bold shadow-md disabled:opacity-50 transition-all cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Media</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-slate-900 text-lg">Delete Gallery Media?</h3>
              <p className="text-xs text-slate-500 font-medium">
                This item will be permanently deleted from database and Supabase Storage bucket.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

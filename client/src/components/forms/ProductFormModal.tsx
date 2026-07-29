import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, UploadCloud, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useProductStore } from '../../store/useProductStore';

const CATEGORIES = [
  'Home Bakery', 'Cakes', 'Cookies', 'Chocolate', 'Cupcakes', 
  'Cloud Kitchen', 'Paintings', 'Portraits', 'Handmade Crafts', 
  'Candles', 'Crochet', 'Jewelry', 'Other'
];

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
}

export default function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fetchSellerProducts } = useProductStore();

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
      });
      if (product.images) {
        setPreviewUrls(product.images.map((img: string) => `${img}`));
      }
    } else {
      reset();
      setImages([]);
      setPreviewUrls([]);
    }
  }, [product, reset]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      toast.error('Only image files are allowed');
    }

    setImages(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(f => URL.createObjectURL(f));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    // If it's an existing image from server, we might need to handle it differently, 
    // but for now we just remove it from preview.
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    if (index >= (product?.images?.length || 0)) {
      const fileIndex = index - (product?.images?.length || 0);
      setImages(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    for (const file of images) {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      uploadedUrls.push(data.url);
    }
    return uploadedUrls;
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const uploadedImageUrls = await uploadImages();
      
      let finalImages = product?.images || [];
      // Keep only images that are still in previewUrls
      finalImages = finalImages.filter((img: string) => previewUrls.includes(`${img}`));
      
      finalImages = [...finalImages, ...uploadedImageUrls];

      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: Number(data.price),
        stock: Number(data.stock),
        images: finalImages,
      };

      if (product) {
        await api.put(`/product/${product._id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/product', payload);
        toast.success('Product created');
      }

      await fetchSellerProducts();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-2xl font-bold text-foreground">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2">Product Images</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-foreground">Click to upload images</p>
                <p className="text-xs text-foreground/50 mt-1">Upload up to 5 images</p>
              </div>

              {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                      <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Title</label>
                <input {...register('title', { required: 'Required' })} type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Chocolate Truffle Cake" />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Category</label>
                <select {...register('category', { required: 'Required' })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Price (₹)</label>
                <input {...register('price', { required: 'Required', min: 0 })} type="number" step="0.01" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="499" />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Stock Quantity</label>
                <input {...register('stock', { required: 'Required', min: 0 })} type="number" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="10" />
                {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message as string}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Description</label>
              <textarea {...register('description', { required: 'Required' })} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" placeholder="Describe your product..." />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message as string}</p>}
            </div>

          </form>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-sm font-semibold text-foreground bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" form="product-form" disabled={isLoading} className="px-8 py-2.5 rounded-full text-sm font-bold text-white bg-foreground hover:bg-primary transition-colors flex items-center shadow-lg shadow-primary/20">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {product ? 'Save Changes' : 'Publish Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

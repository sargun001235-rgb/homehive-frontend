import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Eye, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { Link } from 'react-router-dom';
import ProductFormModal from '../../components/forms/ProductFormModal';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ProductManagement() {
  const { sellerProducts, fetchSellerProducts, deleteProduct, isLoading } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const filteredProducts = sellerProducts.filter((p: any) => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading && sellerProducts.length === 0) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <p className="text-foreground/60 text-sm">Manage your inventory, prices, and listings</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button 
              onClick={openNewProduct}
              className="bg-foreground text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary transition-all flex items-center shadow-lg"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </button>
          </div>
        </div>

        {/* Content */}
        {sellerProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-16 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Create your first product</h2>
            <p className="text-foreground/60 max-w-md mx-auto mb-8">
              Start adding your beautiful creations to the marketplace. Include high-quality photos and detailed descriptions to attract buyers.
            </p>
            <button onClick={openNewProduct} className="bg-foreground text-white px-8 py-3 rounded-full font-bold hover:bg-primary transition-all shadow-xl hover:shadow-primary/30 flex items-center mx-auto group">
              Add Product <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                            {product.images?.[0] ? (
                              <img src={`${product.images[0]}`} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-400 m-auto mt-3.5" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">{product.title}</p>
                            <p className="text-xs text-foreground/50 max-w-[200px] truncate">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-sm">₹{product.price}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-foreground/70">{product.category}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/product/${product._id}`} className="p-2 text-gray-400 hover:text-primary transition-colors bg-white rounded-lg shadow-sm border border-gray-100">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => openEditProduct(product)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors bg-white rounded-lg shadow-sm border border-gray-100">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-lg shadow-sm border border-gray-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500">
                        No products found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProductFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          product={editingProduct} 
        />
      )}
    </div>
  );
}

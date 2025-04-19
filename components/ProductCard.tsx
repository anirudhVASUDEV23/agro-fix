interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  onAddToCart?: (productId: string) => void;
  isAdmin?: boolean;
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart, isAdmin, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
      <div className="mt-4 space-x-2">
        {!isAdmin && (
          <button 
            onClick={() => onAddToCart?.(product.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add to Cart
          </button>
        )}
        {isAdmin && (
          <>
            <button 
              onClick={() => onEdit?.(product.id)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete?.(product.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
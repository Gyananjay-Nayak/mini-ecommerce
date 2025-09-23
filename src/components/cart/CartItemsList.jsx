import CartItem from "./CartItem";
export default function CartItemsList({ items }) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Items ({items.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

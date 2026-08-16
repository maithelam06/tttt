import ProductCard from "./ProductCard"

function ProductList({ canManage, categoryMap, onDelete, onEdit, onViewDetails, products }) {
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          canManage={canManage}
          categoryName={categoryMap[product.categoryId]}
          key={product.id}
          onDelete={() => onDelete(product.id)}
          onEdit={() => onEdit(product)}
          onViewDetails={() => onViewDetails(product)}
          product={product}
        />
      ))}
    </div>
  )
}

export default ProductList

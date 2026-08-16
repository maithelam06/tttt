import { useState } from "react"
import ProductDetail from "../components/products/ProductDetail"
import ProductForm from "../components/products/ProductForm"
import ProductList from "../components/products/ProductList"
import PublicCatalogShowcase from "../components/public/PublicCatalogShowcase"

function ProductsPage({
  canManage,
  categories,
  brands = [],
  categoryMap,
  editingProductId,
  filteredProducts,
  keyword = "",
  onDeleteProduct,
  onEditProduct,
  onKeywordChange,
  onProductFormChange,
  onProductSubmit,
  productForm,
}) {
  const [selectedProduct, setSelectedProduct] = useState(null)

  if (!canManage) {
    return (
      <section className="products-page">
        <PublicCatalogShowcase products={filteredProducts} />

        {onKeywordChange && (
          <section className="shop-search-panel">
            <label>
              Tìm sản phẩm
              <input
                onChange={(event) => onKeywordChange(event.target.value)}
                placeholder="Nhập tên khóa, SKU, thương hiệu..."
                type="search"
                value={keyword}
              />
            </label>
          </section>
        )}
      </section>
    )
  }

  return (
    <section className="products-page">
      <section className="content-grid">
        <ProductForm
          brands={brands}
          categories={categories}
          editingProductId={editingProductId}
          form={productForm}
          onChange={onProductFormChange}
          onSubmit={onProductSubmit}
        />

        <ProductList
          canManage={canManage}
          categoryMap={categoryMap}
          onDelete={onDeleteProduct}
          onEdit={onEditProduct}
          onViewDetails={setSelectedProduct}
          products={filteredProducts}
        />

        {selectedProduct && (
          <ProductDetail
            categoryName={categoryMap[selectedProduct.categoryId]}
            onClose={() => setSelectedProduct(null)}
            product={selectedProduct}
          />
        )}
      </section>
    </section>
  )
}

export default ProductsPage

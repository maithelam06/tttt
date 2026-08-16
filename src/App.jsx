import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import AdminDashboard from "./components/admin/AdminDashboard"
import ArticleManager from "./components/admin/ArticleManager"
import AdminResourceManager from "./components/admin/AdminResourceManager"
import LoginPage from "./components/auth/LoginPage"
import PublicHeader from "./components/layout/PublicHeader"
import Sidebar from "./components/layout/Sidebar"
import ProductVisual from "./components/public/ProductVisual"
import ContentPage from "./components/public/ContentPages"
import SiteFooter from "./components/public/SiteFooter"
import Storefront, { BranchFooter } from "./components/public/Storefront"
import { ToastProvider, toast } from "./components/ui/Toast"
import ConfirmModal from "./components/common/ConfirmModal"
import EmailMarketingManager from "./components/admin/EmailMarketingManager"
import RequestsManager from "./components/admin/RequestsManager"
import CategoriesPage from "./pages/CategoriesPage"
import ProductsPage from "./pages/ProductsPage"
import { emptyCategory, emptyProduct } from "./data/mockData"
import { formatMoney } from "./utils/format"
import {
  api,
  categoryPayload,
  normalizeArticle,
  normalizeCategory,
  normalizeProduct,
  productPayload,
} from "./services/api"
import "./index.css"
import "./App.css"
import "./styles/data-view.css"
import "./styles/forms.css"
import "./styles/layout.css"
import "./styles/product-shop.css"
import "./styles/public.css"
import "./styles/content-pages.css"
import "./styles/theme.css"

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("sslock_user"))
    } catch {
      return null
    }
  })
  const [confirmConfig, setConfirmConfig] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [keyword, setKeyword] = useState("")
  const [compareIds, setCompareIds] = useState([])
  const [showCompare, setShowCompare] = useState(false)
  const [productForm, setProductForm] = useState(emptyProduct)
  const [categoryForm, setCategoryForm] = useState(emptyCategory)
  const [editingProductId, setEditingProductId] = useState(null)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [apiError, setApiError] = useState("")
  const [posts, setPosts] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {
    let active = true
    Promise.all([
      api.products.list().catch(() => []),
      api.categories.list().catch(() => []),
      api.articles.list().catch(() => []),
      api.admin.list("brands").catch(() => []),
    ])
      .then(([nextProducts, nextCategories, nextPosts, nextBrands]) => {
        if (!active) return
        setProducts(nextProducts.map(normalizeProduct))
        setCategories(nextCategories.map(normalizeCategory))
        setPosts(nextPosts.map(normalizeArticle))
        setBrands(Array.isArray(nextBrands) ? nextBrands : [])
        if (nextCategories[0]) {
          setProductForm((current) => current.name
            ? current
            : { ...current, categoryId: nextCategories[0].id })
        }
        setApiError("")
      })
      .catch((error) => active && setApiError(error.message))
    return () => { active = false }
  }, [])

  // Security: Prevent F12, DevTools shortcuts, View Source, and Right-Click on images
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target.tagName === "IMG" || !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
        e.preventDefault()
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === "F12") {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      if (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      if (e.ctrlKey && ["U", "u"].includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [categories],
  )
  const isAdminRoute = path.startsWith("/admin")
  const activeTab = isAdminRoute ? path.split("/")[2] || "dashboard" : ""

  function navigateTo(nextPath) {
    window.history.pushState({}, "", nextPath)
    setPath(nextPath)
  }

  function handleLogin(nextUser) {
    setUser(nextUser)
    navigateTo("/admin/dashboard")
  }

  async function handleLogout() {
    try {
      await api.logout()
    } catch {
      // The local session still needs to be cleared if the server is unavailable.
    }
    sessionStorage.removeItem("sslock_token")
    sessionStorage.removeItem("sslock_user")
    setUser(null)
    navigateTo("/")
  }

  function toggleCompare(productId) {
    setCompareIds((currentIds) => {
      if (currentIds.includes(productId)) {
        return currentIds.filter((id) => id !== productId)
      }

      return currentIds.length < 3 ? [...currentIds, productId] : currentIds
    })
  }

  async function saveProduct(event) {
    event.preventDefault()
    try {
      const saved = editingProductId
        ? await api.products.update(editingProductId, productPayload(productForm))
        : await api.products.create(productPayload(productForm))
      const normalized = normalizeProduct(saved)
      setProducts((current) => editingProductId
        ? current.map((item) => item.id === editingProductId ? normalized : item)
        : [normalized, ...current])
      setProductForm({ ...emptyProduct, categoryId: categories[0]?.id || "" })
      setEditingProductId(null)
      setApiError("")
    } catch (error) {
      setApiError(error.message)
    }
  }

  async function saveCategory(event) {
    event.preventDefault()
    try {
      const saved = editingCategoryId
        ? await api.categories.update(editingCategoryId, categoryPayload(categoryForm))
        : await api.categories.create(categoryPayload(categoryForm))
      const normalized = normalizeCategory(saved)
      setCategories((current) => editingCategoryId
        ? current.map((item) => item.id === editingCategoryId ? normalized : item)
        : [normalized, ...current])
      setCategoryForm(emptyCategory)
      setEditingCategoryId(null)
      setApiError("")
    } catch (error) {
      setApiError(error.message)
    }
  }

  function editProduct(product) {
    setProductForm(product)
    setEditingProductId(product.id)
  }

  function deleteProduct(productId) {
    const product = products.find((p) => p.id === productId)
    setConfirmConfig({
      title: "Xác nhận xóa sản phẩm",
      message: `Bạn có chắc chắn muốn xóa sản phẩm "${product?.name || "này"}"? Thao tác này không thể hoàn tác.`,
      onConfirm: async () => {
        setConfirmConfig(null)
        try {
          await api.products.remove(productId)
          setProducts((current) => current.filter((p) => p.id !== productId))
          toast.success("Đã xóa sản phẩm thành công!")
        } catch (error) {
          toast.error(error.message || "Không thể xóa sản phẩm do đang được sử dụng ở đơn hàng/bảo hành.")
          setApiError(error.message)
        }
      },
    })
  }

  function editCategory(category) {
    setCategoryForm(category)
    setEditingCategoryId(category.id)
  }

  function deleteCategory(categoryId) {
    const category = categories.find((c) => c.id === categoryId)
    setConfirmConfig({
      title: "Xác nhận xóa danh mục",
      message: `Bạn có chắc chắn muốn xóa danh mục "${category?.name || "này"}"? Thao tác này không thể hoàn tác.`,
      onConfirm: async () => {
        setConfirmConfig(null)
        try {
          await api.categories.remove(categoryId)
          setCategories((current) => current.filter((c) => c.id !== categoryId))
          toast.success("Đã xóa danh mục thành công!")
        } catch (error) {
          toast.error(error.message || "Không thể xóa danh mục do có sản phẩm thuộc danh mục này.")
          setApiError(error.message)
        }
      },
    })
  }

  async function saveArticle(articleForm) {
    try {
      if (articleForm.id) {
        const updated = await api.articles.update(articleForm.id, articleForm)
        const norm = normalizeArticle(updated)
        setPosts((prev) => prev.map((p) => (p.id === articleForm.id ? norm : p)))
      } else {
        const created = await api.articles.create(articleForm)
        const norm = normalizeArticle(created)
        setPosts((prev) => [norm, ...prev])
      }
      setApiError("")
      return true
    } catch (error) {
      setApiError(error.message)
      toast.error(error.message || "Không thể lưu bài viết.")
      return false
    }
  }

  async function deleteArticle(articleId) {
    try {
      await api.articles.remove(articleId)
      setPosts((prev) => prev.filter((p) => p.id !== articleId))
      setApiError("")
      return true
    } catch (error) {
      setApiError(error.message)
      toast.error(error.message || "Không thể xóa bài viết.")
      throw error
    }
  }

  if (path === "/login") {
    return (
      <LoginPage
        onGoShop={() => navigateTo("/")}
        onLogin={handleLogin}
      />
    )
  }

  if (isAdminRoute && !user) {
    navigateTo("/login")
    return null
  }

  if (!isAdminRoute) {
    const comparedProducts = products.filter((product) =>
      compareIds.includes(product.id),
    )

    return (
      <>
        <main className="public-shell">
          <PublicHeader
            activePath={path}
            compareCount={compareIds.length}
            onCompare={() => setShowCompare(true)}
            onLoginClick={() => navigateTo("/login")}
            onNavigate={navigateTo}
            onSearch={setKeyword}
          />
          <div className="page-enter" key={path}>
            {path === "/" ? (
              <Storefront
                compareIds={compareIds}
                keyword={keyword}
                onKeywordChange={setKeyword}
                onToggleCompare={toggleCompare}
                products={products}
              />
            ) : (
              <>
                <ContentPage
                  page={path.replace("/", "")}
                  projects={posts}
                />
                <SiteFooter />
                <BranchFooter />
              </>
            )}
          </div>

          {compareIds.length > 0 && (
            <button
              className="floating-compare"
              onClick={() => setShowCompare(true)}
              type="button"
            >
              So sánh {compareIds.length} sản phẩm <b>→</b>
            </button>
          )}

          {showCompare && createPortal(
            <CompareModal
              onClose={() => setShowCompare(false)}
              onRemove={toggleCompare}
              products={comparedProducts}
            />,
            document.body,
          )}
        </main>
        <ToastProvider />
      </>
    )
  }

  return (
    <>
      <main className="admin-shell">
        <Sidebar
          activeTab={activeTab}
          onChangeTab={(tab) => navigateTo(`/admin/${tab}`)}
          onLogout={handleLogout}
          user={user}
        />
        <section className="admin-workspace">
          <AdminTopbar />
          {apiError && <div className="notice error" style={{ margin: "16px 30px 0" }}>{apiError}</div>}
          <div className="page-enter" key={activeTab}>
            {renderAdminContent()}
          </div>
        </section>
      </main>
      {confirmConfig && (
        <ConfirmModal
          isOpen={Boolean(confirmConfig)}
          message={confirmConfig.message}
          onCancel={() => setConfirmConfig(null)}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
        />
      )}
      <ToastProvider />
    </>
  )

  function renderAdminContent() {
    if (activeTab === "dashboard") {
      return <AdminDashboard products={products} user={user} onNavigate={(tab) => navigateTo(`/admin/${tab}`)} />
    }

    if (activeTab === "products") {
      return (
        <ProductsPage
          canManage
          brands={brands}
          categories={categories}
          categoryMap={categoryMap}
          editingProductId={editingProductId}
          filteredProducts={products}
          onDeleteProduct={deleteProduct}
          onEditProduct={editProduct}
          onProductFormChange={setProductForm}
          onProductSubmit={saveProduct}
          productForm={productForm}
        />
      )
    }

    if (activeTab === "categories") {
      return (
        <CategoriesPage
          canManage
          categories={categories}
          categoryForm={categoryForm}
          editingCategoryId={editingCategoryId}
          onCategoryFormChange={setCategoryForm}
          onCategorySubmit={saveCategory}
          onDeleteCategory={deleteCategory}
          onEditCategory={editCategory}
        />
      )
    }

    if (activeTab === "articles") {
      return (
        <ArticleManager
          onDeletePost={deleteArticle}
          onSavePost={saveArticle}
          posts={posts}
        />
      )
    }

    if (activeTab === "requests") {
      return <RequestsManager user={user} />
    }

    if (activeTab === "subscribers") {
      return <EmailMarketingManager user={user} />
    }

    return <AdminResourceManager module={activeTab} products={products} user={user} />
  }
}

function AdminTopbar() {
  return (
    <header className="admin-top">
      <div className="admin-search">
        ⌕ <input placeholder="Tìm kiếm nhanh..." />
      </div>
      <div>
        <button aria-label="Thông báo" type="button">♧</button>
        <button aria-label="Trợ giúp" type="button">?</button>
      </div>
    </header>
  )
}

function CompareModal({ products, onClose, onRemove }) {
  return (
    <div className="modal-backdrop">
      <div className="compare-modal">
        <button className="modal-close" onClick={onClose} type="button">×</button>
        <span>SO SÁNH SẢN PHẨM</span>
        <h2>Chọn đúng khóa, an tâm dài lâu</h2>

        {products.length < 2 ? (
          <p>Hãy chọn thêm ít nhất một sản phẩm để bắt đầu so sánh.</p>
        ) : (
          <div className="compare-table">
            <CompareLabels />
            {products.map((product) => (
              <CompareProduct
                key={product.id}
                onRemove={onRemove}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CompareLabels() {
  return (
    <div className="compare-labels">
      <b>Sản phẩm</b>
      <b>Giá</b>
      <b>Tính năng</b>
      <b>Ứng dụng</b>
      <b>Chất liệu</b>
      <b>Bảo hành</b>
      <b>Loại cửa</b>
    </div>
  )
}

function CompareProduct({ product, onRemove }) {
  return (
    <div>
      <button onClick={() => onRemove(product.id)} type="button">×</button>
      <ProductVisual compact product={product} />
      <h3>{product.name}</h3>
      <strong>{product.price ? formatMoney(product.price) : "Liên hệ"}</strong>
      <span>{product.features.join(", ")}</span>
      <span>{product.app}</span>
      <span>{product.material}</span>
      <span>{product.warrantyMonths} tháng</span>
      <span>{product.doorType}</span>
    </div>
  )
}

export default App

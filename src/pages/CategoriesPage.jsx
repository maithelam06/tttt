import CategoryForm from "../components/categories/CategoryForm"
import CategoryTable from "../components/categories/CategoryTable"

function CategoriesPage({
  canManage,
  categories,
  editingCategoryId,
  categoryForm,
  onCategoryFormChange,
  onCategorySubmit,
  onDeleteCategory,
  onEditCategory,
}) {
  return (
    <section className="content-grid">
      {canManage && (
        <CategoryForm
          editingCategoryId={editingCategoryId}
          form={categoryForm}
          onChange={onCategoryFormChange}
          onSubmit={onCategorySubmit}
        />
      )}

      <CategoryTable
        canManage={canManage}
        categories={categories}
        onDelete={onDeleteCategory}
        onEdit={onEditCategory}
      />
    </section>
  )
}

export default CategoriesPage

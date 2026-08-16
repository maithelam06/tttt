function ProductFilters({
  categories,
  features,
  selectedCategory,
  selectedFeature,
  onSelectCategory,
  onSelectFeature,
}) {
  return (
    <section className="filter-panel">
      <div>
        <span>Loại khóa</span>
        <div className="filter-chips">
          <button
            className={!selectedCategory ? "active" : ""}
            onClick={() => onSelectCategory("")}
            type="button"
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              className={selectedCategory === category.id ? "active" : ""}
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span>Tính năng</span>
        <div className="filter-chips">
          <button
            className={!selectedFeature ? "active" : ""}
            onClick={() => onSelectFeature("")}
            type="button"
          >
            Tất cả
          </button>
          {features.map((feature) => (
            <button
              className={selectedFeature === feature ? "active" : ""}
              key={feature}
              onClick={() => onSelectFeature(feature)}
              type="button"
            >
              {feature}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductFilters

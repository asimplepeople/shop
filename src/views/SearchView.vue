<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import products from '../data/products.json'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('all')
const sortBy = ref('default')

const categories = [
  { value: 'all', label: '全部' },
  { value: '厨房收纳', label: '厨房收纳' },
  { value: '客厅收纳', label: '客厅收纳' },
  { value: '衣物收纳', label: '衣物收纳' },
  { value: '桌面收纳', label: '桌面收纳' }
]

const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'rating', label: '评分最高' },
  { value: 'sales', label: '销量最高' }
]

const filteredProducts = computed(() => {
  let result = [...products]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value !== 'all') {
    const category = selectedCategory.value
    result = result.filter(product => {
      // 对于厨房收纳、客厅收纳、衣物收纳、桌面收纳等分类
      // 我们需要检查产品分类是否与这些分类相关
        return product.category.includes(category)
    })
  }

  switch (sortBy.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'sales':
      result.sort((a, b) => (b.sales || 0) - (a.sales || 0))
      break
  }

  return result
})

const updateSearchQuery = () => {
  if (searchQuery.value) {
    router.push({ query: { q: searchQuery.value } })
  } else {
    router.push({ query: {} })
  }
}

onMounted(() => {
  const q = route.query.q as string
  if (q) {
    searchQuery.value = q
  }
  
  const category = route.query.category as string
  if (category) {
    selectedCategory.value = category
  }
})

watch(() => route.query.q, (newQ) => {
  if (newQ) {
    searchQuery.value = newQ as string
  }
})

watch(() => route.query.category, (newCategory) => {
  if (newCategory) {
    selectedCategory.value = newCategory as string
  }
})
</script>

<template>
  <div class="search-page">
    <div class="search-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">探索产品</h1>
          <p class="page-subtitle">发现适合您家居风格的优质产品</p>
        </div>

        <div class="search-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="搜索产品..."
              @input="updateSearchQuery"
            />
            <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="search-content">
      <div class="container">
        <div class="filters-bar">
          <div class="filter-group">
            <label class="filter-label">分类</label>
            <div class="category-tabs">
              <button
                v-for="cat in categories.slice(0, 5)"
                :key="cat.value"
                class="category-tab"
                :class="{ active: selectedCategory === cat.value }"
                @click="selectedCategory = cat.value"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">排序</label>
            <select v-model="sortBy" class="sort-select">
              <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="results-info">
          <span class="results-count">共 {{ filteredProducts.length }} 件产品</span>
          <span v-if="searchQuery" class="search-term">搜索: "{{ searchQuery }}"</span>
        </div>

        <div v-if="filteredProducts.length > 0" class="products-grid">
          <article v-for="product in filteredProducts" :key="product.id" class="product-card">
            <router-link :to="`/product/${product.id}`" class="product-link">
              <div class="product-image">
                <img :src="product.images[0]" :alt="product.name" loading="lazy" />
                <div class="product-overlay">
                  <span class="view-btn">查看详情</span>
                </div>
              </div>
              <div class="product-content">
                <span class="product-category">{{ product.category }}</span>
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-footer">
                  <span class="product-price">{{ product.isUSD ? '$' : '¥' }}{{ product.price.toLocaleString() }}</span>
                  <div class="product-sales">
                    已售 {{ product.sales || 0 }} 件
                  </div>
                  <div class="product-rating">
                    <svg v-for="i in 5" :key="i" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ filled: i <= Math.floor(product.rating) }">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span class="rating-value">{{ product.rating }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </article>
        </div>

        <div v-else class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <h3 class="empty-title">未找到相关产品</h3>
          <p class="empty-text">尝试使用其他关键词或筛选条件</p>
          <button class="btn btn-secondary" @click="searchQuery = ''; selectedCategory = 'all'">
            清除筛选
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  min-height: 100vh;
  padding-top: 100px;
}

.search-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
  padding: var(--spacing-3xl) 0;
}

.header-content {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.page-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-muted);
}

.search-bar {
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  transition: all var(--transition-fast);
}

.search-input-wrapper:focus-within {
  border-color: var(--accent-gold);
  box-shadow: 0 0 0 3px rgba(126, 213, 210, 0.1);
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 1rem;
  color: var(--text-primary);
  padding: 0;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.clear-btn {
  color: var(--text-muted);
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.clear-btn:hover {
  color: var(--text-primary);
}

.search-content {
  padding: var(--spacing-3xl) 0;
}

.filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.category-tabs {
  display: flex;
  gap: var(--spacing-xs);
}

.category-tab {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.category-tab:hover {
  border-color: var(--border-medium);
  color: var(--text-primary);
}

.category-tab.active {
  background: var(--accent-gold);
  border-color: var(--accent-gold);
  color: var(--bg-primary);
}

.sort-select {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.results-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.results-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.search-term {
  font-size: 0.875rem;
  color: var(--accent-gold);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-xl);
}

.product-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
}

.product-card:hover {
  border-color: var(--border-light);
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.product-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.product-image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-card:hover .product-image img {
  transform: scale(1.08);
}

.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 10, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.view-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--accent-gold);
  color: var(--bg-primary);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  transform: translateY(10px);
  transition: transform var(--transition-base);
}

.product-card:hover .view-btn {
  transform: translateY(0);
}

.product-content {
  padding: var(--spacing-lg);
}

.product-category {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-sm);
}

.product-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  line-height: 1.3;
}

.product-footer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  align-items: flex-start;
}

.product-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.product-sales {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 2px;
}

.product-rating svg {
  color: var(--text-muted);
}

.product-rating svg.filled {
  color: var(--accent-gold);
}

.rating-value {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-left: var(--spacing-xs);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-4xl) 0;
}

.empty-state svg {
  color: var(--text-muted);
  margin-bottom: var(--spacing-xl);
}

.empty-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.empty-text {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: var(--spacing-xl);
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .category-tabs {
    flex-wrap: wrap;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>

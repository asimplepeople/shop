<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import products from '../data/products.json'

const router = useRouter()
const favoriteItems = ref([])

// 从localStorage中加载收藏数据
const loadFavoritesFromStorage = () => {
  try {
    const favoritesData = localStorage.getItem('favorites')
    if (favoritesData) {
      favoriteItems.value = JSON.parse(favoritesData)
    }
  } catch (error) {
    console.error('Failed to load favorites from localStorage:', error)
    favoriteItems.value = []
  }
}

// 保存收藏数据到localStorage
const saveFavoritesToStorage = () => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favoriteItems.value))
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error)
  }
}

// 移除收藏
const removeFavorite = (productId: number) => {
  favoriteItems.value = favoriteItems.value.filter(item => item !== productId)
  saveFavoritesToStorage()
}

// 继续购物
const continueShopping = () => {
  router.push('/')
}

// 获取商品信息
const getProductInfo = (productId: number) => {
  return products.find(p => p.id === productId)
}

onMounted(() => {
  loadFavoritesFromStorage()
})
</script>

<template>
  <div class="favorites-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">我的收藏</h1>
        <p class="page-subtitle">查看您已收藏的商品</p>
      </div>

      <div v-if="favoriteItems.length === 0" class="empty-favorites">
        <div class="empty-favorites-content">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h3>还没有收藏商品</h3>
          <p>您还没有收藏任何商品</p>
          <router-link to="/" class="btn btn-primary">去购物</router-link>
        </div>
      </div>

      <div v-else class="favorites-content">
        <div class="favorites-grid">
          <div v-for="productId in favoriteItems" :key="productId" class="favorite-card">
            <div class="favorite-image">
              <router-link :to="`/product/${productId}`">
                <img :src="getProductInfo(productId)?.images[0]" :alt="getProductInfo(productId)?.name" />
              </router-link>
              <button class="remove-btn" @click="removeFavorite(productId)" aria-label="取消收藏">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            <div class="favorite-content">
              <router-link :to="`/product/${productId}`" class="favorite-name">{{ getProductInfo(productId)?.name }}</router-link>
              <div class="favorite-meta">
                <span class="favorite-price">{{ getProductInfo(productId)?.isUSD ? '$' : '¥' }}{{ getProductInfo(productId)?.price.toLocaleString() }}</span>
                <span class="favorite-sales">已售 {{ getProductInfo(productId)?.sales || 0 }} 件</span>
              </div>
            </div>
          </div>
        </div>
        <div class="favorites-actions">
          <button class="btn btn-secondary" @click="continueShopping">继续购物</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorites-page {
  padding-top: 120px;
  padding-bottom: var(--spacing-4xl);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.page-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
}

.empty-favorites {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.empty-favorites-content {
  text-align: center;
  max-width: 400px;
}

.empty-favorites-content svg {
  color: var(--text-muted);
  margin-bottom: var(--spacing-lg);
}

.empty-favorites-content h3 {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-favorites-content p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.favorites-content {
  max-width: 1200px;
  margin: 0 auto;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
}

.favorite-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.favorite-image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.favorite-card:hover .favorite-image img {
  transform: scale(1.05);
}

.remove-btn {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  z-index: 1;
}

.remove-btn:hover {
  background: var(--accent-red);
  color: white;
}

.favorite-content {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.favorite-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.favorite-name:hover {
  color: var(--primary-color);
}

.favorite-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.favorite-sales {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.favorites-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-2xl);
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style>

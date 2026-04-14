<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import products from '../data/products.json'
import Alert from '../components/common/Alert.vue'

const route = useRoute()
const router = useRouter()
const product = ref<any>(null)
const loading = ref(true)
const selectedSize = ref<any>(null)
const currentImageIndex = ref(0)
const isZoomed = ref(false)
const isSkuZoomed = ref(false)
const currentSkuImage = ref('')
const quantity = ref(1)

const formatPrice = (price: number, isUSD?: boolean) => {
  const symbol = isUSD ? '$' : '¥'
  return `${symbol}${price.toLocaleString()}`
}

const loadProduct = () => {
  loading.value = true
  const id = parseInt(route.params.id as string)
  const foundProduct = products.find(p => p.id === id)
  if (foundProduct) {
    product.value = foundProduct
    selectedSize.value = foundProduct.sizes?.[0]
    currentImageIndex.value = 0
    quantity.value = 1
  } else {
    router.push('/')
  }
  loading.value = false
}

onMounted(() => {
  loadProduct()
})

watch(() => route.params.id, () => {
  loadProduct()
})

const handleSizeChange = (size: any) => {
  selectedSize.value = size
}

const getImageAlt = (product: any, index: string | number) => {
  return `${String(product.name)} - 图片 ${Number(index) + 1}`
}

const nextImage = () => {
  if (product.value) {
    currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length
  }
}

// 放大SKU图片
const zoomSkuImage = (image: string) => {
  currentSkuImage.value = image
  isSkuZoomed.value = true
}

// 加入购物车
const addToCart = () => {
  if (!product.value) {
    showAlert('商品信息加载中，请稍候')
    return
  }

  if (!product.value.sizes && !selectedSize.value) {
    showAlert('请选择商品尺寸')
    return
  }

  try {
    // 从localStorage加载购物车数据
    const cartData = localStorage.getItem('cart')
    const cart = cartData ? JSON.parse(cartData) : []

    const size = selectedSize.value?.size || '默认'

    // 检查商品是否已经在购物车中
    const existingItemIndex = cart.findIndex((item: any) =>
      item.productId === product.value.id && item.size === size
    )

    if (existingItemIndex !== -1) {
      // 如果商品已经在购物车中，增加数量
      cart[existingItemIndex].quantity += quantity.value
    } else {
      // 如果商品不在购物车中，添加新商品
      cart.push({
        productId: product.value.id,
        size: size,
        quantity: quantity.value
      })
    }

    // 保存购物车数据到localStorage
    localStorage.setItem('cart', JSON.stringify(cart))

    // 提示用户商品已添加到购物车
    showAlert('商品已添加到购物车')
  } catch (error) {
    console.error('Failed to add item to cart:', error)
    showAlert('添加商品到购物车失败，请重试')
  }
}

// 响应式变量，用于触发isFavorite的重新计算
const favoriteUpdateTrigger = ref(0)

// 弹窗相关变量
const alertVisible = ref(false)
const alertMessage = ref('')

// 显示弹窗
const showAlert = (message: string) => {
  alertMessage.value = message
  alertVisible.value = true
}

// 关闭弹窗
const closeAlert = () => {
  alertVisible.value = false
}

// 检查商品是否已收藏
const isFavorite = computed(() => {
  // 依赖favoriteUpdateTrigger，当它变化时重新计算
  favoriteUpdateTrigger.value
  
  if (!product.value) return false
  
  try {
    const favoritesData = localStorage.getItem('favorites')
    const favorites = favoritesData ? JSON.parse(favoritesData) : []
    return favorites.includes(product.value.id)
  } catch (error) {
    console.error('Failed to check favorite status:', error)
    return false
  }
})

// 收藏商品
const toggleFavorite = () => {
  if (!product.value) return
  
  try {
    // 从localStorage加载收藏数据
    const favoritesData = localStorage.getItem('favorites')
    const favorites = favoritesData ? JSON.parse(favoritesData) : []
    
    // 检查商品是否已经在收藏列表中
    const existingIndex = favorites.indexOf(product.value.id)
    
    if (existingIndex !== -1) {
      // 如果商品已经在收藏列表中，移除
      favorites.splice(existingIndex, 1)
      showAlert('商品已从收藏列表中移除')
    } else {
      // 如果商品不在收藏列表中，添加
      favorites.push(product.value.id)
      showAlert('商品已添加到收藏列表')
    }
    
    // 保存收藏数据到localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites))
    
    // 更新触发器，触发isFavorite重新计算
    favoriteUpdateTrigger.value++
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
    showAlert('操作失败，请重试')
  }
}

const prevImage = () => {
  if (product.value) {
    currentImageIndex.value = (currentImageIndex.value - 1 + product.value.images.length) % product.value.images.length
  }
}

const selectImage = (index: number) => {
  currentImageIndex.value = index
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const relatedProducts = computed(() => {
  if (!product.value) return []
  const filtered = products.filter(p => p.category === product.value.category && p.id !== product.value.id)
  console.log('相关产品:', filtered)
  return filtered.slice(0, 4)
})
</script>

<template>
  <div class="product-detail">
    <div class="container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>

      <template v-else-if="product">
        <nav class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <router-link to="/search">产品</router-link>
          <span class="separator">/</span>
          <span class="current">{{ product.name }}</span>
        </nav>

        <div class="product-main">
          <div class="product-gallery">
            <div class="main-image" @click="isZoomed = !isZoomed">
              <img :src="product.images[currentImageIndex]" :alt="product.name" />
              <button class="zoom-btn" aria-label="放大">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                </svg>
              </button>
            </div>

            <div class="image-nav">
              <button class="nav-btn" @click="prevImage" aria-label="上一张">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <div class="thumbnails">
                <button
                  v-for="(image, index) in product.images"
                  :key="index"
                  class="thumbnail"
                  :class="{ active: index === currentImageIndex }"
                  @click="selectImage(Number(index))"
                >
                  <img :src="image" :alt="`${product.name} - ${Number(index) + 1}`" />
                </button>
              </div>
              <button class="nav-btn" @click="nextImage" aria-label="下一张">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="product-info">
            <div class="product-header">
              <span class="product-category">{{ product.category }}</span>
              <h1 class="product-title">{{ product.name }}</h1>
              <div class="product-meta">
                <span class="model-id">型号: {{ product.modelId }}</span>
                <span class="product-sales">已售 {{ product.sales }} 件</span>
                <div class="product-rating">
                  <svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" :class="{ filled: i <= Math.floor(product.rating) }">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="rating-value">{{ product.rating }}</span>
                </div>
              </div>
            </div>

            <div class="product-price-section">
              <span class="price-label">价格</span>
              <span class="price-value">{{ formatPrice(selectedSize?.price || product.price, product.isUSD || selectedSize?.isUSD) }}</span>
            </div>

            <div class="size-section">
              <h3 class="section-label">选择尺寸</h3>
              <div class="size-options">
                <button
                  v-for="size in (product.sizes || [])"
                  :key="size.size"
                  class="size-btn"
                  :class="{ active: selectedSize?.size === size.size }"
                  @click="handleSizeChange(size)"
                >
                  <div v-if="size.image" class="size-image" @click="zoomSkuImage(size.image)">
                    <img :src="size.image" :alt="size.size" />
                    <div class="zoom-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                      </svg>
                    </div>
                  </div>
                  <span class="size-name">{{ size.size }}</span>
                  <span class="size-price">{{ formatPrice(size.price || 0, size.isUSD || product.isUSD) }}</span>
                </button>
              </div>
            </div>

            <div class="quantity-section">
              <h3 class="section-label">数量</h3>
              <div class="quantity-control">
              <button class="qty-btn" @click="decreaseQuantity" :disabled="quantity <= 1">−</button>
              <input 
                type="number" 
                class="qty-value" 
                v-model.number="quantity" 
                min="1"
              />
              <button class="qty-btn" @click="increaseQuantity">+</button>
            </div>
            </div>

            <div class="action-buttons">
              <button class="btn btn-primary btn-lg" @click="addToCart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                加入购物车
              </button>
              <button class="btn btn-secondary btn-lg" :class="{ active: isFavorite }" @click="toggleFavorite">
                <svg width="20" height="20" viewBox="0 0 24 24" :fill="isFavorite ? 'white' : 'none'" :stroke="isFavorite ? 'white' : 'currentColor'" stroke-width="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {{ isFavorite ? '已收藏' : '收藏' }}
              </button>
            </div>

            <div class="product-description">
              <h3 class="section-label">产品描述</h3>
              <p>{{ product.description }}</p>
            </div>

            <div class="product-features">
              <div class="feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <span>免费配送</span>
              </div>
              <div class="feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>品质保证</span>
              </div>
              <div class="feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                <span>7天退换</span>
              </div>
            </div>

            <div class="product-info">
              <h3 class="section-label">商品信息</h3>
              <div class="info-table">
                <div class="info-row">
                  <div class="info-label">尺寸</div>
                  <div class="info-value">{{ product.info?.size || '标准' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">重量</div>
                  <div class="info-value">{{ product.info?.weight || '-' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">颜色</div>
                  <div class="info-value">{{ product.info?.color || '-' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">材质</div>
                  <div class="info-value">{{ product.info?.material || '-' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">包装</div>
                  <div class="info-value">{{ product.info?.package || '-' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">产地</div>
                  <div class="info-value">{{ product.info?.origin || '-' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">保修期</div>
                  <div class="info-value">{{ product.info?.warranty || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section class="product-description-section">
          <div class="section-header">
            <h2 class="section-title">产品描述</h2>
          </div>
          <div class="description-content">
            <p class="description-text">{{ product.description }}</p>
            <div v-if="product.video" class="description-video">
              <video controls class="video-player">
                <source :src="product.video" type="video/mp4">
                您的浏览器不支持视频播放。
              </video>
            </div>
            <div class="description-images">
              <div v-for="(image, index) in (product.descriptionImages || product.images)" :key="index" class="description-image-container">
                <img :src="image" :alt="getImageAlt(product, index)" class="description-image" />
              </div>
            </div>
          </div>
        </section>

        <section v-if="relatedProducts.length > 0" class="related-section">
          <div class="section-header">
            <h2 class="section-title">相关产品</h2>
          </div>
          <div class="related-grid">
            <article v-for="item in relatedProducts" :key="item.id" class="related-card">
              <router-link :to="`/product/${item.id}`" class="related-link">
                <div class="related-image">
                  <img :src="item.images[0]" :alt="item.name" loading="lazy" />
                </div>
                <div class="related-content">
                  <h4 class="related-name">{{ item.name }}</h4>
                  <span class="related-sales">已售 {{ item.sales || 0 }} 件</span>
                  <span class="related-price">{{ formatPrice(item.sizes?.[0]?.price || item.price || 0, item.isUSD || item.sizes?.[0]?.isUSD) }}</span>
                </div>
              </router-link>
            </article>
          </div>
        </section>
      </template>
    </div>

    <Transition name="zoom">
      <div v-if="isZoomed" class="zoom-overlay" @click="isZoomed = false">
        <img :src="product?.images[currentImageIndex]" :alt="product?.name" />
        <button class="close-btn" @click="isZoomed = false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </Transition>
    
    <!-- SKU图片放大覆盖层 -->
    <Transition name="zoom">
      <div v-if="isSkuZoomed" class="zoom-overlay" @click="isSkuZoomed = false">
        <img :src="currentSkuImage" :alt="'SKU图片'" />
        <button class="close-btn" @click="isSkuZoomed = false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </Transition>
    
    <!-- 弹窗组件 -->
    <Alert 
      :visible="alertVisible" 
      :message="alertMessage"
      @close="closeAlert"
    />
  </div>
</template>

<style scoped>
.product-detail {
  padding-top: 120px;
  padding-bottom: var(--spacing-4xl);
  min-height: 100vh;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--spacing-lg);
  color: var(--text-muted);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-light);
  border-top-color: var(--accent-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
  font-size: 0.875rem;
}

.breadcrumb a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breadcrumb a:hover {
  color: var(--accent-gold);
}

.breadcrumb .separator {
  color: var(--text-muted);
  opacity: 0.5;
}

.breadcrumb .current {
  color: var(--text-secondary);
}

.product-main {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: var(--spacing-4xl);
  margin-bottom: var(--spacing-4xl);
}

@media (max-width: 1200px) {
  .product-main {
    grid-template-columns: 400px 1fr;
  }
}

@media (max-width: 992px) {
  .product-main {
    grid-template-columns: 1fr;
  }
}

.product-gallery {
  position: sticky;
  top: 120px;
  align-self: start;
}

.main-image {
  position: relative;
  aspect-ratio: 4/3;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: zoom-in;
  margin-bottom: var(--spacing-lg);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.main-image:hover img {
  transform: scale(1.02);
}

.zoom-btn {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.main-image:hover .zoom-btn {
  opacity: 1;
}

.image-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.nav-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.thumbnails {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  flex: 1;
  padding: var(--spacing-xs) 0;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 2px solid transparent;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:hover {
  border-color: var(--border-light);
}

.thumbnail.active {
  border-color: var(--accent-gold);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.product-header {
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-subtle);
}

.product-category {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-md);
}

.product-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  line-height: 1.2;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.model-id {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.product-sales {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.product-rating svg {
  color: var(--text-muted);
}

.product-rating svg.filled {
  color: var(--accent-gold);
}

.rating-value {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-left: var(--spacing-sm);
}

.product-price-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.price-label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.price-value {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--text-primary);
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.size-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  min-width: 120px;
}

.size-btn:hover {
  border-color: var(--border-medium);
  background: var(--bg-tertiary);
}

.size-btn.active {
  border-color: var(--accent-gold);
  background: rgba(126, 213, 210, 0.1);
}

.size-image {
  width: 80px;
  height: 80px;
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: zoom-in;
  overflow: hidden;
}

.size-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform var(--transition-fast);
}

.size-image:hover img {
  transform: scale(1.05);
}

.zoom-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-fast);
  z-index: 1;
}

.size-image:hover .zoom-icon {
  opacity: 1;
}

.size-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  text-align: center;
}

.size-price {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
}

.size-btn.active .size-price {
  color: var(--accent-gold);
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
}

.qty-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.qty-btn:hover:not(:disabled) {
  color: var(--accent-gold);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  width: 60px;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 4px;
  background: var(--bg-tertiary);
}

.qty-value:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.btn-lg {
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: 0.875rem;
}

.btn-secondary.active {
  background: #63b3ed;
  color: white;
  border-color: #63b3ed;
  box-shadow: 0 4px 12px rgba(99, 179, 237, 0.3);
  transform: translateY(-2px);
  transition: all var(--transition-fast);
}

.btn-secondary.active:hover {
  background: #63b3ed;
  border-color: #63b3ed;
  box-shadow: 0 6px 16px rgba(99, 179, 237, 0.4);
  transform: translateY(-3px);
  opacity: 0.95;
  transition: all var(--transition-fast);
}

.product-description {
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-subtle);
}

.product-description p {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.product-features {
  display: flex;
  gap: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.feature {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.feature svg {
  color: var(--accent-gold);
}

.related-section {
  padding-top: var(--spacing-3xl);
  border-top: 1px solid var(--border-subtle);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.related-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.related-card:hover {
  border-color: var(--border-light);
  transform: translateY(-4px);
}

.related-link {
  display: block;
  text-decoration: none;
  color: inherit;
  width: 100%;
  height: 100%;
}

.related-image {
  aspect-ratio: 4/3;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.related-card:hover .related-image img {
  transform: scale(1.05);
}

.related-content {
  padding: var(--spacing-md);
}

.related-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.related-sales {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: var(--spacing-xs);
}

.related-price {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent-gold);
}

.product-info {
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-2xl);
  border-top: 1px solid var(--border-subtle);
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-md);
}

.info-row {
  display: flex;
  border-bottom: 1px solid var(--border-subtle);
}

.info-label {
  flex: 0 0 120px;
  padding: var(--spacing-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
}

.info-value {
  flex: 1;
  padding: var(--spacing-md);
  font-size: 0.875rem;
  color: var(--text-primary);
}

.info-row:last-child {
  border-bottom: none;
}

.product-description-section {
  margin-top: var(--spacing-4xl);
  padding-top: var(--spacing-4xl);
  border-top: 1px solid var(--border-subtle);
}

.description-content {
  margin-top: var(--spacing-2xl);
}

.description-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: var(--spacing-2xl);
}

.description-video {
  margin-top: var(--spacing-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
}

.video-player {
  max-width: 100%;
  max-height: 600px;
  border-radius: var(--radius-md);
}

.description-images {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: var(--spacing-2xl);
}

.description-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  min-height: 300px;
}

.description-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--radius-md);
}

@media (max-width: 768px) {
  .video-player {
    max-height: 400px;
  }
  
  .description-image-container {
    min-height: 200px;
  }
}

.zoom-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: zoom-out;
}

.zoom-overlay img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: var(--spacing-xl);
  right: var(--spacing-xl);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all var(--transition-base);
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
}

.zoom-enter-from img,
.zoom-leave-to img {
  transform: scale(0.9);
}

@media (max-width: 1024px) {
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .product-detail {
    padding-top: 100px;
  }

  .product-main {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }

  .product-gallery {
    position: static;
  }

  .action-buttons {
    flex-direction: column;
  }

  .product-features {
    flex-wrap: wrap;
    gap: var(--spacing-lg);
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>

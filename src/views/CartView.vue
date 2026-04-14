<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import products from '../data/products.json'
import ContactModal from '../components/common/ContactModal.vue'

interface CartItem {
  productId: number
  size: string
  quantity: number
}

const router = useRouter()
const cartItems = ref<CartItem[]>([])

// 弹窗相关变量
const modalVisible = ref(false)
const modalMessage = ref('')

// 显示弹窗
const showModal = (message: string) => {
  modalMessage.value = message
  modalVisible.value = true
}

// 关闭弹窗
const closeModal = () => {
  modalVisible.value = false
}

// 从cookie中加载购物车数据
const loadCartFromCookie = () => {
  try {
    const cartData = localStorage.getItem('cart')
    if (cartData) {
      cartItems.value = JSON.parse(cartData)
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    cartItems.value = []
  }
}

// 保存购物车数据到cookie
const saveCartToCookie = () => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

// 计算购物车总价
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId)
    const size = product?.sizes?.find(s => s.size === item.size)
    const price = size?.price || product?.price || 0
    return total + price * item.quantity
  }, 0)
})

// 计算购物车总数量
const totalQuantity = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

// 增加商品数量
const increaseQuantity = (index: number) => {
  cartItems.value[index].quantity += 1
  saveCartToCookie()
}

// 减少商品数量
const decreaseQuantity = (index: number) => {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity -= 1
    saveCartToCookie()
  }
}

// 删除商品
const removeItem = (index: number) => {
  cartItems.value.splice(index, 1)
  saveCartToCookie()
}

// 清空购物车
const clearCart = () => {
  cartItems.value = []
  saveCartToCookie()
}

// 继续购物
const continueShopping = () => {
  router.push('/')
}

// 结算（暂时不接入支付）
const checkout = () => {
  showModal('如需批量采购或定制服务，请拨打下方电话咨询')
}

// 获取商品信息
const getProductInfo = (productId: number) => {
  return products.find(p => p.id === productId)
}

// 获取商品尺寸信息
const getSizeInfo = (productId: number, size: string) => {
  const product = getProductInfo(productId)
  return product?.sizes?.find(s => s.size === size)
}

onMounted(() => {
  loadCartFromCookie()
})
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">购物车</h1>
        <p class="page-subtitle">查看您已添加的商品</p>
      </div>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-content">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h3>购物车是空的</h3>
          <p>您还没有添加任何商品到购物车</p>
          <router-link to="/" class="btn btn-primary">去购物</router-link>
        </div>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="(item, index) in cartItems" :key="`${item.productId}-${item.size}`" class="cart-item">
            <div class="cart-item-image">
              <img :src="getSizeInfo(item.productId, item.size)?.image || getProductInfo(item.productId)?.images[0]" :alt="getProductInfo(item.productId)?.name" />
            </div>
            <div class="cart-item-info">
              <h3 class="cart-item-name">{{ getProductInfo(item.productId)?.name }}</h3>
              <p class="cart-item-size">尺寸：{{ item.size }}</p>
              <p class="cart-item-price">{{ getProductInfo(item.productId)?.isUSD ? '$' : '¥' }}{{ ((getSizeInfo(item.productId, item.size)?.price || getProductInfo(item.productId)?.price || 0)).toLocaleString() }}</p>
            </div>
            <div class="cart-item-quantity">
              <button class="qty-btn" @click="decreaseQuantity(index)" :disabled="item.quantity <= 1">−</button>
              <input 
                type="number" 
                class="qty-value" 
                v-model.number="cartItems[index].quantity" 
                min="1" 
                @change="saveCartToCookie"
              />
              <button class="qty-btn" @click="increaseQuantity(index)">+</button>
            </div>
            <div class="cart-item-total">
              {{ getProductInfo(item.productId)?.isUSD ? '$' : '¥' }}{{ (((getSizeInfo(item.productId, item.size)?.price || getProductInfo(item.productId)?.price || 0) * item.quantity)).toLocaleString() }}
            </div>
            <div class="cart-item-actions">
              <button class="remove-btn" @click="removeItem(index)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <h3 class="summary-title">订单 summary</h3>
          <div class="summary-item">
            <span>商品数量</span>
            <span>{{ totalQuantity }}</span>
          </div>
          <div class="summary-item">
            <span>商品总价</span>
            <span>{{ cartItems[0]?.productId ? (getProductInfo(cartItems[0]?.productId)?.isUSD ? '$' : '¥') : '¥' }}{{ totalPrice.toLocaleString() }}</span>
          </div>
          <div class="summary-item total">
            <span>总计</span>
            <span>{{ cartItems[0]?.productId ? (getProductInfo(cartItems[0]?.productId)?.isUSD ? '$' : '¥') : '¥' }}{{ totalPrice.toLocaleString() }}</span>
          </div>
          <div class="summary-actions">
            <button class="btn btn-secondary" @click="continueShopping">继续购物</button>
            <button class="btn btn-primary" @click="checkout">结算</button>
          </div>
          <button class="clear-cart-btn" @click="clearCart">清空购物车</button>
        </div>
      </div>
      
      <!-- 弹窗组件 -->
      <ContactModal 
        :visible="modalVisible" 
        :message="modalMessage"
        @close="closeModal"
      />
    </div>
  </div>
</template>

<style scoped>
.cart-page {
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

.empty-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.empty-cart-content {
  text-align: center;
  max-width: 400px;
}

.empty-cart-content svg {
  color: var(--text-muted);
  margin-bottom: var(--spacing-lg);
}

.empty-cart-content h3 {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-cart-content p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: var(--spacing-2xl);
}

.cart-items {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr 120px 120px 60px;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-subtle);
  align-items: center;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.cart-item-size {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.cart-item-price {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 4px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.qty-btn:hover:not(:disabled) {
  color: var(--primary-color);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  width: 60px;
  text-align: center;
  font-size: 0.875rem;
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

.cart-item-total {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
}

.cart-item-actions {
  display: flex;
  justify-content: flex-end;
}

.remove-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.remove-btn:hover {
  color: var(--accent-red);
}

.cart-summary {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  position: sticky;
  top: 140px;
}

.summary-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.summary-item.total {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-subtle);
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.clear-cart-btn {
  width: 100%;
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: transparent;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.clear-cart-btn:hover {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

@media (max-width: 992px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
  
  .cart-item {
    grid-template-columns: 80px 1fr 100px 100px 50px;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
  }
  
  .cart-item-image {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
    text-align: center;
  }
  
  .cart-item-image {
    margin: 0 auto;
  }
  
  .cart-item-quantity {
    justify-content: center;
  }
  
  .cart-item-total {
    text-align: center;
  }
  
  .cart-item-actions {
    justify-content: center;
  }
}
</style>

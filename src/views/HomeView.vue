<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import products from '../data/products.json'

const currentSlide = ref(0)
const isAutoPlaying = ref(true)
let slideInterval: ReturnType<typeof setInterval> | null = null

const slides = [
  {
    id: 1,
    title: '厨房收纳',
    subtitle: 'Kitchen Storage',
    description: '一站式厨房收纳解决方案，让您的烹饪空间整洁有序，告别杂乱，享受轻松烹饪时光。',
    image: '/shop/首页/厨房收纳.png'
  },
  {
    id: 2,
    title: '客厅收纳',
    subtitle: 'Living Room Storage',
    description: '时尚美观的客厅收纳产品，为您的家居空间增添一抹亮色，让生活更加精致有序。',
    image: '/shop/首页/客厅收纳.png'
  },
  {
    id: 3,
    title: '卧室收纳',
    subtitle: 'Bedroom Storage',
    description: '温馨舒适的卧室收纳方案，为您打造一个宁静整洁的私人空间，享受高质量睡眠。',
    image: '/shop/首页/卧室收纳.png'
  }
]

const categories = [
  { id: 1, name: '厨房收纳', nameEn: 'Kitchen Storage', count: 8, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kitchen%20storage%20organizer%2C%20modern%20design%2C%20clean%20lines%2C%20minimalist%20style&image_size=landscape_16_9' },
  { id: 2, name: '客厅收纳', nameEn: 'Living Room Storage', count: 8, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=living%20room%20storage%20solutions%2C%20elegant%20design%2C%20minimalist%20style&image_size=landscape_16_9' },
  { id: 3, name: '衣物收纳', nameEn: 'Clothing Storage', count: 8, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=clothing%20storage%20organization%2C%20wardrobe%20organizer%2C%20minimalist%20style&image_size=landscape_16_9' },
  { id: 4, name: '桌面收纳', nameEn: 'Desktop Storage', count: 8, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=desktop%20storage%20organizer%2C%20office%20supplies%2C%20minimalist%20design&image_size=landscape_16_9' }
]

const hotProducts = ref(products.sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 4))

const stats = [
  { value: '50K+', label: '满意客户' },
  { value: '99%', label: '好评率' },
  { value: '24/7', label: '贴心服务' }
]

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const startAutoPlay = () => {
  if (slideInterval) clearInterval(slideInterval)
  slideInterval = setInterval(nextSlide, 6000)
}

const stopAutoPlay = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

onMounted(() => {
  if (isAutoPlaying.value) {
    startAutoPlay()
  }
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-slides">
        <TransitionGroup name="slide-fade">
          <div
            v-for="(slide, index) in slides"
            :key="slide.id"
            v-show="index === currentSlide"
            class="hero-slide"
          >
            <div class="hero-image">
              <img :src="slide.image" :alt="slide.title" />
              <div class="hero-overlay"></div>
            </div>
            <div class="hero-content">
              <span class="hero-subtitle">{{ slide.subtitle }}</span>
              <h1 class="hero-title">{{ slide.title }}</h1>
              <p class="hero-description">{{ slide.description }}</p>
              <div class="hero-actions">
                <router-link to="/search" class="btn btn-primary">探索产品</router-link>
                <router-link to="/about" class="btn btn-secondary">了解更多</router-link>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <div class="hero-nav">
        <button class="nav-btn prev" @click="prevSlide" aria-label="上一张">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button class="nav-btn next" @click="nextSlide" aria-label="下一张">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <div class="hero-indicators">
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="indicator"
          :class="{ active: index === currentSlide }"
          @click="goToSlide(index)"
        >
          <span class="indicator-label">{{ String(index + 1).padStart(2, '0') }}</span>
        </button>
      </div>

      <div class="scroll-hint">
        <span>向下滚动</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </section>

    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>



    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Categories</span>
          <h2 class="section-title">产品分类</h2>
          <p class="section-subtitle">探索不同风格的家居产品，找到最适合您的那一款</p>
        </div>

        <div class="categories-grid">
          <router-link v-for="category in categories" :key="category.id" :to="{ path: '/search', query: { category: category.name } }" class="category-card">
            <div class="category-image">
              <img :src="category.image" :alt="category.name" loading="lazy" />
              <div class="category-overlay"></div>
            </div>
            <div class="category-content">
              <span class="category-name-en">{{ category.nameEn }}</span>
              <h3 class="category-name">{{ category.name }}</h3>
              <span class="category-count">{{ category.count }} 件产品</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <section class="hot-section section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Hot</span>
          <h2 class="section-title">近期热销</h2>
          <p class="section-subtitle">销量领先的热门产品，限时优惠中</p>
        </div>

        <div class="products-grid">
          <article v-for="product in hotProducts" :key="product.id" class="product-card">
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
      </div>
    </section>

    <section class="about-section section">
      <div class="container">
        <div class="about-grid">
          <div class="about-content">
            <span class="section-tag">ABOUT US</span>
            <h2 class="about-title">精工模塑，全球日用好物智造者</h2>
            <p class="about-text">
              根植于"中国模具之乡""中国塑料日用品之都"——浙江台州黄岩，我们依托当地数十年积淀的模塑产业集群优势，专注于收纳用品、日用百货、塑料结构件的研发、生产与全球批发供应。我们始终坚信，优质的日常好物，源于对工艺的极致打磨与对全球市场需求的深刻洞察。每一件产品都经过严格的品控筛选，在设计、耐用性与实用性之间实现完美平衡，致力于为全球客户提供高性价比、稳定可靠的一站式供应链解决方案。
            </p>
            <p class="about-text">
              我们的产品理念，融合了黄岩"工业之母"的精密制造基因与"少即是多"的实用美学，以成熟的模具开发与注塑工艺赋能民用好物。从模具设计到批量生产，每一道工序都凝聚着匠人的心血，每一处细节都经过反复推敲，让每一件产品都能真正适配全球不同市场的生活场景，为全球消费者带来便捷、安心的日常体验，为合作伙伴创造长期价值。
            </p>
            <router-link to="/about" class="btn btn-primary">了解更多</router-link>
          </div>
          <div class="about-image">
            <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20brand%20philosophy%20visual%2C%20clean%20design%2C%20modern%20aesthetic%2C%20luxury%20dark%20theme&image_size=landscape_16_9" alt="关于我们" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">如果你有定制需求或者对价格有顾虑可以留下你的联系方式</h2>
          <p class="cta-text">我们的客服团队会在 24 小时内与您联系，为您提供专属解决方案</p>
          <form class="cta-form" @submit.prevent>
            <input type="text" placeholder="您的姓名" class="cta-input" />
            <input type="tel" placeholder="联系电话" class="cta-input" />
            <input type="email" placeholder="邮箱地址" class="cta-input" />
            <textarea placeholder="您的需求或问题" class="cta-textarea"></textarea>
            <button type="submit" class="btn btn-primary">提交</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
}

.hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  overflow: hidden;
}

.hero-slides {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  position: absolute;
  inset: 0;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(99, 179, 237, 0.1) 0%,
    rgba(99, 179, 237, 0.05) 50%,
    transparent 100%
  );
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 0 var(--spacing-xl);
}

.hero-subtitle {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-lg);
  opacity: 0;
  animation: fadeInDown 0.8s ease forwards;
  animation-delay: 0.2s;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.1;
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.4s;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto var(--spacing-2xl);
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.6s;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.8s;
}

.hero-nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 var(--spacing-xl);
  z-index: 20;
  pointer-events: none;
}

.nav-btn {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-light);
  border-radius: 50%;
  color: var(--text-primary);
  transition: all var(--transition-base);
  pointer-events: auto;
}

.nav-btn:hover {
  background: var(--accent-gold);
  border-color: var(--accent-gold);
  color: var(--bg-primary);
  transform: scale(1.1);
}

.hero-indicators {
  position: absolute;
  bottom: var(--spacing-3xl);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-md);
  z-index: 20;
}

.indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  background: transparent;
  border: none;
  color: var(--text-muted);
  transition: all var(--transition-base);
  cursor: pointer;
}

.indicator-label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.indicator::after {
  content: '';
  width: 40px;
  height: 2px;
  background: var(--border-light);
  transition: all var(--transition-base);
}

.indicator.active {
  color: var(--accent-gold);
}

.indicator.active::after {
  background: var(--accent-gold);
  width: 60px;
}

.scroll-hint {
  position: absolute;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  z-index: 20;
  animation: float 2s ease-in-out infinite;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 1s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

.slide-fade-leave-to {
  opacity: 0;
}

.stats-section {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  padding: var(--spacing-3xl) 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-xl);
}

.stat-item {
  text-align: center;
  padding: var(--spacing-lg);
}

.stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 300;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.section-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-md);
}

.section-action {
  text-align: center;
  margin-top: var(--spacing-3xl);
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
  background: rgba(99, 179, 237, 0.15);
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

.categories-section {
  padding: var(--spacing-4xl) 0;
  background: var(--bg-secondary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.category-card {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: var(--radius-lg);
  overflow: hidden;
  text-decoration: none;
}

.category-image {
  position: absolute;
  inset: 0;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.category-card:hover .category-image img {
  transform: scale(1.1);
}

.category-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(99, 179, 237, 0.15) 0%,
    rgba(99, 179, 237, 0.05) 50%,
    transparent 100%
  );
}

.category-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-xl);
  z-index: 10;
}

.category-name-en {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-xs);
}

.category-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.category-count {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.about-section {
  overflow: hidden;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4xl);
  align-items: center;
}

.about-content {
  max-width: 540px;
}

.about-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xl);
}

.about-text {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.about-image {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.about-image::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  border: 1px solid var(--accent-gold);
  border-radius: var(--radius-lg);
  opacity: 0.3;
}

.about-image img {
  width: 100%;
  height: auto;
  display: block;
}

.cta-section {
  padding: var(--spacing-4xl) 0;
  background: linear-gradient(
    135deg,
    var(--bg-secondary) 0%,
    var(--bg-tertiary) 100%
  );
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(126, 213, 210, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.cta-content {
  text-align: center;
  position: relative;
  z-index: 10;
}

.cta-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.cta-text {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: var(--spacing-2xl);
}

.cta-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 600px;
  margin: 0 auto;
}

.cta-input {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.cta-textarea {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  resize: vertical;
  min-height: 120px;
  font-family: var(--font-body);
}

.cta-input::placeholder,
.cta-textarea::placeholder {
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .products-grid,
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: 600px;
  }

  .hero-nav {
    display: none;
  }

  .hero-indicators {
    bottom: var(--spacing-xl);
  }

  .scroll-hint {
    display: none;
  }

  .products-grid,
  .categories-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .about-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }

  .about-content {
    max-width: 100%;
    text-align: center;
  }

  .cta-form {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .stat-item {
    padding: var(--spacing-md);
  }
}
</style>

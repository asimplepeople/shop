<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/search', label: '总览' },
  { path: '/cart', label: '购物车' },
  { path: '/favorites', label: '收藏' },
  { path: '/about', label: '关于' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
    isSearchOpen.value = false
    searchQuery.value = ''
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="header" :class="{ scrolled: isScrolled }">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <span class="logo-text">槿橙</span>
        <span class="logo-subtitle">JIN CHENG</span>
      </router-link>

      <nav class="nav" :class="{ open: isMobileMenuOpen }">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          @click="isMobileMenuOpen = false"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <div class="header-actions">
        <button class="action-btn search-toggle" @click="toggleSearch" aria-label="搜索">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        <button class="action-btn mobile-toggle" @click="toggleMobileMenu" aria-label="菜单">
          <span class="hamburger" :class="{ active: isMobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </div>

    <Transition name="search-slide">
      <div v-if="isSearchOpen" class="search-overlay">
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="搜索商品..."
              @keyup.enter="handleSearch"
            />
            <button class="search-close" @click="isSearchOpen = false">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="search-hint">
            <span>按 Enter 搜索</span>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="isMobileMenuOpen" class="mobile-overlay" @click="isMobileMenuOpen = false"></div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: var(--spacing-lg) 0;
  transition: all var(--transition-base);
}

.header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  opacity: 0.9;
  transition: opacity var(--transition-base);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.header.scrolled {
  padding: var(--spacing-md) 0;
}

.header.scrolled::before {
  opacity: 0.95;
  border-bottom: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
}

.header-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.logo {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  gap: 2px;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  color: white;
  letter-spacing: 0.02em;
  transition: color var(--transition-fast);
}

.logo-subtitle {
  font-size: 0.625rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.logo:hover .logo-text {
  color: var(--accent-gold);
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-2xl);
}

.nav-link {
  font-size: 0.875rem;
  font-weight: 400;
  color: white;
  text-decoration: none;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  position: relative;
  padding: var(--spacing-sm) 0;
  transition: color var(--transition-fast);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent-gold);
  transition: width var(--transition-base);
}

.nav-link:hover {
  color: var(--accent-gold);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.router-link-exact-active {
  color: var(--accent-gold);
}

.nav-link.router-link-exact-active::after {
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.action-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.action-btn:hover {
  color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.1);
}

.mobile-toggle {
  display: none;
}

.hamburger {
  width: 20px;
  height: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 1.5px;
  background: currentColor;
  transition: all var(--transition-fast);
  transform-origin: center;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.search-overlay {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-subtle);
  padding: var(--spacing-xl);
}

.search-container {
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

.search-close {
  color: var(--text-muted);
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.search-close:hover {
  color: var(--text-primary);
}

.search-hint {
  text-align: center;
  margin-top: var(--spacing-md);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.mobile-overlay {
  display: none;
}

.search-slide-enter-active,
.search-slide-leave-active {
  transition: all var(--transition-base);
}

.search-slide-enter-from,
.search-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .header-inner {
    padding: 0 var(--spacing-lg);
  }

  .nav {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: var(--spacing-xl);
    padding: var(--spacing-2xl);
    background: var(--bg-secondary);
    transform: translateX(100%);
    transition: transform var(--transition-base);
    z-index: 1001;
  }

  .nav.open {
    transform: translateX(0);
  }

  .nav-link {
    font-size: 1.25rem;
  }

  .mobile-toggle {
    display: flex;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 1.25rem;
  }

  .logo-subtitle {
    font-size: 0.5rem;
  }
}
</style>

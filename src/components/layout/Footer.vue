<script setup lang="ts">
const currentYear = new Date().getFullYear()

const footerLinks = {
  explore: [
    { label: '全部商品', path: '/search' },
    { label: '新品上市', path: '/search?sort=new' },
    { label: '热销推荐', path: '/search?sort=popular' },
    { label: '特价优惠', path: '/search?sort=sale' }
  ],
  support: [
    { label: '配送说明', path: '/about' },
    { label: '退换政策', path: '/about' },
    { label: '常见问题', path: '/about' },
    { label: '联系我们', path: '/about' }
  ],
  company: [
    { label: '关于我们', path: '/about' },
    { label: '品牌故事', path: '/about' },
    { label: '设计理念', path: '/about' },
    { label: '加入我们', path: '/about' }
  ]
}

const socialLinks = [
  { name: 'WeChat', icon: 'wechat' },
  { name: 'Weibo', icon: 'weibo' },
  { name: 'Instagram', icon: 'instagram' }
]
</script>

<template>
  <footer class="footer">
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <router-link to="/" class="brand-logo">
              <span class="logo-text">槿橙</span>
              <span class="logo-subtitle">JIN CHENG</span>
            </router-link>
            <p class="brand-description">
              精工模塑，全球日用好物智造者。<br />
              根植于"中国模具之乡""中国塑料日用品之都"——浙江台州黄岩，<br />
              专注于收纳用品、日用百货、塑料结构件的研发、生产与全球批发供应。
            </p>
            <div class="social-links">
              <button v-for="social in socialLinks" :key="social.name" class="social-link" :aria-label="social.name">
                <svg v-if="social.icon === 'wechat'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
                <svg v-else-if="social.icon === 'weibo'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439l-.002.004zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.18.573h.014zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.579-.18-.405-.649.388-1.032.425-1.922.006-2.556-.786-1.19-2.936-1.129-5.411-.032 0 0-.774.338-.576-.274.381-1.207.324-2.218-.27-2.8-1.346-1.32-4.927.047-8.003 3.055C1.355 10.308 0 12.318 0 14.054c0 3.32 4.246 5.339 8.398 5.339 5.449 0 9.07-3.174 9.07-5.693 0-1.521-1.281-2.384-2.409-2.75zm2.863-5.058c-.926-1.027-2.291-1.511-3.635-1.375-.38.038-.656.38-.618.761.038.38.38.656.761.618.913-.092 1.835.238 2.463.934.629.696.858 1.643.617 2.531-.099.37.117.751.487.85.37.099.751-.117.85-.487.35-1.304.015-2.704-.925-3.632zm1.927-2.041c-1.547-1.714-3.826-2.523-6.071-2.296-.381.039-.657.381-.618.762.039.38.381.656.762.617 1.827-.185 3.68.473 4.943 1.874 1.264 1.401 1.719 3.313 1.231 5.088-.104.37.112.752.482.856.37.104.752-.112.856-.482.613-2.231.041-4.628-1.585-6.419z"/>
                </svg>
                <svg v-else-if="social.icon === 'instagram'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="footer-links-group">
            <h4 class="links-title">总览</h4>
            <ul class="links-list">
              <li v-for="link in footerLinks.explore" :key="link.path">
                <router-link :to="link.path" class="footer-link">{{ link.label }}</router-link>
              </li>
            </ul>
          </div>

          <div class="footer-links-group">
            <h4 class="links-title">支持</h4>
            <ul class="links-list">
              <li v-for="link in footerLinks.support" :key="link.path">
                <router-link :to="link.path" class="footer-link">{{ link.label }}</router-link>
              </li>
            </ul>
          </div>

          <div class="footer-links-group">
            <h4 class="links-title">公司</h4>
            <ul class="links-list">
              <li v-for="link in footerLinks.company" :key="link.path">
                <router-link :to="link.path" class="footer-link">{{ link.label }}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-inner">
          <p class="copyright">
            &copy; {{ currentYear }} 槿橙. 保留所有权利.
          </p>
          <div class="footer-bottom-links">
            <a href="#" class="bottom-link">隐私政策</a>
            <span class="divider">|</span>
            <a href="#" class="bottom-link">服务条款</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-subtle);
  margin-top: auto;
}

.footer-main {
  padding: var(--spacing-4xl) 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-3xl);
}

.footer-brand {
  max-width: 320px;
}

.brand-logo {
  display: inline-flex;
  flex-direction: column;
  text-decoration: none;
  margin-bottom: var(--spacing-lg);
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.logo-subtitle {
  font-size: 0.625rem;
  font-weight: 400;
  color: var(--text-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.brand-description {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-muted);
  margin-bottom: var(--spacing-xl);
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.social-link:hover {
  color: var(--accent-gold);
  background: var(--bg-elevated);
  transform: translateY(-2px);
}

.footer-links-group {
  padding-top: var(--spacing-sm);
}

.links-title {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: var(--spacing-lg);
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.links-list li {
  margin-bottom: var(--spacing-sm);
}

.footer-link {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
  display: inline-block;
  position: relative;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent-gold);
  transition: width var(--transition-fast);
}

.footer-link:hover {
  color: var(--text-primary);
}

.footer-link:hover::after {
  width: 100%;
}

.footer-bottom {
  border-top: 1px solid var(--border-subtle);
  padding: var(--spacing-lg) 0;
}

.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.copyright {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin: 0;
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.bottom-link {
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.bottom-link:hover {
  color: var(--text-primary);
}

.divider {
  color: var(--text-muted);
  opacity: 0.3;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-2xl);
  }

  .footer-brand {
    grid-column: 1 / -1;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .footer-main {
    padding: var(--spacing-3xl) 0;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xl);
  }

  .footer-brand {
    grid-column: 1 / -1;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }

  .footer-bottom-inner {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-links-group {
    padding-top: 0;
  }
}
</style>

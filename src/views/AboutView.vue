<script setup lang="ts">
const values = [
  {
    icon: 'design',
    title: '精工制造',
    description: '依托黄岩数十年模塑产业集群优势，采用精密模具开发与注塑工艺，确保每一件产品都达到工业级品质标准。'
  },
  {
    icon: 'quality',
    title: '品质管控',
    description: '从原材料采购到成品出厂，全流程严格品控，每一件产品都经过多道检测工序，确保耐用性与实用性完美平衡。'
  },
  {
    icon: 'sustainable',
    title: '产业优势',
    description: '根植于"中国模具之乡""中国塑料日用品之都"，拥有完整的产业链配套，具备快速打样、批量生产能力。'
  },
  {
    icon: 'experience',
    title: '全球服务',
    description: '专注于全球批发供应，产品适配不同市场需求，为全球客户提供高性价比、稳定可靠的一站式供应链解决方案。'
  }
]

const timeline = [
  { year: '2008', title: '工厂成立', description: '在浙江台州黄岩成立，开始专注于塑料日用品的生产制造' },
  { year: '2012', title: '产能扩张', description: '引进先进注塑设备，建立标准化生产线，日产能大幅提升' },
  { year: '2015', title: '模具开发', description: '成立专业模具开发团队，实现从设计到量产的全流程自主可控' },
  { year: '2018', title: '外贸出口', description: '产品开始出口海外市场，服务全球客户' },
  { year: '2023', title: '产业升级', description: '全面数字化改造，智能仓储物流体系建成，服务效率大幅提升' }
]


</script>

<template>
  <div class="about-page">
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <span class="hero-tag">ABOUT US</span>
          <h1 class="hero-title">精工模塑<br />全球日用好物智造者</h1>
          <p class="hero-description">
            根植于"中国模具之乡""中国塑料日用品之都"——浙江台州黄岩，
            我们依托当地数十年积淀的模塑产业集群优势，专注于收纳用品、日用百货、
            塑料结构件的研发、生产与全球批发供应。
          </p>
        </div>
      </div>
    </section>

    <section class="story-section section">
      <div class="container">
        <div class="story-grid">
          <div class="story-content">
            <span class="section-tag">Our Story</span>
            <h2 class="section-title">工厂简介</h2>
            <p class="story-text">
              我们是一家位于浙江台州黄岩的专业模塑制品制造商，依托当地"中国模具之乡"
              "中国塑料日用品之都"的产业集群优势，专注于高品质塑料日用品的研发、生产与全球批发供应。
            </p>
            <p class="story-text">
              从模具设计开发到注塑成型，我们拥有完整的生产链条和严格的质量管控体系。
              每一件产品都经过多道工序的精心打磨，确保在设计、耐用性与实用性之间达到完美平衡。
            </p>
            <p class="story-text">
              十五年来，我们始终坚持"精工制造、品质为先"的理念，产品远销欧美、东南亚等多个国家和地区，
              为全球客户提供了高性价比、稳定可靠的供应链解决方案。未来，我们将继续深耕模塑产业，
              为合作伙伴创造更大价值。
            </p>
          </div>
          <div class="story-image">
            <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20home%20office%20with%20clean%20design%2C%20natural%20light%2C%20simple%20furniture%2C%20luxury%20dark%20theme&image_size=landscape_16_9" alt="品牌故事" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Our Values</span>
          <h2 class="section-title">核心优势</h2>
        </div>
        <div class="values-grid">
          <div v-for="value in values" :key="value.title" class="value-card">
            <div class="value-icon">
              <svg v-if="value.icon === 'design'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                <path d="M2 2l7.586 7.586"/>
                <circle cx="11" cy="11" r="2"/>
              </svg>
              <svg v-else-if="value.icon === 'quality'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <svg v-else-if="value.icon === 'sustainable'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <svg v-else-if="value.icon === 'experience'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 class="value-title">{{ value.title }}</h3>
            <p class="value-description">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="timeline-section section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Our Journey</span>
          <h2 class="section-title">工厂历程</h2>
        </div>
        <div class="timeline">
          <div v-for="(item, index) in timeline" :key="item.year" class="timeline-item" :style="{ '--delay': index }">
            <div class="timeline-year">{{ item.year }}</div>
            <div class="timeline-content">
              <h4 class="timeline-title">{{ item.title }}</h4>
              <p class="timeline-description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-section">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-content">
            <span class="section-tag">Contact Us</span>
            <h2 class="section-title">联系我们</h2>
            <p class="contact-text">
              如果您有定制需求、批发询价或其他合作意向，欢迎随时与我们联系。
              我们将在24小时内回复您的消息，为您提供专业的解决方案。
            </p>
          </div>
          <div class="contact-info">
            <div class="contact-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <div>
                <span class="contact-label">邮箱</span>
                <span class="contact-value">contact@minimalhome.com</span>
              </div>
            </div>
            <div class="contact-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <div>
                <span class="contact-label">电话</span>
                <span class="contact-value">400-123-4567</span>
              </div>
            </div>
            <div class="contact-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div>
                <span class="contact-label">地址</span>
                <span class="contact-value">浙江省台州市黄岩区</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  padding-top: 100px;
}

.hero-section {
  padding: var(--spacing-4xl) 0;
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: radial-gradient(circle at 80% 50%, rgba(126, 213, 210, 0.1), transparent 60%);
  pointer-events: none;
}

.hero-content {
  max-width: 700px;
}

.hero-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-lg);
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.1;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-secondary);
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

.story-section {
  overflow: hidden;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4xl);
  align-items: center;
}

.story-content {
  max-width: 540px;
}

.story-text {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.story-image {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.story-image::before {
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

.story-image img {
  width: 100%;
  height: auto;
  display: block;
}

.values-section {
  padding: var(--spacing-4xl) 0;
  background: var(--bg-secondary);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-xl);
}

.value-card {
  padding: var(--spacing-xl);
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all var(--transition-base);
}

.value-card:hover {
  border-color: var(--border-light);
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.value-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  background: rgba(126, 213, 210, 0.1);
  border-radius: var(--radius-lg);
  color: var(--accent-gold);
}

.value-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.value-description {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-muted);
}

.timeline {
  position: relative;
  padding-left: var(--spacing-4xl);
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--accent-gold), var(--border-light));
}

.timeline-item {
  position: relative;
  padding-bottom: var(--spacing-2xl);
  padding-left: var(--spacing-2xl);
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: calc(-1 * var(--spacing-4xl) - 5px);
  top: 0;
  width: 12px;
  height: 12px;
  background: var(--accent-gold);
  border-radius: 50%;
  box-shadow: 0 0 0 4px var(--bg-primary);
}

.timeline-year {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 300;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-sm);
}

.timeline-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.timeline-description {
  font-size: 0.875rem;
  color: var(--text-muted);
  max-width: 500px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

.team-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
}

.team-card:hover {
  border-color: var(--border-light);
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.team-image {
  aspect-ratio: 1;
  overflow: hidden;
}

.team-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(30%);
  transition: filter var(--transition-base);
}

.team-card:hover .team-image img {
  filter: grayscale(0%);
}

.team-info {
  padding: var(--spacing-lg);
  text-align: center;
}

.team-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.team-role {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-gold);
}

.contact-section {
  padding: var(--spacing-4xl) 0;
  background: var(--bg-secondary);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4xl);
  align-items: center;
}

.contact-text {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-top: var(--spacing-lg);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.contact-item:hover {
  border-color: var(--border-light);
}

.contact-item svg {
  color: var(--accent-gold);
  flex-shrink: 0;
  margin-top: 2px;
}

.contact-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: var(--spacing-xs);
}

.contact-value {
  font-size: 1rem;
  color: var(--text-primary);
}

@media (max-width: 1024px) {
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .story-grid,
  .contact-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }

  .story-content {
    max-width: 100%;
    text-align: center;
  }

  .values-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }

  .timeline {
    padding-left: var(--spacing-2xl);
  }

  .timeline-item {
    padding-left: var(--spacing-lg);
  }

  .timeline-item::before {
    left: calc(-1 * var(--spacing-2xl) - 5px);
  }
}
</style>

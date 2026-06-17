import { motion } from 'framer-motion'

// 灯泡图标
function BulbIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21h6M12 3a6 6 0 0 0-4 10.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.5A6 6 0 0 0 12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 心形图标
function HeartIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// GitHub 图标
function GithubIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  )
}

const features = [
  { emoji: '⚡', title: '零压力输入', desc: '打开即写，Enter 即存，不打断思路' },
  { emoji: '🔒', title: '纯本地存储', desc: '数据在设备上，无需联网、无需注册' },
  { emoji: '🎨', title: '小清新风格', desc: '薄荷绿 + 暖白，轻松自在' },
  { emoji: '✨', title: '丝滑动画', desc: '灵感来去，都有动画相伴' },
]

export default function AboutPage() {
  return (
    <div className="h-full flex flex-col bg-cream">
      <div className="flex-shrink-0 px-6 pt-14 pb-2">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">关于</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-8">
        {/* App 信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-border-light mb-4"
        >
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center shadow-[0_2px_8px_rgba(74,143,109,0.12)]">
              <BulbIcon className="w-7 h-7 text-sage-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">闪念</h2>
              <p className="text-xs text-text-muted mt-0.5">v0.1.1 · Idea List</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            灵光一闪，随手记下。闪念是一个极简的灵感捕捉工具，帮你抓住每一个转瞬即逝的好想法。
          </p>
        </motion.div>

        {/* 特色功能 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-border-light mb-4"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4">特色</h3>
          <div className="space-y-4">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="text-base mt-0.5 w-6 text-center">{item.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 技术栈 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-border-light mb-4"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-3">技术栈</h3>
          <div className="flex flex-wrap gap-2">
            {['React 19', 'Vite 8', 'Tailwind CSS 4', 'Framer Motion 11', 'React Router 7'].map(tech => (
              <span key={tech} className="text-xs bg-sage-50 text-sage-500 px-2.5 py-1.5 rounded-xl font-medium">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* GitHub 链接 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-border-light mb-4"
        >
          <a
            href="https://github.com/sctale/Idea-List"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors"
          >
            <GithubIcon className="w-5 h-5" />
            <span className="text-sm">GitHub 仓库</span>
            <span className="text-xs text-text-muted ml-auto">sctale/Idea-List →</span>
          </a>
        </motion.div>

        {/* 底部署名 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-1.5 pt-3 pb-2"
        >
          <span className="text-[11px] text-text-muted">Made with</span>
          <HeartIcon className="w-3 h-3 text-peach" />
          <span className="text-[11px] text-text-muted">by sctale</span>
        </motion.div>
      </div>
    </div>
  )
}

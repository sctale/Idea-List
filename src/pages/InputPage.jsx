import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadIdeas, saveIdeas, generateId } from '../utils'

// 灯泡图标
function BulbIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21h6M12 3a6 6 0 0 0-4 10.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.5A6 6 0 0 0 12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 发送图标
function SendIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 成功打勾图标
function CheckIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 飘散粒子效果
function Particles({ show }) {
  if (!show) return null
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 120,
    y: -(30 + Math.random() * 50),
    scale: 0.5 + Math.random() * 0.5,
    delay: Math.random() * 0.15,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, scale: p.scale }}
          transition={{ duration: 0.6, delay: p.delay, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-sage-300"
        />
      ))}
    </div>
  )
}

export default function InputPage() {
  const [ideas, setIdeas] = useState(loadIdeas)
  const [input, setInput] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [justAdded, setJustAdded] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    saveIdeas(ideas)
  }, [ideas])

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px'
    }
  }, [input])

  const addIdea = useCallback(() => {
    const content = input.trim()
    if (!content) return

    const newIdea = {
      id: generateId(),
      content,
      createdAt: Date.now(),
    }

    setIdeas(prev => [newIdea, ...prev])
    setInput('')
    setJustAdded(newIdea.id)
    setShowSuccess(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    setTimeout(() => setJustAdded(null), 1500)
    setTimeout(() => setShowSuccess(false), 800)
  }, [input])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      addIdea()
    }
  }, [addIdea, isComposing])

  const recentIdeas = ideas.slice(0, 5)

  // 根据输入框状态获取问候语
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 6) return '夜深了，灵感还在闪'
    if (hour < 12) return '早安，新的一天'
    if (hour < 18) return '午后，来点灵感'
    return '晚上好，记录灵感'
  }

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* 顶部问候 */}
      <div className="flex-shrink-0 px-6 pt-14 pb-1">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-sage-50 flex items-center justify-center">
              <BulbIcon className="w-4.5 h-4.5 text-sage-400" />
            </div>
            <h1 className="text-2xl font-semibold text-text-primary tracking-tight">闪念</h1>
          </div>
          <p className="text-sm text-text-muted ml-[42px]">{getGreeting()}</p>
        </motion.div>
      </div>

      {/* 输入区域 */}
      <div className="flex-shrink-0 px-5 pt-5 pb-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`relative rounded-3xl border-2 transition-all duration-300 bg-white ${
            isFocused
              ? 'border-sage-300 shadow-[0_4px_24px_rgba(74,143,109,0.1)]'
              : 'border-border-light shadow-[0_1px_4px_rgba(0,0,0,0.03)]'
          }`}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="此刻想到了什么..."
            rows={1}
            className="w-full bg-transparent text-text-primary text-[15px] leading-relaxed px-5 py-4 resize-none outline-none"
          />
          {/* 底部操作栏 */}
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-[11px] text-text-muted select-none">
              {input.trim() ? `${input.trim().length} 字` : 'Enter 保存 · Shift+Enter 换行'}
            </span>
            <div className="relative">
              <button
                onClick={addIdea}
                disabled={!input.trim()}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  input.trim()
                    ? 'bg-sage-400 text-white hover:bg-sage-500 active:scale-95 shadow-[0_2px_10px_rgba(74,143,109,0.3)]'
                    : 'bg-sand-50 text-text-muted cursor-not-allowed'
                }`}
              >
                {showSuccess ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <SendIcon className="w-3.5 h-3.5" />
                )}
                {showSuccess ? '已记下' : '记下'}
              </button>
              <Particles show={showSuccess} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 最近灵感预览 */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-4">
        {ideas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center pt-12"
          >
            {/* 装饰性渐变圆 */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sage-50 to-sky-light flex items-center justify-center">
                <BulbIcon className="w-10 h-10 text-sage-300" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-sage-100 blur-md"
              />
            </div>
            <p className="text-text-secondary text-base mb-1">还没有灵感</p>
            <p className="text-text-muted text-sm text-center leading-relaxed">
              脑海里闪过的念头<br />随手记下来吧
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-medium text-text-muted tracking-wider">最近</span>
              <span className="text-[11px] text-text-muted bg-sand-50 px-2 py-0.5 rounded-full">{ideas.length} 条</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {recentIdeas.map(idea => (
                  <motion.div
                    key={idea.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, x: -60, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className={`rounded-2xl px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border transition-colors duration-500 ${
                      justAdded === idea.id
                        ? 'bg-sage-50 border-sage-200'
                        : 'bg-white border-border-light'
                    }`}
                  >
                    <p className="text-text-primary text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                      {idea.content}
                    </p>
                    <p className="text-text-muted text-[11px] mt-1.5">
                      {new Date(idea.createdAt).getHours().toString().padStart(2, '0')}:{new Date(idea.createdAt).getMinutes().toString().padStart(2, '0')}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {ideas.length > 5 && (
              <p className="text-center text-[11px] text-text-muted mt-4">
                还有 {ideas.length - 5} 条灵感，去汇总页查看全部
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

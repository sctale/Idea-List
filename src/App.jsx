import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import InputPage from './pages/InputPage'
import ListPage from './pages/ListPage'
import AboutPage from './pages/AboutPage'
import BottomNav from './components/BottomNav'

// 页面切换动画 — 轻柔淡入淡出
const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 overflow-hidden"
      >
        <Routes location={location}>
          <Route path="/" element={<InputPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="h-full flex flex-col bg-cream">
        <AnimatedRoutes />
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App

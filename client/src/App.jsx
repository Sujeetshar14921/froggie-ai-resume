import React, { useCallback, useEffect, Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authApi } from './api/authApi'
import { login, setLoading } from './app/features/authSlice'
import { FroggieToaster } from './components/notifications'
import { CopilotProvider } from './context/CopilotContext'
import { CopilotWidget, CopilotDrawer } from './components/copilot'

// Route-level code-splitting for high-speed page loads
const Home = lazy(() => import('./pages/Home'))
const Layout = lazy(() => import('./pages/Layout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'))
const Preview = lazy(() => import('./pages/Preview'))
const MyResumes = lazy(() => import('./pages/MyResumes'))
const AtsChecker = lazy(() => import('./pages/AtsChecker'))
const ApplicationTracker = lazy(() => import('./pages/ApplicationTracker'))
const Login = lazy(() => import('./pages/Login'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const DonatePage = lazy(() => import('./pages/DonatePage'))

// Minimalist fallback loader
const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
    <div className="size-10 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" />
    <span className="text-xs font-semibold text-emerald-400/80 tracking-wider uppercase">Loading froggie...</span>
  </div>
)

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const getUserData = useCallback(async () => {
    const token = localStorage.getItem('token')

    try {
      if (token) {
        const data = await authApi.getUserData(token)

        if (data.user) {
          dispatch(login({ token, user: data.user }))
        }

        dispatch(setLoading(false))
      } else {
        dispatch(setLoading(false))
      }
    } catch (error) {
      dispatch(setLoading(false))
      console.error(error.message)
    }
  }, [dispatch])

  useEffect(() => {
    getUserData()
  }, [getUserData])

  return (
    <CopilotProvider>
      <FroggieToaster />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/faq' element={<FaqPage />} />
          <Route path='/donate' element={<DonatePage />} />

          <Route path='app' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='my-resumes' element={<MyResumes />} />
            <Route path='ats-checker' element={<AtsChecker />} />
            <Route path='applications' element={<ApplicationTracker />} />
            <Route path='builder/:resumeId' element={<ResumeBuilder />} />
          </Route>

          <Route path='view/:resumeId' element={<Preview />} />
        </Routes>
      </Suspense>

      {/* GLOBAL FLOATING CAREER COPILOT WIDGET & SLIDE-OVER DRAWER (Visible only when user creates account / logs in) */}
      {user && (
        <>
          <CopilotWidget />
          <CopilotDrawer />
        </>
      )}
    </CopilotProvider>
  )
}

export default App

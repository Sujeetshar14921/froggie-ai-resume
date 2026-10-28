import React, { useCallback, useEffect, Suspense, lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authApi } from './api/authApi'
import { login, setLoading } from './app/features/authSlice'
import { FroggieToaster } from './components/notifications'
import CookieConsent from './components/CookieConsent'
import MobileBottomNav from './components/MobileBottomNav'
import { initTheme } from './utils/theme'

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
const TalentPage = lazy(() => import('./pages/TalentPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const FileStudioPage = lazy(() => import('./pages/FileStudioPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
    initTheme()
    getUserData()
  }, [getUserData])

  return (
    <>
      <FroggieToaster />
      <CookieConsent />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Login initialMode="register" />} />
          <Route path='/faq' element={<FaqPage />} />
          <Route path='/donate' element={<DonatePage />} />
          <Route path='/talent' element={<TalentPage />} />
          <Route path='/talent/:resumeId' element={<Preview />} />
          <Route path='/ats-checker' element={<AtsChecker />} />
          <Route path='/file-studio' element={<FileStudioPage />} />

          <Route path='app' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='my-resumes' element={<MyResumes />} />
            <Route path='ats-checker' element={<Navigate to='/ats-checker' replace />} />
            <Route path='applications' element={<ApplicationTracker />} />
            <Route path='file-studio' element={<Navigate to='/file-studio' replace />} />
            <Route path='settings' element={<SettingsPage />} />
            <Route path='builder/:resumeId' element={<ResumeBuilder />} />
          </Route>

          <Route path='view/:resumeId' element={<Preview />} />

          {/* 404 NOT FOUND CATCH-ALL */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* NATIVE MOBILE BOTTOM CONTROLS */}
      <MobileBottomNav />
    </>
  )
}

export default App

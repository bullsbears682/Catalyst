import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

const THEMES = {
  light: {
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f8fafc',
      glass: 'rgba(255, 255, 255, 0.25)',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      shadow: 'rgba(0, 0, 0, 0.1)'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      accent: '#34d399',
      background: '#0f172a',
      surface: '#1e293b',
      glass: 'rgba(15, 23, 42, 0.25)',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      shadow: 'rgba(0, 0, 0, 0.3)'
    }
  },
  premium: {
    name: 'Premium',
    colors: {
      primary: '#7c3aed',
      secondary: '#ec4899',
      accent: '#f59e0b',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      glass: 'rgba(255, 255, 255, 0.2)',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(255, 255, 255, 0.2)',
      shadow: 'rgba(0, 0, 0, 0.2)'
    }
  }
}

export const PremiumThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light')
  const [animations, setAnimations] = useState(true)
  const [glassMorphism, setGlassMorphism] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Detect system preferences
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('premium_theme')
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme)
    } else {
      // Detect system dark mode preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setCurrentTheme(prefersDark ? 'dark' : 'light')
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(prefersReducedMotion)
    setAnimations(!prefersReducedMotion)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      if (!localStorage.getItem('premium_theme')) {
        setCurrentTheme(e.matches ? 'dark' : 'light')
      }
    }
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Apply theme to document
  useEffect(() => {
    const theme = THEMES[currentTheme]
    const root = document.documentElement

    // Set CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    // Set theme class
    root.className = `theme-${currentTheme} ${animations ? 'animations-enabled' : 'animations-disabled'} ${glassMorphism ? 'glass-enabled' : 'glass-disabled'}`

    // Save preference
    localStorage.setItem('premium_theme', currentTheme)
  }, [currentTheme, animations, glassMorphism])

  const switchTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName)
    }
  }

  const toggleAnimations = () => {
    setAnimations(!animations)
  }

  const toggleGlassMorphism = () => {
    setGlassMorphism(!glassMorphism)
  }

  const contextValue = {
    currentTheme,
    theme: THEMES[currentTheme],
    availableThemes: Object.keys(THEMES),
    animations,
    glassMorphism,
    reducedMotion,
    switchTheme,
    toggleAnimations,
    toggleGlassMorphism
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Premium UI Components with Real Functionality
export const GlassCard = ({ children, className = '', blur = 'md', opacity = 0.2, ...props }) => {
  const { glassMorphism } = useTheme()
  
  const blurValues = {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  }

  const style = glassMorphism ? {
    backdropFilter: `blur(${blurValues[blur]})`,
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
  } : {}

  return (
    <div 
      className={`glass-card ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}

export const AnimatedButton = ({ children, variant = 'primary', size = 'md', loading = false, onClick, className = '', ...props }) => {
  const { animations, theme } = useTheme()
  const [isPressed, setIsPressed] = useState(false)

  const variants = {
    primary: `bg-gradient-to-r from-blue-500 to-purple-600 text-white`,
    secondary: `bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:text-white`,
    accent: `bg-gradient-to-r from-green-500 to-teal-600 text-white`,
    ghost: `bg-transparent border-2 border-current hover:bg-current hover:bg-opacity-10`
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }

  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)
  const handleMouseLeave = () => setIsPressed(false)

  return (
    <button
      className={`
        animated-button
        ${variants[variant]}
        ${sizes[size]}
        ${className}
        relative overflow-hidden rounded-lg font-semibold
        transition-all duration-200 ease-in-out
        transform hover:scale-105 active:scale-95
        ${animations ? 'animate-pulse-subtle' : ''}
        ${isPressed ? 'scale-95' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      `}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </span>
      
      {/* Ripple effect */}
      {animations && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700 ease-in-out" />
        </div>
      )}
    </button>
  )
}

export const FloatingCard = ({ children, className = '', delay = 0, ...props }) => {
  const { animations } = useTheme()
  
  return (
    <div
      className={`
        floating-card
        ${className}
        ${animations ? 'animate-float' : ''}
      `}
      style={{
        animationDelay: `${delay}ms`
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export const MicroInteraction = ({ children, type = 'hover-lift', intensity = 'md' }) => {
  const { animations } = useTheme()
  
  const interactions = {
    'hover-lift': 'hover:transform hover:-translate-y-1 hover:shadow-lg',
    'hover-scale': 'hover:transform hover:scale-105',
    'hover-rotate': 'hover:transform hover:rotate-3',
    'pulse': 'animate-pulse',
    'bounce': 'animate-bounce',
    'wiggle': 'hover:animate-wiggle'
  }

  const intensities = {
    sm: 'transition-all duration-150 ease-in-out',
    md: 'transition-all duration-200 ease-in-out',
    lg: 'transition-all duration-300 ease-in-out'
  }

  if (!animations) {
    return children
  }

  return (
    <div className={`${interactions[type]} ${intensities[intensity]}`}>
      {children}
    </div>
  )
}

export const ThemeSelector = () => {
  const { currentTheme, availableThemes, switchTheme, animations, glassMorphism, toggleAnimations, toggleGlassMorphism } = useTheme()

  return (
    <div className="theme-selector p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">🎨 Theme Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <div className="flex gap-2">
            {availableThemes.map(theme => (
              <button
                key={theme}
                onClick={() => switchTheme(theme)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${currentTheme === theme 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {THEMES[theme].name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Animations</label>
          <button
            onClick={toggleAnimations}
            className={`
              w-12 h-6 rounded-full transition-all duration-200
              ${animations ? 'bg-blue-500' : 'bg-gray-300'}
            `}
          >
            <div className={`
              w-5 h-5 bg-white rounded-full transition-transform duration-200
              ${animations ? 'translate-x-6' : 'translate-x-0.5'}
            `} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Glass Morphism</label>
          <button
            onClick={toggleGlassMorphism}
            className={`
              w-12 h-6 rounded-full transition-all duration-200
              ${glassMorphism ? 'bg-blue-500' : 'bg-gray-300'}
            `}
          >
            <div className={`
              w-5 h-5 bg-white rounded-full transition-transform duration-200
              ${glassMorphism ? 'translate-x-6' : 'translate-x-0.5'}
            `} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default {
  PremiumThemeProvider,
  useTheme,
  GlassCard,
  AnimatedButton,
  FloatingCard,
  MicroInteraction,
  ThemeSelector
}
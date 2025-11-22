import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/tailwind.css'
import './echo.js'

// Initialize theme before mounting the app
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark

  const html = document.documentElement
  if (isDark) {
    html.classList.add('dark')
    html.classList.remove('light')
  } else {
    html.classList.add('light')
    html.classList.remove('dark')
  }
}

initTheme()

const app = createApp(App)

app.use(router)

app.mount('#app')

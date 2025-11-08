import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = prefersDark
    }

    applyTheme()
  }

  const applyTheme = () => {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark')
      html.classList.remove('light')
      document.documentElement.style.colorScheme = 'dark'
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  watch(isDark, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    applyTheme()
  })

  onMounted(() => {
    initTheme()
  })

  return {
    isDark,
    toggleTheme,
    initTheme,
  }
}

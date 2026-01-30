import { useState } from '#app'

export const useTheme = () => {
  const theme = useState('nyr:theme')
  const setTheme = (name) => {
    theme.value = name
    document.documentElement.setAttribute('data-nyr-theme', name)
  }
  return { theme, setTheme }
}
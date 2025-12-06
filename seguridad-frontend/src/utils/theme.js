// Utility for theme toggling via DOM and localStorage
export function initTheme() {
  try {
    // Check for saved theme
    const saved = localStorage.getItem('theme');
    
    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine theme
    const theme = saved || (prefersDark ? 'dark' : 'light');
    
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Persist preference
    localStorage.setItem('theme', theme);
    
    console.log('[Theme] Initialized:', theme);
  } catch (e) {
    console.error('[Theme] Error initializing:', e);
  }
}

export function toggleTheme() {
  try {
    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    const newTheme = isDark ? 'dark' : 'light';
    
    // Persist to localStorage
    localStorage.setItem('theme', newTheme);
    
    console.log('[Theme] Toggled to:', newTheme);
    return newTheme;
  } catch (e) {
    console.error('[Theme] Error toggling:', e);
    return null;
  }
}

export function getTheme() {
  try {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  } catch (e) {
    console.error('[Theme] Error reading:', e);
    return 'light';
  }
}

export function isDarkTheme() {
  try {
    return document.documentElement.classList.contains('dark');
  } catch (e) {
    console.error('[Theme] Error checking dark class:', e);
    return false;
  }
}

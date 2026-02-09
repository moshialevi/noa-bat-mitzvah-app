import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // מאפשר שימוש ב-process.env בקוד צד-לקוח מבלי לשבור את האפליקציה
    'process.env': {}
  }
});
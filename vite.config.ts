import { defineConfig } from 'vite';

export default defineConfig({
  ssr: { noExternal: [/^react-bootstrap(?:\/|$)/, /^@restart\//, /^dom-helpers(?:\/|$)/, /^uncontrollable(?:\/|$)/, /^react-transition-group(?:\/|$)/] },
  css: { preprocessorOptions: { scss: { quietDeps: true, silenceDeprecations: ['import'] } } },
  build: { rollupOptions: { onwarn(warning, warn) {
    // React Bootstrap also targets RSC hosts; this Vite app uses conventional SSR.
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"') && warning.id?.includes('react-bootstrap')) return;
    warn(warning);
  } } },
});

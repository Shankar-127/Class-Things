import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createReadStream, cpSync, existsSync, statSync } from 'node:fs'
import { extname, isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(fileURLToPath(new URL('.', import.meta.url)))
const workspaceRoot = resolve(appRoot, '..')
const assetRoots = {
  sources: resolve(workspaceRoot, 'Sources'),
  creator: resolve(workspaceRoot, 'Creator'),
}

const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
}

function localClassAssets() {
  return {
    name: 'local-class-assets',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = decodeURIComponent((request.url || '').split('?')[0])
        const match = pathname.match(/^\/(sources|creator)\/(.+)$/)
        if (!match) return next()

        const root = assetRoots[match[1]]
        const filePath = resolve(root, match[2])
        const outsideRoot = relative(root, filePath)
        if (outsideRoot.startsWith('..') || isAbsolute(outsideRoot) || !existsSync(filePath) || !statSync(filePath).isFile()) return next()

        response.setHeader('Content-Type', mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream')
        createReadStream(filePath).on('error', next).pipe(response)
      })
    },
    writeBundle(outputOptions) {
      const outputDir = resolve(outputOptions.dir || resolve(appRoot, 'dist'))
      for (const [name, source] of Object.entries(assetRoots)) cpSync(source, resolve(outputDir, name), { recursive: true })
    },
  }
}

export default defineConfig({
  root: workspaceRoot,
  plugins: [react(), localClassAssets()],
  publicDir: false,
  resolve: {
    alias: {
      react: resolve(appRoot, 'node_modules', 'react'),
      'react-dom': resolve(appRoot, 'node_modules', 'react-dom'),
      'lucide-react': resolve(appRoot, 'node_modules', 'lucide-react'),
    },
  },
  css: {
    postcss: appRoot,
  },
  build: {
    outDir: resolve(appRoot, 'dist'),
    emptyOutDir: true,
  },
})

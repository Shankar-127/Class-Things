import { readdir, stat, writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const sourcesRoot = resolve(appRoot, '..', 'Sources')
const outputFile = resolve(appRoot, 'src', 'generatedSources.js')

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 1 : 2)} MB`
}

const formatDate = (value) => new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(value)

const displayTitle = (filename) => filename.replace(extname(filename), '')

const folders = (await readdir(sourcesRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name))

const sourceSubjects = []
const sourceResources = []

for (const folder of folders) {
  const folderPath = resolve(sourcesRoot, folder.name)
  const files = (await readdir(folderPath, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .sort((a, b) => a.name.localeCompare(b.name))

  sourceSubjects.push({ name: folder.name, fileCount: files.length })

  for (const file of files) {
    const filePath = resolve(folderPath, file.name)
    const fileStats = await stat(filePath)
    const extension = extname(file.name).slice(1).toUpperCase() || 'FILE'
    sourceResources.push({
      id: `${folder.name}/${file.name}`,
      subject: folder.name,
      filename: file.name,
      title: displayTitle(file.name),
      type: extension,
      size: formatSize(fileStats.size),
      modifiedAt: formatDate(fileStats.mtime),
      modifiedMs: Math.round(fileStats.mtimeMs),
      url: `/sources/${encodeURIComponent(folder.name)}/${encodeURIComponent(file.name)}`,
    })
  }
}

sourceResources.sort((a, b) => b.modifiedMs - a.modifiedMs)

const manifest = `// This file is generated from ../Sources. Do not edit manually.\n\nexport const sourceSubjects = ${JSON.stringify(sourceSubjects, null, 2)}\n\nexport const sourceResources = ${JSON.stringify(sourceResources, null, 2)}\n\nexport const sourceSummary = ${JSON.stringify({ subjectCount: sourceSubjects.length, fileCount: sourceResources.length }, null, 2)}\n`

await writeFile(outputFile, manifest, 'utf8')

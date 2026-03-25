import { marked } from 'marked'

// Flat, non-neon palette for chapter nodes — cycles across files
const NODE_COLORS = ['#FFD166', '#5DADE2', '#52D1A5', '#9B7EDE']
// Matching text colors (dark on light bg, light on dark bg)
const NODE_TEXT_COLORS = ['#1A1A1A', '#0B1B2B', '#0F2A1F', '#1A102A']

// Simple YAML frontmatter parser — handles the title/tags format used in vault files
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const yamlBlock = match[1]
  const content = match[2]
  const data = {}
  for (const line of yamlBlock.split('\n')) {
    const titleMatch = line.match(/^title:\s*(.+)$/)
    if (titleMatch) { data.title = titleMatch[1].trim(); continue }
    const tagsMatch = line.match(/^tags:\s*\[([^\]]*)\]/)
    if (tagsMatch) {
      data.tags = tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean)
    }
    const collectionMatch = line.match(/^collection:\s*(.+)$/)
    if (collectionMatch) { data.collection = collectionMatch[1].trim(); continue }
  }
  return { data, content }
}

function parseWikiLinks(content) {
  const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
  const links = []
  let match
  while ((match = regex.exec(content)) !== null) {
    // Strip heading anchors: [[Note#Heading]] → Note
    const targetRaw = match[1].trim()
    const target = targetRaw.split('#')[0].trim()
    const display = match[2]?.trim() || target
    if (target) links.push({ target, display })
  }
  return links
}

export function parseVault(rawModules) {
  const files = {}
  let colorIndex = 0

  for (const [key, raw] of Object.entries(rawModules)) {
    // key is either a plain id ('Ch1-A-Pragmatic-Philosophy')
    // or a Vite glob path ('./vault/Ch1-A-Pragmatic-Philosophy.md')
    const filename = key.split('/').pop()
    const id = filename.replace(/\.md$/, '')

    try {
      const { data: frontmatter, content } = parseFrontmatter(raw)
      const links = parseWikiLinks(content)

      // Configure marked for safe rendering
      const html = marked.parse(content, { breaks: true })

      files[id] = {
        id,
        label: frontmatter.title || id,
        content: html,
        rawContent: content,
        frontmatter,
        links,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        collection: frontmatter.collection || null,
        color: NODE_COLORS[colorIndex % NODE_COLORS.length],
        textColor: NODE_TEXT_COLORS[colorIndex % NODE_TEXT_COLORS.length],
      }
      colorIndex++
    } catch (e) {
      console.error(`Error parsing ${id}:`, e)
    }
  }

  return files
}

// Extract ## (h2) sections from raw markdown into an array of { title, lines }
function extractSections(rawContent) {
  const sections = []
  let current = null
  for (const line of rawContent.split('\n')) {
    const m = line.match(/^## (.+)$/)
    if (m) {
      if (current) sections.push(current)
      current = { title: m[1].trim(), lines: [] }
    } else if (current) {
      current.lines.push(line)
    }
  }
  if (current) sections.push(current)
  return sections
}

export function buildGraph(files) {
  const fileList = Object.values(files)
  const nodes = [...fileList]
  const edges = []
  const edgeSet = new Set()

  // Wikilink edges between file-level nodes
  for (const file of fileList) {
    for (const link of file.links) {
      const target =
        files[link.target] ||
        fileList.find(f => f.label.toLowerCase() === link.target.toLowerCase())

      if (target && target.id !== file.id) {
        const edgeId = [file.id, target.id].sort().join('--')
        if (!edgeSet.has(edgeId)) {
          edgeSet.add(edgeId)
          edges.push({ id: edgeId, source: file.id, target: target.id })
        }
      }
    }
  }

  // Section nodes: each ## heading becomes a child node of its file
  for (const file of fileList) {
    const sections = extractSections(file.rawContent)
    sections.forEach((sec, i) => {
      const secId = `${file.id}--sec${i}`
      nodes.push({
        id: secId,
        label: sec.title,
        content: marked.parse(sec.lines.join('\n'), { breaks: true }),
        rawContent: sec.lines.join('\n'),
        frontmatter: {},
        links: [],
        tags: file.tags,
        color: file.color,
        textColor: file.textColor,
        isSection: true,
        parentId: file.id,
      })
      edges.push({ id: `${file.id}~~${secId}`, source: file.id, target: secId, isSection: true })
    })
  }

  return { nodes, edges }
}

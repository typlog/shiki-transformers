import type { ShikiTransformer } from 'shiki'

// highlight=1,3-6,9
// https://github.com/shikijs/shiki/blob/main/packages/transformers/src/transformers/transformer-meta-highlight.ts
export function parseHighlightString(highlight: string) {
  if (!highlight)
    return null
  const match = highlight.match(/([\d,-]+)/)
  if (!match)
    return null
  const lines = match[1].split(',')
    .flatMap((v) => {
      const num = v.split('-').map(v => Number.parseInt(v, 10))
      if (num.length === 1)
        return [num[0]]
      else
        return Array.from({ length: num[1] - num[0] + 1 }, (_, i) => i + num[0])
    })
  return lines
}

export interface TransformerHighlightOptions {
  /**
   * Lines to be highlighted
   */
  highlight?: string;

  /**
   * Class for highlighted lines
   *
   * @default 'highlighted'
   */
  className?: string;

  /**
   * Line numbers starts from
   *
   * @default 1
   */
  lineStart?: number;

  /**
   * Display line numbers
   *
   * @default false
   */
  showLines?: boolean;
}

/**
 * Allow using `1,3-5` in the code snippet meta to mark highlighted lines.
 */
export function transformerLineHighlight(options: TransformerHighlightOptions): ShikiTransformer {
  const {
    highlight = '',
    className = 'highlighted',
    lineStart = 1,
    showLines = false,
  } = options

  const highlightLines = parseHighlightString(highlight)
  return {
    name: '@typlog/shiki-transformers:line-highlight',
    line(node, line) {
      if (lineStart > 1) {
        line = lineStart + line - 1
      }
      if (highlightLines && highlightLines.includes(line)) {
        this.addClassToHast(node, className)
      }
      if (showLines) {
        node.properties['data-line'] = line
      }
      return node
    },
  }
}

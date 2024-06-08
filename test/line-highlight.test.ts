import { expect, it, describe } from 'vitest'
import { codeToHtml } from 'shiki'
import {
  parseHighlightString,
  transformerLineHighlight,
  type TransformerHighlightOptions,
} from '../src'

it('parseHighlightString', () => {
  expect(parseHighlightString('')).toBe(null)
  expect(parseHighlightString('abc')).toBe(null)
  expect(parseHighlightString('1')).toEqual([1])
  expect(parseHighlightString('1,2')).toEqual([1, 2])
  expect(parseHighlightString('1,2-4,5')).toEqual([1, 2, 3, 4, 5])
  expect(parseHighlightString('1-1')).toEqual([1])
})

describe('transformerLineHighlight', () => {
  const genLine = (s: string, options?: {highlighted?: boolean, lineno?: number}) => {
    let html = `<span class="line"><span>${s}</span></span>`
    if (options?.lineno) {
      html = `<span class="line" data-line="${options.lineno}"><span>${s}</span></span>`
    }
    if (options?.highlighted) {
      html = html.replace('class="line"', 'class="line highlighted"')
    }
    return html
  }
  const genLines = (items: string[]) => {
    return items.map(s => genLine(s)).join('\n')
  }
  const genOutput = (content: string) => {
    const prefix = '<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code>'
    return prefix + content + '</code></pre>'
  }

  const code = "a\nb\nc\nd\ne"
  const fixtures: {options: TransformerHighlightOptions, output: string }[] = [
    {
      options: { highlight: '1' },
      output: genOutput(genLine('a', {highlighted: true}) + '\n' + genLines(['b', 'c', 'd', 'e'])),
    },
    {
      options: { highlight: '1', lineStart: 2 },
      output: genOutput(genLines(['a', 'b', 'c', 'd', 'e'])),
    },
    {
      options: { highlight: '2', lineStart: 2 },
      output: genOutput(genLine('a', {highlighted: true}) + '\n' + genLines(['b', 'c', 'd', 'e'])),
    },
    {
      options: { highlight: '1', lineStart: 0 },
      output: genOutput(genLine('a', {highlighted: true}) + '\n' + genLines(['b', 'c', 'd', 'e'])),
    },
    {
      options: { highlight: '2' },
      output: genOutput([
        genLine('a'),
        genLine('b', {highlighted: true}),
        genLines(['c', 'd', 'e']),
      ].join('\n')),
    },
    {
      options: { highlight: '1,3' },
      output: genOutput([
        genLine('a', {highlighted: true}),
        genLine('b'),
        genLine('c', {highlighted: true}),
        genLines(['d', 'e']),
      ].join('\n')),
    },
    {
      options: { highlight: '1-3' },
      output: genOutput([
        genLine('a', {highlighted: true}),
        genLine('b', {highlighted: true}),
        genLine('c', {highlighted: true}),
        genLines(['d', 'e']),
      ].join('\n')),
    },
    {
      options: { showLines: true },
      output: genOutput(['a', 'b', 'c', 'd', 'e'].map((s, index) => {
        return genLine(s, { lineno: index + 1 })
      }).join('\n')),
    },
    {
      options: { showLines: true, lineStart: 2 },
      output: genOutput(['a', 'b', 'c', 'd', 'e'].map((s, index) => {
        return genLine(s, { lineno: index + 2 })
      }).join('\n')),
    },
  ]

  for (const item of fixtures) {
    const name = Object.keys(item.options).map(k => {
      // @ts-ignore
      return `${k}=${item.options[k]}`
    }).join(' ')
    it(name, async () => {
      const output = await codeToHtml(code, {
        lang: 'text',
        theme: 'github-dark',
        transformers: [transformerLineHighlight(item.options)],
      })
      expect(output).toEqual(item.output)
    })
  }
})

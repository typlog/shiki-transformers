# @typlog/shiki-transformers

Shiki transformers by Typlog.

## Install

Install via npm:

```
npm i @typlog/shiki-transformers
```

Import from CDN:

```html
<script type="module">
  import { transformerLineHighlight } from 'https://esm.sh/@typlog/shiki-transformers'
</script>
```

## Usage

```ts
import { codeToHtml } from 'shiki'
import { transformerLineHighlight } from '@typlog/shiki-transformers'

const code = `console.log('a')
console.log('b')
console.log('c')
console.log('e')
console.log('f')
console.log('g')
console.log('h')
`
const html = await codeToHtml(code, {
  lang: 'ts',
  theme: 'nord',
  transformers: [
    transformerLineHighlight({
      highlight: '1,3-5',
      showLines: true,
    }),
  ],
})
```

## Options

```ts
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
```

## License

MIT License

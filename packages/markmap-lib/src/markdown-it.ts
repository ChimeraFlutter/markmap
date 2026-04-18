import MarkdownIt from 'markdown-it';
import md_ins from 'markdown-it-ins';
import md_mark from 'markdown-it-mark';
import md_sub from 'markdown-it-sub';
import md_sup from 'markdown-it-sup';

function extendedHeadingsPlugin(md) {
  const originalRender = md.render.bind(md);
  md.render = function (src, env) {
    let result = originalRender(src, env);
    // Convert paragraphs containing 7+ hashes to proper headings
    result = result.replace(
      /<p([^>]*)>([\s\S]*?)<\/p>/g,
      (_, attrs, content) => {
        if (!/#{7,}/.test(content)) return _;
        const lines = content.split(/<br\s*\/?>/gi);
        return lines
          .map((line) => {
            const m = line.trim().match(/^(#{7,})\s*(.*)/);
            if (m) {
              return `<h${m[1].length}>${m[2].trim()}</h${m[1].length}>`;
            }
            return `<p${attrs}>${line}</p>`;
          })
          .join('');
      },
    );
    return result;
  };
}

export function initializeMarkdownIt() {
  const md = MarkdownIt({
    html: true,
    breaks: true,
  });
  md.use(md_ins).use(md_mark).use(md_sub).use(md_sup);
  md.use(extendedHeadingsPlugin);
  return md;
}

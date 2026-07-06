import type { ReactNode } from "react";

function renderItalicSegments(text: string, keyPrefix: string): ReactNode[] {
  const italicPattern = /(\*[^*]+\*|_[^_]+_)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  for (let match = italicPattern.exec(text); match; match = italicPattern.exec(text)) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const raw = match[0];
    nodes.push(
      <em key={`${keyPrefix}-italic-${matchIndex}-${match.index}`}>{raw.slice(1, -1)}</em>,
    );

    lastIndex = match.index + raw.length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function renderInlineMarkdown(text: string): ReactNode[] {
  const boldPattern = /(\*\*[\s\S]+?\*\*|__[\s\S]+?__)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  for (let match = boldPattern.exec(text); match; match = boldPattern.exec(text)) {
    if (match.index > lastIndex) {
      nodes.push(
        ...renderItalicSegments(text.slice(lastIndex, match.index), `segment-${matchIndex}`),
      );
    }

    const raw = match[0];
    nodes.push(<strong key={`bold-${matchIndex}-${match.index}`}>{raw.slice(2, -2)}</strong>);

    lastIndex = match.index + raw.length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(...renderItalicSegments(text.slice(lastIndex), `tail-${matchIndex}`));
  }

  return nodes;
}

'use client';

import { useState, useMemo } from 'react';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import katex from 'katex';
import type { InteractiveContent } from '@/lib/types/stage';
import { InteractiveRenderer } from './interactive-renderer';
import { useI18n } from '@/lib/hooks/use-i18n';
import { cn } from '@/lib/utils';

interface SplitInteractiveRendererProps {
  readonly content: InteractiveContent;
  readonly sceneId: string;
  readonly sceneTitle?: string;
}

function renderSimpleMarkdown(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h4 class="expl-h4">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="expl-h3">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="expl-h2">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="expl-code">$1</code>');

  html = html.replace(/\$\$([^$]+)\$\$/g, (_match, tex) => {
    try {
      return `<div class="expl-math-block">${katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return `<div class="expl-math-block"><code>${tex}</code></div>`;
    }
  });

  html = html.replace(/\$([^$\n]+)\$/g, (_match, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<code>${tex}</code>`;
    }
  });

  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) { result.push('<ul class="expl-ul">'); inList = true; }
      result.push(`<li>${trimmed.slice(2)}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { result.push('<ol class="expl-ol">'); inList = true; }
      result.push(`<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`);
    } else {
      if (inList) {
        result.push(result[result.length - 2]?.includes('<ol') ? '</ol>' : '</ul>');
        inList = false;
      }
      if (trimmed === '') {
        result.push('');
      } else if (!trimmed.startsWith('<h')) {
        result.push(`<p class="expl-p">${trimmed}</p>`);
      } else {
        result.push(trimmed);
      }
    }
  }
  if (inList) result.push('</ul>');

  return result.join('\n');
}

export function SplitInteractiveRenderer({
  content,
  sceneId,
  sceneTitle,
}: SplitInteractiveRendererProps) {
  const { t } = useI18n();
  const [panelOpen, setPanelOpen] = useState(true);

  const explanationHtml = useMemo(
    () => (content.explanation ? renderSimpleMarkdown(content.explanation) : ''),
    [content.explanation],
  );

  return (
    <div className="w-full h-full flex">
      {/* Explanation panel */}
      <AnimatePresence initial={false}>
        {panelOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '38%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="h-full overflow-hidden border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-700/50 shrink-0">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('interactive.explanation')}
              </span>
              <button
                onClick={() => setPanelOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                aria-label={t('interactive.hideExplanation')}
              >
                <PanelLeftClose className="size-4" />
              </button>
            </div>
            <div
              className={cn(
                'flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed',
                'prose prose-sm dark:prose-invert max-w-none',
                '[&_.expl-h2]:text-base [&_.expl-h2]:font-bold [&_.expl-h2]:mt-0 [&_.expl-h2]:mb-3 [&_.expl-h2]:text-gray-800 dark:[&_.expl-h2]:text-gray-100',
                '[&_.expl-h3]:text-sm [&_.expl-h3]:font-semibold [&_.expl-h3]:mt-4 [&_.expl-h3]:mb-2 [&_.expl-h3]:text-gray-700 dark:[&_.expl-h3]:text-gray-200',
                '[&_.expl-h4]:text-sm [&_.expl-h4]:font-medium [&_.expl-h4]:mt-3 [&_.expl-h4]:mb-1.5 [&_.expl-h4]:text-gray-600 dark:[&_.expl-h4]:text-gray-300',
                '[&_.expl-p]:mb-2 [&_.expl-p]:text-gray-600 dark:[&_.expl-p]:text-gray-300',
                '[&_.expl-ul]:list-disc [&_.expl-ul]:pl-5 [&_.expl-ul]:mb-3 [&_.expl-ul]:space-y-1',
                '[&_.expl-ol]:list-decimal [&_.expl-ol]:pl-5 [&_.expl-ol]:mb-3 [&_.expl-ol]:space-y-1',
                '[&_li]:text-gray-600 dark:[&_li]:text-gray-300',
                '[&_.expl-code]:bg-gray-100 dark:[&_.expl-code]:bg-gray-700 [&_.expl-code]:px-1.5 [&_.expl-code]:py-0.5 [&_.expl-code]:rounded [&_.expl-code]:text-xs [&_.expl-code]:font-mono',
                '[&_.expl-math-block]:my-3 [&_.expl-math-block]:text-center [&_.expl-math-block]:overflow-x-auto',
              )}
              dangerouslySetInnerHTML={{ __html: explanationHtml }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button when panel is closed */}
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="absolute left-2 top-2 z-20 p-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 transition-all"
          aria-label={t('interactive.explanation')}
        >
          <PanelLeft className="size-4" />
        </button>
      )}

      {/* Interactive widget */}
      <div className="flex-1 min-w-0 h-full relative">
        <InteractiveRenderer content={content} sceneId={sceneId} sceneTitle={sceneTitle} />
      </div>
    </div>
  );
}

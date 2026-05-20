'use client';

import { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import { Download } from 'lucide-react';
import type { InteractiveContent } from '@/lib/types/stage';
import { useWidgetIframeStore } from '@/lib/store/widget-iframe';
import { patchHtmlForIframe } from '@/lib/utils/iframe';
import { useI18n } from '@/lib/hooks/use-i18n';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface InteractiveRendererProps {
  readonly content: InteractiveContent;
  readonly sceneId: string;
  readonly sceneTitle?: string;
}

export function InteractiveRenderer({ content, sceneId, sceneTitle }: InteractiveRendererProps) {
  const { t } = useI18n();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const registerIframe = useWidgetIframeStore((state) => state.registerIframe);
  const setActiveScene = useWidgetIframeStore((state) => state.setActiveScene);
  const [hovered, setHovered] = useState(false);

  const patchedHtml = useMemo(
    () => (content.html ? patchHtmlForIframe(content.html) : undefined),
    [content.html],
  );

  const sendMessageToIframe = useCallback((type: string, payload: Record<string, unknown>) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type, ...payload }, '*');
    }
  }, []);

  useEffect(() => {
    registerIframe(sceneId, sendMessageToIframe);
    setActiveScene(sceneId);
    return () => {
      registerIframe(sceneId, null);
    };
  }, [sceneId, registerIframe, sendMessageToIframe, setActiveScene]);

  const handleDownload = useCallback(() => {
    if (!content.html) return;
    const blob = new Blob([content.html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sceneTitle || 'interactive'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content.html, sceneTitle]);

  return (
    <div
      className="w-full h-full relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <iframe
        ref={iframeRef}
        srcDoc={patchedHtml}
        src={patchedHtml ? undefined : content.url}
        className="absolute inset-0 w-full h-full border-0"
        title={`Interactive Scene ${sceneId}`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />

      {content.html && hovered && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleDownload}
              className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md border border-gray-200/60 dark:border-gray-700/60 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all"
              aria-label={t('interactive.downloadHtml')}
            >
              <Download className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            {t('interactive.downloadHtml')}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles, FileText, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/hooks/use-i18n';
import type { Scene } from '@/lib/types/stage';
import { InteractiveRenderer } from '@/components/scene-renderers/interactive-renderer';

interface PreviewPanelProps {
  readonly scene: Scene | null;
  readonly isGenerating: boolean;
  readonly currentStepLabel?: string;
  readonly onEnterClassroom?: () => void;
  readonly enterClassroomDisabled?: boolean;
}

function SlidePreview({ scene }: { readonly scene: Scene }) {
  if (scene.content.type === 'interactive' && scene.content.html) {
    return (
      <InteractiveRenderer
        content={scene.content}
        sceneId={scene.id}
        sceneTitle={scene.title}
      />
    );
  }

  if (scene.content.type !== 'slide') {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        <FileText className="size-8 mr-2 opacity-50" />
        <span className="text-sm">{scene.title}</span>
      </div>
    );
  }

  const canvas = scene.content.canvas;
  const bgColor = canvas.background?.color || '#ffffff';

  return (
    <div
      className="w-full h-full overflow-auto"
      style={{ backgroundColor: bgColor }}
    >
      <div className="p-6 space-y-4">
        {canvas.elements?.map((el) => {
          if (el.type === 'text' && 'content' in el) {
            return (
              <div
                key={el.id}
                className="text-sm leading-relaxed"
                style={{
                  position: 'absolute',
                  left: `${(el.left / 960) * 100}%`,
                  top: `${(el.top / 540) * 100}%`,
                  width: `${(el.width / 960) * 100}%`,
                }}
                dangerouslySetInnerHTML={{ __html: (el as { content: string }).content || '' }}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

function SkeletonPreview({ stepLabel }: { readonly stepLabel?: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      <motion.div
        className="relative"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="size-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-800/30 flex items-center justify-center">
          <MonitorPlay className="size-8 text-blue-400/60" />
        </div>
        <motion.div
          className="absolute -top-1 -right-1 size-4 rounded-full bg-blue-500/20"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>

      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-muted-foreground/70">
          {stepLabel || '课件预览'}
        </p>
        <p className="text-xs text-muted-foreground/50">
          生成完成后将在此处展示预览
        </p>
      </div>

      <div className="w-48 space-y-2">
        <motion.div
          className="h-2 rounded-full bg-muted/40"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="h-2 rounded-full bg-muted/30 w-3/4"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        />
        <motion.div
          className="h-2 rounded-full bg-muted/20 w-1/2"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
        />
      </div>
    </div>
  );
}

export function PreviewPanel({
  scene,
  isGenerating,
  currentStepLabel,
  onEnterClassroom,
  enterClassroomDisabled,
}: PreviewPanelProps) {
  const { t } = useI18n();

  const previewContent = useMemo(() => {
    if (scene) {
      return <SlidePreview scene={scene} />;
    }
    return <SkeletonPreview stepLabel={isGenerating ? currentStepLabel : undefined} />;
  }, [scene, isGenerating, currentStepLabel]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/60 dark:border-gray-700/40 shrink-0">
        <div className="flex items-center gap-2">
          <MonitorPlay className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t('generation.preview') || '预览'}
          </span>
        </div>

        {scene && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                size="sm"
                onClick={onEnterClassroom}
                disabled={enterClassroomDisabled}
                className="gap-1.5"
              >
                <Play className="size-3.5" />
                {t('generation.enterClassroom') || '进入课堂'}
              </Button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Preview area */}
      <div className="flex-1 relative overflow-hidden bg-gray-50/50 dark:bg-gray-900/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene ? 'preview' : 'skeleton'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {previewContent}
          </motion.div>
        </AnimatePresence>

        {isGenerating && scene && (
          <div className="absolute bottom-3 right-3 z-10">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400">
              <Sparkles className="size-3 animate-pulse" />
              {t('generation.aiWorking') || 'AI 工作中...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

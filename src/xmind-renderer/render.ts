import { createMapByXMindMark } from '@markxmind/markxmind-core';
import type { MapThemeMode } from '../settings';
import { ensureSnowbrushLoaded } from './loader';
import { darkTheme, lightTheme } from './theme';

type RenderRecord = {
  host: HTMLElement;
  source: string;
};

const renderRegistry = new Map<HTMLElement, RenderRecord>();

function isSystemDarkMode(): boolean {
  return document.body.classList.contains('theme-dark');
}

function resolveTheme(themeMode: MapThemeMode): typeof lightTheme {
  if (themeMode === 'dark') return darkTheme as unknown as typeof lightTheme;
  if (themeMode === 'light') return lightTheme;
  return (isSystemDarkMode() ? darkTheme : lightTheme) as unknown as typeof lightTheme;
}

function applyMapTheme(
  editor: { getSheetModel?: () => { changeTheme?: (t: unknown) => void } },
  themeMode: MapThemeMode,
): void {
  if (!editor) return;

  try {
    const sheetModel = editor.getSheetModel?.();
    if (!sheetModel) return;
    sheetModel.changeTheme?.(resolveTheme(themeMode));
  } catch (error) {
    console.error('[markxmind] failed to apply theme:', error);
  }
}

function disposeExportEditor(editor: { destroy?: () => void }): void {
  if (!editor) return;
  try {
    editor.destroy?.();
  } catch {
    // ignore
  }
}

export function disposeXmindRender(host: HTMLElement): void {
  host.empty();
  renderRegistry.delete(host);
}

export function disposeAllHosts(): void {
  for (const host of renderRegistry.keys()) {
    disposeXmindRender(host);
  }
}

async function exportMapToSvg(source: string, themeMode: MapThemeMode): Promise<string | null> {
  const model = createMapByXMindMark(source);
  model.theme = resolveTheme(themeMode) as typeof model.theme;

  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.width = '1000px';
  tempContainer.style.height = '1000px';
  document.body.appendChild(tempContainer);

  const SnowbrushRef = window.Snowbrush;
  if (!SnowbrushRef?.SheetEditor || !SnowbrushRef?.Model?.Sheet) {
    document.body.removeChild(tempContainer);
    return null;
  }

  const exportInstance = new SnowbrushRef.SheetEditor({
    el: tempContainer,
    model: new SnowbrushRef.Model.Sheet(model),
  });

  await new Promise<void>((resolve) => {
    exportInstance.on('SHEET_CONTENT_LOADED', () => {
      exportInstance.execAction?.('fitMap');
      applyMapTheme(exportInstance, themeMode);
      resolve();
    });
    exportInstance.initInnerView();
  });

  let svgData: string | null = null;
  try {
    const result = await exportInstance.exportImage({
      format: 'SVG',
      skipFont: false,
    });
    svgData = result?.data ?? null;
  } catch (error) {
    console.error('[markxmind] export SVG failed:', error);
  } finally {
    disposeExportEditor(exportInstance);
    document.body.removeChild(tempContainer);
  }

  return svgData;
}

function displaySvg(host: HTMLElement, svgData: string): void {
  host.empty();
  const wrapper = host.createDiv({ cls: 'mxm-codeblock-wrapper mxm-svg-wrapper' });

  if (svgData.startsWith('data:')) {
    const img = wrapper.createEl('img', { attr: { src: svgData, alt: 'XMind mind map' } });
    img.addClass('mxm-svg-image');
  } else if (svgData.trim().startsWith('<')) {
    wrapper.innerHTML = svgData;
  } else {
    wrapper.createDiv({ cls: 'mxm-codeblock-error', text: 'Invalid SVG data' });
  }
}

export async function renderXmindCodeBlock(params: {
  host: HTMLElement;
  source: string;
  themeMode?: MapThemeMode;
}): Promise<void> {
  const { host, source, themeMode = 'light' } = params;

  if (!source?.trim()) {
    disposeXmindRender(host);
    host.createDiv({
      cls: 'mxm-codeblock-empty',
      text: 'XMind code block is empty.',
    });
    return;
  }

  disposeXmindRender(host);
  await ensureSnowbrushLoaded();

  const svgData = await exportMapToSvg(source, themeMode);
  if (!svgData) {
    host.empty();
    host.createDiv({
      cls: 'mxm-codeblock-error',
      text: 'Failed to export mind map to SVG.',
    });
    return;
  }

  displaySvg(host, svgData);
  renderRegistry.set(host, { host, source });
}

export async function rerenderAllXmindBlocks(themeMode?: MapThemeMode): Promise<void> {
  const records = Array.from(renderRegistry.values());
  await Promise.all(
    records.map(async (record) => {
      await renderXmindCodeBlock({
        host: record.host,
        source: record.source,
        themeMode: themeMode ?? 'light',
      });
    }),
  );
}

import { MarkdownPostProcessorContext, MarkdownRenderChild, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, MarkxmindPluginSettings, MarkxmindSettingTab } from './settings';
import {
  disposeAllHosts,
  disposeXmindRender,
  renderXmindCodeBlock,
  rerenderAllXmindBlocks,
} from './xmind-renderer/render';

export default class MarkxmindPlugin extends Plugin {
  settings: MarkxmindPluginSettings;

  async rerenderAllXmindBlocks(): Promise<void> {
    await rerenderAllXmindBlocks(this.settings.mapTheme);
  }

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new MarkxmindSettingTab(this.app, this));

    const xmindCodeBlockHandler = async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
      ctx.addChild(new XmindRenderChild(el));

      try {
        await renderXmindCodeBlock({
          host: el,
          source,
          themeMode: this.settings.mapTheme,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        el.empty();
        el.createDiv({
          cls: 'mxm-codeblock-error',
          text: `MarkXMind render failed: ${message}`,
        });
      }
    };

    this.registerMarkdownCodeBlockProcessor('xmind', xmindCodeBlockHandler);
    this.registerMarkdownCodeBlockProcessor('xmindmark', xmindCodeBlockHandler);

    this.registerEvent(
      this.app.workspace.on('css-change', () => {
        void rerenderAllXmindBlocks(this.settings.mapTheme);
      }),
    );
  }

  onunload() {
    disposeAllHosts();
  }

  async loadSettings(): Promise<void> {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}

class XmindRenderChild extends MarkdownRenderChild {
  constructor(containerEl: HTMLElement) {
    super(containerEl);
  }

  onunload(): void {
    disposeXmindRender(this.containerEl);
  }
}

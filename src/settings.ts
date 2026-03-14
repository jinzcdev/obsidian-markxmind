import { App, PluginSettingTab, Setting } from 'obsidian';
import type MarkxmindPlugin from './main';

export type MapThemeMode = 'light' | 'dark' | 'system';

export interface MarkxmindPluginSettings {
  mapTheme: MapThemeMode;
}

export const DEFAULT_SETTINGS: MarkxmindPluginSettings = {
  mapTheme: 'light',
};

export class MarkxmindSettingTab extends PluginSettingTab {
  plugin: MarkxmindPlugin;

  constructor(app: App, plugin: MarkxmindPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Mind Map Theme')
      .setDesc('The theme used to render XMind mind maps')
      .addDropdown((dropdown) =>
        dropdown
          .addOption('light', 'Light')
          .addOption('dark', 'Dark')
          .addOption('system', 'System')
          .setValue(this.plugin.settings.mapTheme)
          .onChange(async (value: MapThemeMode) => {
            this.plugin.settings.mapTheme = value;
            await this.plugin.saveSettings();
            await this.plugin.rerenderAllXmindBlocks();
          }),
      );
  }
}

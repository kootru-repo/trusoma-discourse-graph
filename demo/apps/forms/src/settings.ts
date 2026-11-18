/* The plugin's one setting: the command that starts Python on this computer. */
import { PluginSettingTab, Setting } from "obsidian";
import type { App, Plugin } from "obsidian";

export type Settings = { python: string };
export const DEFAULT_SETTINGS: Settings = { python: "python" };

type SettingsHost = Plugin & { settings: Settings };

export class SettingsTab extends PluginSettingTab {
  constructor(
    app: App,
    private readonly host: SettingsHost,
  ) {
    super(app, host);
  }

  display(): void {
    this.containerEl.empty();
    new Setting(this.containerEl)
      .setName("Python command")
      .setDesc(
        "The command that starts Python on this computer. The forms run tools/dm/form_api.py with it, in the folder above the vault.",
      )
      .addText((t) =>
        t.setValue(this.host.settings.python).onChange(async (x) => {
          this.host.settings.python = x.trim() || DEFAULT_SETTINGS.python;
          await this.host.saveData(this.host.settings);
        }),
      );
  }
}

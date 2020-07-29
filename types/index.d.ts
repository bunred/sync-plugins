import { PathLike } from "fs";

export interface SyncPluginsProps {
  savePath?: PathLike | number;
  pluginsPath?: string;
  pluginsPrefixUrl?: string;
  pluginsInfoArr?: {
    enable: boolean;
    "plugin-id": string;
    "plugin-folder": string;
  }[];
}

export type SyncPlugins = (props: SyncPluginsProps) => void;

module.exports.syncPlugins = (props: SyncPluginsProps) => SyncPlugins;

import { PathLike } from "fs";

export interface SyncPluginsProps {
  savePath?: PathLike | number;
  pluginsPath?: string;
  pluginsPrefixUrl?: string;
  pluginsInfoArr?: any;
}

export type SyncPlugins = (props: SyncPluginsProps) => void;

module.exports.syncPlugins = (props: SyncPluginsProps) => SyncPlugins;

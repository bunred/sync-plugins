import { SyncPluginsProps } from "../../types";
import rmDir from "./rm-dir";

export default async function syncPlugins({
  pluginsPath,
  pluginsInfoArr = [],
}: SyncPluginsProps) {
  const chalk = require("chalk");
  const compareVersions = require("compare-versions");
  const fs = require("fs");

  const path = require("path");
  const fse = require("fs-extra");

  // plugins folder path
  if (!pluginsPath) pluginsPath = path.resolve(__dirname, "../../plugins");

  // local plugins-info.json
  if (!pluginsInfoArr)
    pluginsInfoArr = require("../../plugins-info.json") || [];

  // Checking plugins START
  console.log(chalk.white("- Checking bunadmin plugins updates..."));

  const syncMSGs: any[] = [];
  // read and handle plugins-info.json
  let keepOldNum = 0;

  async function updatePlugins() {
    for (let i = 0; i < pluginsInfoArr.length; i++) {
      const p = pluginsInfoArr[i];

      const isEnabled = p["enable"];
      if (!isEnabled) {
        keepOldNum && keepOldNum++;
        console.log(
          chalk.white(`  · Plugin is not enabled: ${p["plugin-id"]}`)
        );
        syncMSGs[i] = "plugin not enabled";
        continue;
      }

      const packagePath = path.resolve(`node_modules/${p["plugin-id"]}`);

      const packageExists = await fs.existsSync(packagePath);
      if (!packageExists) {
        keepOldNum && keepOldNum++;
        console.log(
          chalk.white(`  · Package is not exists: ${p["plugin-id"]}`)
        );
        syncMSGs[i] = "package not exists";
        continue;
      }

      const localFolder = path.resolve(`${pluginsPath}/${p["plugin-folder"]}`);
      const existedFolder = await fs.existsSync(localFolder);

      let currentVersion = "0";

      try {
        const pluginData = require(`${localFolder}/package.json`);
        if (pluginData && pluginData.version) {
          currentVersion = pluginData.version;
        }
      } catch (e) {
        // console.log(`${localFolder}/package.json`, e);
      }

      let newVersion = "0";

      try {
        const pkgData = require(`${packagePath}/package.json`);
        if (pkgData && pkgData.version) {
          newVersion = pkgData.version;
        }
      } catch (e) {
        console.warn(`  · Local plugin does not exist: ${p["plugin-id"]}`);
        syncMSGs[i] = "plugin not exists";
        continue;
      }

      // No plugin updates available
      if (existedFolder && compareVersions(newVersion, currentVersion) <= 0) {
        console.log(
          chalk.white(`  · No plugin updates available: ${p["plugin-id"]}`)
        );
        keepOldNum++;

        syncMSGs[i] = "plugin no updates";
        continue;
      } // if compareVersions end

      // remove existed plugin
      await rmDir(localFolder);

      // copy plugin from node_modules to plugins
      try {
        await fse.copy(`${packagePath}/dist`, localFolder);
        if (existedFolder) {
          console.log(
            chalk.green(`  · Plugin updated : ${p["plugin-id"]}@${newVersion}`)
          );
          syncMSGs[i] = "plugin updated";
        } else {
          console.log(
            chalk.green(
              `  · Plugin installed : ${p["plugin-id"]}@${newVersion}`
            )
          );
          syncMSGs[i] = "plugin installed";
        }
      } catch (err) {
        console.error(err);
      }
    } // pluginsInfoArr for end
  }

  await updatePlugins();

  // return

  // all plugins' info same to local origin, skip updating plugin-infos.json
  if (keepOldNum === pluginsInfoArr.length) {
    console.log(chalk.blue("- Checking bunadmin plugins completed."));
    return syncMSGs;
  }

  // write new plugins-info.json

  try {
    // Checking plugins END
    console.log(chalk.white("  · Updated plugins-info.json"));
    console.log(chalk.blue("- Checking bunadmin plugins completed."));
  } catch (e) {
    console.log(chalk.yellow("  · Can't update plugins-info.json"));
    console.log(chalk.yellow("- Checking bunadmin plugins completed."));
    return "write false";
  }

  return syncMSGs;
}

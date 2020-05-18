import downloadAndUnzip from "./download-unzip";
import { SyncPluginsProps } from "../../types";

export default async function syncPlugins({
  savePath,
  pluginsPath,
  pluginsPrefixUrl,
  pluginsInfoArr,
}: SyncPluginsProps) {
  const chalk = require("chalk");
  const request = require("request-promise-native");
  const compareVersions = require("compare-versions");
  const fs = require("fs");
  const prettier = require("prettier");

  const path = require("path");

  // local plugin-info.json file name
  const pluginsInfo = "plugins-info.json";
  if (!savePath) savePath = path.resolve(__dirname, pluginsInfo);

  // plugins folder path
  if (!pluginsPath) pluginsPath = path.resolve(__dirname, "../../plugins");

  // plugins library prefix url
  if (!pluginsPrefixUrl)
    pluginsPrefixUrl =
      "https://raw.githubusercontent.com/bunred/bunadmin-plugins/master/navigation";

  // local plugins-info.json
  if (!pluginsInfoArr)
    pluginsInfoArr = require("../../plugins-info.json") || [];

  // Checking plugins START
  console.log(chalk.white("- Checking bunadmin plugins updates..."));

  const newJsonInfo: any[] = [];
  const syncMSGs: any[] = [];
  // read and handle plugins-info.json
  let keepOldNum = 0;

  async function updatePlugins() {
    for (let i = 0; i < pluginsInfoArr.length; i++) {
      const p = pluginsInfoArr[i];

      const isEnabled = p["enable"];
      if (!isEnabled) {
        newJsonInfo[i] = p; // keep original plugin data
        keepOldNum && keepOldNum++;
        console.log(
          chalk.white(`  · Plugin is not enabled: ${p["plugin-id"]}`)
        );
        syncMSGs[i] = "plugin not enabled";
        continue;
      }

      const currentVersion = p["plugin-version"];
      const urlOL =
        pluginsPrefixUrl +
        `/${p["plugin-navigation"]}/${p["plugin-author"]}/${p["plugin-id"]}.json`;
      let reqOptions = {
        url: urlOL,
      };

      const isCustomRequest =
        p["custom-request-options"] && p["custom-request-options"]["url"];
      if (isCustomRequest) {
        reqOptions = p["custom-request-options"];
      }

      let data;
      try {
        data = await request(reqOptions);
      } catch (e) {
        console.warn(`  · Remote plugin does not exist: ${p["plugin-id"]}`);
        newJsonInfo[i] = p; // keep original plugin data
        syncMSGs[i] = "plugin not exists";
        continue;
      }

      const jsonOL = JSON.parse(data);

      if (
        !jsonOL ||
        !jsonOL["plugin-version"] ||
        !jsonOL["plugin-download"] ||
        !jsonOL["plugin-download"]["url"] ||
        !jsonOL["plugin-folder"]
      ) {
        console.error(
          `  · Missing Params: please check the plugin '${p["plugin-id"]}'`
        );
        newJsonInfo[i] = "missing params";
        continue;
      }

      const localFolder = p["plugin-folder"];
      const existedFolder = await fs.existsSync(
        `${pluginsPath}/${localFolder}`
      );

      const newVersion = jsonOL["plugin-version"];
      // No plugin updates available
      if (existedFolder && compareVersions(newVersion, currentVersion) <= 0) {
        console.log(
          chalk.white(`  · No plugin updates available: ${p["plugin-id"]}`)
        );
        newJsonInfo[i] = p; // keep original plugin data
        keepOldNum++;

        syncMSGs[i] = "plugin no updates";
        continue;
      } // if compareVersions end

      const downloadUrl = jsonOL["plugin-download"]["url"];
      const pluginFolder = jsonOL["plugin-folder"];

      const downloadOpts = {
        ...reqOptions,
        url: downloadUrl,
        encoding: null,
      };

      // download to update plugin
      const duRes = await downloadAndUnzip({
        reqOptions: downloadOpts,
        folderName: pluginFolder,
        pluginsPath,
      }); // downloadAnUnzip end

      if (duRes && duRes === "plugin download error") {
        newJsonInfo[i] = p; // keep original plugin data
        keepOldNum++;
        syncMSGs[i] = "plugin download error";
      } else {
        if (existedFolder) {
          console.log(
            chalk.green(`  · Plugin updated : ${p["plugin-id"]}@${newVersion}`)
          );
        } else {
          console.log(
            chalk.green(
              `  · Plugin installed : ${p["plugin-id"]}@${newVersion}`
            )
          );
        }
        // update plugin info, keep local original custom-request-options
        if (isCustomRequest) {
          // remove online custom-request-options, such as "Warning!!!"
          delete jsonOL["custom-request-options"];

          newJsonInfo[i] = {
            enable: true,
            "custom-request-options": reqOptions,
            ...jsonOL,
          };
          syncMSGs[i] = "plugin updated with custom-request-options";
        } else {
          newJsonInfo[i] = { enable: true, ...jsonOL };
          syncMSGs[i] = "plugin updated";
        }
      }
    } // pluginsInfoArr for end
  }

  await updatePlugins();

  // console.log(newJsonInfo)
  // return

  // all plugins' info same to local origin, skip updating plugin-infos.json
  if (keepOldNum === pluginsInfoArr.length) {
    console.log(chalk.blue("- Checking bunadmin plugins completed."));
    return syncMSGs;
  }

  // write new plugins-info.json
  const preJson = prettier.format(JSON.stringify(newJsonInfo), {
    parser: "json",
  });

  try {
    await fs.writeFileSync(savePath, preJson, "utf8");
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

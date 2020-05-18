import rmDir from "./rm-dir";

const AdmZip = require("adm-zip");
const request = require("request-promise-native");
const fs = require("fs");
const path = require("path");

interface Props {
  reqOptions: any;
  folderName: string;
  pluginsPath?: string;
}

export default async function downloadAndUnzip({
  reqOptions,
  folderName,
  pluginsPath,
}: Props) {
  if (pluginsPath === "") return "pluginsPath error";

  // plugins folder path
  if (!pluginsPath) pluginsPath = path.resolve(__dirname, "../../plugins");

  const url = reqOptions && reqOptions.url;
  if (!url) return "reqOptions.url undefined";

  const extractedFolder =
    url &&
    url.replace(/.*?github.com\/.*?\/(.*?)\/archive\/(.*?).zip/g, "$1-$2");

  const download = async function (url: string) {
    try {
      return await request({
        ...reqOptions,
        url,
        encoding: null,
      });
    } catch (e) {
      console.error(`  · Download plugin failed: '${folderName}', ${url}`);
      return "plugin download error";
    }
  };

  const unzip = async function (buffer: string) {
    const zip = new AdmZip(buffer);

    // todo await / sync
    await zip.extractAllToAsync(pluginsPath, true, async function () {
      // remove existed plugin
      await rmDir(`${pluginsPath}/${folderName}`);

      await fs.renameSync(
        `${pluginsPath}/${extractedFolder}`,
        `${pluginsPath}/${folderName}`
      );
    });

    return "done";
  }; // unzip() end

  const downRes = await download(url);
  if (downRes === "plugin download error") return "plugin download error";

  return await unzip(downRes);
} // downloadAndUnzip() END

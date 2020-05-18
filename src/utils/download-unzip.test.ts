import downloadAndUnzip from "./download-unzip";

test("download And Unzip success", async () => {
  const downloadOpts = {
    url:
      "https://github.com/bunred/bunadmin-plugin-buncms-user/archive/1.0.0-alpha.1.zip",
    encoding: null,
  };

  expect(
    await downloadAndUnzip({
      reqOptions: downloadOpts,
      folderName: "buncms-user",
    })
  ).toBe("done");
}, 15000);

test("download success but plugins path failed", async () => {
  const downloadOpts = {
    url:
      "https://github.com/bunred/bunadmin-plugin-buncms-user/archive/1.0.0-alpha.1.zip",
    encoding: null,
  };

  expect(
    await downloadAndUnzip({
      reqOptions: downloadOpts,
      folderName: "buncms-user",
      pluginsPath: "",
    })
  ).toBe("pluginsPath error");
}, 15000);

test("download failed", async () => {
  const downloadOpts = {
    url:
      "https://github.com/bunred/bunadmin-plugin-buncms-user/archive/null.zip",
    encoding: null,
  };

  expect(
    await downloadAndUnzip({
      reqOptions: downloadOpts,
      folderName: "buncms-user",
      pluginsPath: ".tmp/plugins",
    })
  ).toBe("plugin download error");
}, 15000);

import syncPlugins from "./sync-plugins";

test("copy package", async () => {
  expect(
    await syncPlugins({
      pluginsInfoArr: require("../../tests/plugins-info-copy-package.json"),
      pluginsPath: ".tmp/plugins",
    })
  ).toEqual(["plugin installed", "package not exists"]);
});

test("disabled plugin", async () => {
  expect(
    await syncPlugins({
      pluginsInfoArr: require("../../tests/plugins-info-disabled-one.json"),
      pluginsPath: ".tmp/plugins",
    })
  ).toEqual(["plugin no updates", "plugin not enabled"]);
}, 1000);

test("updated to new", async () => {
  await updateVersion();
  expect(
    await syncPlugins({
      pluginsInfoArr: require("../../tests/plugins-info-to-new.json"),
      pluginsPath: ".tmp/plugins",
    })
  ).toEqual(["plugin updated"]);
}, 2000);

async function updateVersion() {
  const fs = require("fs");
  const fileName = ".tmp/plugins/buncms-user/package.json";
  const data = require(`../../${fileName}`);

  data.version = "0";

  await fs.writeFileSync(fileName, JSON.stringify(data));
}

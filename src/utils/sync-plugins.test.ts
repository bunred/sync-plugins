import syncPlugins from "./sync-plugins";

test("default params", async () => {
  expect(await syncPlugins({ pluginsPath: ".tmp/plugins" })).toEqual([
    "plugin no updates",
    "plugin not exists",
  ]);
}, 15000);

test("disabled plugin", async () => {
  expect(
    await syncPlugins({
      pluginsInfoArr: require("../../tests/plugins-info-disabled-one.json"),
      pluginsPath: ".tmp/plugins",
    })
  ).toEqual(["plugin no updates", "plugin not enabled"]);
});

test("to online", async () => {
  expect(
    await syncPlugins({
      pluginsInfoArr: require("../../tests/plugins-info-to-online.json"),
      pluginsPath: ".tmp/plugins",
    })
  ).toEqual(["plugin updated"]);
}, 15000);

test("to online custom-options", async () => {
  expect(
    await syncPlugins({
      pluginsInfoArr: require("../../tests/plugins-info-to-online-custom-options.json"),
      pluginsPath: ".tmp/plugins",
    })
  ).toEqual(["plugin updated with custom-request-options"]);
}, 15000);

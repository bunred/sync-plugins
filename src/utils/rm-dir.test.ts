import rmDir, { rmSubs } from "./rm-dir";
const fs = require("fs");

test("rmDir existed folder", async () => {
  !fs.existsSync(".tmp") && (await fs.mkdirSync(".tmp"));
  !fs.existsSync(".tmp/sub_folder") && (await fs.mkdirSync(".tmp/sub_folder"));
  expect(await rmDir(".tmp")).toBe("rmDir done");
});

test("rmSubs existed file", async () => {
  !fs.existsSync(".tmp") && (await fs.mkdirSync(".tmp"));
  !fs.existsSync(".tmp/sub_file") &&
    (await fs.writeFileSync(".tmp/sub_file", "test"));
  expect(await rmSubs(".tmp/", "sub_file")).toBe("rmSubs done");
});

test("rmSubs not exists", async () => {
  !fs.existsSync(".tmp") && (await fs.mkdirSync(".tmp"));
  expect(await rmSubs(".tmp/", "test")).toBe("subs not exists");
});

test("rmDir not existed root folder", async () => {
  expect(await rmDir(".tmp_null")).toBe("directory not exist");
});

test("rmDir not existed root subfolder", async () => {
  expect(await rmDir(".tmp/null_folder")).toBe("directory not exist");
});

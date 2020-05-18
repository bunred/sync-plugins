const fs = require("fs");

export async function rmSubs(dir: string, x: string) {
  dir = dir + "/";
  if (!(await fs.existsSync(dir + x))) return "subs not exists";

  if (await fs.statSync(dir + x).isDirectory()) {
    await rmDir(dir + x);
  } else {
    await fs.unlinkSync(dir + x);
  }
  return "rmSubs done";
}

export default async function rmDir(dir: string) {
  let files: any[];
  if (!(await fs.existsSync(dir))) return "directory not exist";

  files = await fs.readdirSync(dir);

  if (files.length > 0) {
    async function rmSubFoldersFiles() {
      for (let i = 0; i < files.length; i++) {
        const x = files[i];
        await rmSubs(dir, x);
      }
      return "rmSubFoldersFiles done";
    }
    const rmSub = await rmSubFoldersFiles();
    if (!rmSub) return "rmSub failed";
  } // if files.length end

  await fs.rmdirSync(dir);
  return "rmDir done";
} // rmDir() end

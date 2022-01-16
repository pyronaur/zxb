import { paths } from "./config.mjs";

export async function create(path, content) {
  await fs.ensureDir(paths.bins);
  await fs.writeFileSync(path, content, "utf8");
  await $`chmod +x ${path}`;
}

export async function clear() {
  await $`rm -rf ${paths.bins}`;
}

export function template(filename, path) {
  return `#!/bin/bash
  cd ${path}	
  ./${filename} $@
  `;
}

export async function get() {
	return await globby([`${paths.bins}/*`, `!${paths.bins}/nbins`]);
}
import { paths } from "./config.mjs";
import { binfo } from "./sources.mjs"

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
  ${path}/${filename} $@
  `.split("\n").map(s => s.trim()).join("\n")
}

export async function get() {
	return await globby([`${paths.bins}/*`, `!${paths.bins}/zxb`]);
}


export async function link({ filename, slug, bin, directory }) {
	if (argv.force === true && (await fs.pathExists(bin)) === true) {
		// @TODO: Add global verbosity settings
		$.verbose = false;
		console.log(`Removing ${slug} bin file\n${chalk.gray(`Removing ${bin}`)}`)
		await $`rm ${bin}`;
		$.verbose = true;
	}

	if (false !== await fs.pathExists(bin)) {
		return false;
	}
	const content = template(filename, directory);
	await create(bin, content);
	console.log(`Linked ${bin}`);
	return true;
}

export async function relink() {
	let count = 0;
	for (const script of await binfo()) {
		if (await link(script)) {
			count++;
		}
	}
	return count > 0;
}
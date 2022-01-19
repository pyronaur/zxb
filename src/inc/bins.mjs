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
  `.split("\n").map(s => s.trim()).join("\n")
}

export async function get() {
	return await globby([`${paths.bins}/*`, `!${paths.bins}/nbins`]);
}


async function link({ filename, slug, bin, directory }) {
	if (argv.force === true && (await fs.pathExists(bin)) === true) {
		// @TODO: Add global verbosity settings
		$.verbose = false;
		console.log(`Removing ${slug} bin file\n${chalk.gray(`Removing ${bin}`)}`)
		await $`rm ${bin}`;
		$.verbose = true;
	}

	if (false === await fs.pathExists(bin)) {
		const content = template(filename, directory);
		await create(bin, content)
		console.log(`Creating ${bin}`)
	}
}

export async function relink() {
	for (const nbin of await nbins()) {
		await link(nbin)
	}
}
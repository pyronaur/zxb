import { binfo, search, getSourceDirectories, scriptPaths, addSourceDirectory } from "./sources.mjs";
import { confirm } from "./helpers.mjs";
import * as bins from './bins.mjs'
import { ZXB_PATHS, get, update as updateConfig } from "./config.mjs";
import { installLatestRelease } from "./install.mjs";
import { version } from "./github.mjs";


export async function relink() {

	if (await bins.relink()) {
		console.log("Re-creating bin files");
	} else {
		console.log("All bin files are already linked.")
		console.log(chalk.gray("Use the --force if you must"));
	}
}


export async function cleanup() {
	console.log("Cleaning up the bins");

	const realBins = await bins.get()
	const expectedBins = (await binfo()).map(info => info.bin)

	for (const binpath of realBins) {

		if (!expectedBins.includes(binpath)) {
			const name = path.basename(binpath)

			if (await confirm(`Delete ${name}?`, "y")) {
				await $`rm ${binpath}`;
			}
		}
	}

	console.log("Bins directory is clean!");
}





export async function create(slug) {
	if (!slug) {
		throw new Error("Specify the command slug.\nzxb create <command-name>");
	}

	const { file, bin } = search(slug)

	if (await fs.pathExists(file)) {
		console.log(
			`\n`,
			`${chalk.bold(slug)} already exists:`,
			`\n`,
			`	${file}`,
			`\n	is linked as\n`,
			`	${bin}\n`
		);
		return true;
	}

	const v = $.verbose;
	$.verbose = false;

	const commandExists = await nothrow($`which ${slug}`);

	if (commandExists.exitCode !== 1) {
		const alias = (await $`which ${slug}`).stdout;
		console.log(
			`Command "${chalk.bold(slug)}" is already aliased to "${alias.trim()}"\n`
		);
		process.exit();
	}
	$.verbose = v;

	if (false === await confirm(`Create new command "${chalk.bold(slug)}"?`)) {
		process.exit();
	}

	console.log("Creating a new command: " + slug);


	const directories = [...getSourceDirectories()];
	let directory = directories[0]
	if (directories.length > 1) {
		directories.forEach((dir, index) => {
			console.log(`> ${chalk.bold(index + 1)}:  ${dir} `)
		})

		const directorySelection = await question(`Which directory to use? (default: 1):\n`) ?? 1;
		directory = directories[directorySelection - 1];
	}

	const info = scriptPaths(`${directory}/${slug}.mjs`)

	await $`echo '#!/usr/bin/env zx' >> ${info.file}`;
	await $`chmod +x ${info.file}`;

	await bins.link(info)
	await edit(info)
}









export async function edit({ file }) {
	if (file && await fs.pathExists(file)) {
		return await $`code ${file}`;
	}

	fs.ensureDir(ZXB_PATHS.sources)

	for (const source of getSourceDirectories()) {
		const dirname = path.basename(source);
		const symlink = `${ZXB_PATHS.sources}/${dirname}`
		if (!fs.pathExistsSync(symlink)) {
			await $`ln -s ${source} ${symlink}`;
		}
	}
	await $`code ${ZXB_PATHS.zxb}`;
}










export async function remove({ slug, file, bin }) {
	if (!slug || !file || !bin) {
		throw new Error("Did you specify the command? If so, I can't find it.\nzxb remove command-name");
	}
	if (false === await confirm(`Delete command "${chalk.bold(slug)}"?`)) {
		return false;
	}

	await $`rm ${file}`;
	await $`rm ${bin}`;
}










export async function list() {
	console.log(
		" " +
		(await binfo()).map(info => info.slug)
			.map((name) => `\n - ${name}`)
			.join("")
			.trim()
	);
}

export async function update() {

	const latestVersion = await version();
	const currentVersion = await get('version');

	if (latestVersion === currentVersion) {
		console.log(`${latestVersion} is the latest version! You're up to date.`)
		return;
	}

	const confirmUpdate = `Your version:		${chalk.bold(currentVersion)}\nLatest on GitHub:	${chalk.bold(latestVersion)}\nUpdate? `
	if (currentVersion && currentVersion !== latestVersion && false === await confirm(confirmUpdate, 'y')) {
		return;
	}

	console.log("\nUpdating...")
	await installLatestRelease();
	updateConfig("version", latestVersion)
	console.log("Done!")
}



export async function add_source() {
	await addSourceDirectory();
}

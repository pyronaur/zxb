import { zxb, search } from "./sources.mjs";
import { confirm } from "./helpers.mjs";
import * as bins from './bins.mjs'
import * as config from "./config.mjs";


async function relink() {

	if (await bins.relink()) {
		console.log("Re-creating bin files");
	} else {
		console.log("All bin files are already linked.")
		console.log(chalk.gray("Use the --force if you must"));
	}
}


async function cleanup() {
	console.log("Cleaning up the bins");

	const realBins = await bins.get()
	const expectedBins = await zxb('bin')

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





async function create(slug) {
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


	const directories = [...config.getSources()];
	let directory = directories[0]
	if (directories.length > 1) {
		directories.forEach((dir, index) => {
			console.log(`> ${chalk.bold(index + 1)}:  ${dir} `)
		})

		const directorySelection = await question(`Which directory to use? (default: 1):\n`) ?? 1;
		directory = directories[directorySelection - 1];
	}

	const nbin = config.nbin(`${directory}/${slug}.mjs`)

	await $`echo '#!/usr/bin/env zx' >> ${nbin.file}`;
	await $`chmod +x ${nbin.file}`;

	await link(nbin)
	await edit(nbin)
}









async function edit({ file }) {
	if (file && await fs.pathExists(file)) {
		return await $`code ${file}`;
	}

	fs.ensureDir(`${config.paths.zxb}/sources/`)

	for (const source of config.getSources()) {
		const dirname = path.basename(source);
		const symlink = `${config.paths.zxb}/sources/${dirname}`
		if (!fs.pathExistsSync(symlink)) {
			await $`ln -s ${source} ${symlink}`;
		}
	}
	await $`code ${config.paths.zxb}`;
}










async function remove({ slug, file, bin }) {
	if (!slug || !file || !bin) {
		throw new Error("Did you specify the command? If so, I can't find it.\nzxb remove command-name");
	}
	if (false === await confirm(`Delete command "${chalk.bold(slug)}"?`)) {
		return false;
	}

	await $`rm ${file}`;
	await $`rm ${bin}`;
}










async function list() {
	console.log(
		" " +
		(await zxb('slug'))
			.map((name) => `\n - ${name}`)
			.join("")
			.trim()
	);
}



async function src() {
	await config.addSources();
}



export { list, create, edit, remove, relink, cleanup, src };

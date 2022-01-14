import npaths from "./npaths.mjs";
import { confirm } from "./helpers.mjs";

async function relink() {
	console.log("Re-creating script links");
	
	const bin_directory = `${npaths.bins}`;
	await fs.ensureDir(bin_directory);

	for (const script of await npaths.list()) {
		const { bin, file } = npaths.paths(script);

		if( argv.force === true && ( await fs.pathExists(bin) ) === true ) {
			console.log(`Removing ${bin}`)
			await $`rm ${bin}`;
		}
		
		if ( false === await fs.pathExists(bin) ) {
			console.log(`Linking ${bin}`);
			await $`ln ${npaths.wildcard} ${bin}`;
		}
	}
}

async function cleanup() {
	console.log("Cleaning up the bins...");

	const bins = await npaths.bins();
	const utilities = await npaths.list();

	for (const bin of bins) {
		const binName = path.basename(bin);
		if (!utilities.includes(binName)) {
			if (await confirm(`Delete ${binName}?`, "y")) {
				await $`rm ${bin}`;
			}
		}
	}

	console.log("No more bins left to clean up!");
}

async function create({ slug, file, bin }) {
	if (!slug) {
		console.log("Specify the utility slug.\nutils create <utility-name>");
		return false;
	}

	if (await fs.pathExists(file)) {
		console.log("Already exists");
		return true;
	}

	const v = $.verbose;
	$.verbose = false;

	const commandExists = await nothrow($`which ${slug}`);

	if (commandExists.exitCode !== 1) {
		const alias = (await $`which ${slug}`).stdout;
		console.log(
			`Command "${slug}" is already aliased to "${alias.trim()}"\n`
		);
		process.exit();
	}
	$.verbose = v;


	if (false === await confirm(`Create new utility "${slug}"?`)) {
		console.log("Ok, bye.");
		process.exit();
	}
	
	console.log("Creating a new utility script: " + slug);

	await $`echo '#!/usr/bin/env zx' >> ${file}`;
	await $`chmod a+x ${file}`;
	await $`ln ${file} ${bin}`;

	await $`code ${file}`;
}

async function edit({ slug, file, bin }) {
	if (slug) {
		if (await fs.pathExists(file)) {
			await $`code ${file}`;
		} else {
			console.log(`Utility "${slug}" doesn't exist`);
			await create({ slug, file, bin });
		}
		return;
	}

	await $`code ${npaths.directory}`;
}

async function remove({ slug }) {
	if (!slug) {
		console.log("Specify the utility slug.\nutils create <utility-name>");
		return false;
	}

	if ( false === await confirm(`Delete utility "${slug}"?`)) {
		return false;
	}

	const { file, bin } = npaths.paths(slug);
	await $`rm ${file}`;
	await $`rm ${bin}`;
}

async function list() {
	console.log(
		" " +
			(await npaths.list())
				.map((name) => `\n - ${name}`)
				.join("")
				.trim()
	);
}

export { list, create, edit, remove, relink, cleanup };

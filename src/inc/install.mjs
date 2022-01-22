#!/usr/bin/env zx
const zxb = `${os.homedir()}/.zxb`

/**
 * 
 * This is a standalone zx file that also exports the functions
 * that it uses so that zxb can reuse parts of
 * the code in the updater.
 * 
 */


async function setupPath() {
	const PATH = process.env.PATH;
	const BIN_PATH = `${os.homedir()}/.zxb/bin`;
	const BIN_PATH_STRING = `export PATH=~/.zxb/bin:$PATH`

	if (PATH.includes(BIN_PATH)) {
		console.log("  zxb directory is already installed in $PATH");
		return true;
	}

	const rcfile = [
		os.homedir() + "/.zshrc",
		os.homedir() + "/.bashrc"
	].find(fs.pathExistsSync);



	let pathQuestion = ``
	pathQuestion += `\n\n`
	pathQuestion += `In order for zxb to work, you'll need to update your $PATH variable.`
	pathQuestion += `\n\n`
	pathQuestion += `Add the following code to your $PATH:`
	pathQuestion += "\n\n\n"
	pathQuestion += `	${BIN_PATH_STRING}`
	pathQuestion += `\n\n\n`
	if (rcfile) {
		pathQuestion += `Append to "${rcfile}" automatically? (Y/n)`
		pathQuestion += `\n> `
	}

	let append = await question(pathQuestion)

	if (!append) {
		append = "y";
	}

	if (append.toLowerCase() !== "y") {
		console.log("Ok. Will not append to $PATH.")
		return;
	}

	const rcContent = fs.readFileSync(rcfile, 'utf8');

	if (rcContent.includes(BIN_PATH_STRING)) {
		console.log(`\nWhoops! Looks like the path already exists in ${rcfile}\n`);
		console.log(`And yet its' not found in your $PATH variable. Are you sure ${rcfile} is loaded?`)
		return;
	}

	await $`echo ${BIN_PATH_STRING} >> ${rcfile}`
	console.log(`Appended ${BIN_PATH_STRING} to $PATH.\nReload the terminal and you're good to go!`)
}

async function createZxbAlias() {
	if (await fs.pathExists(`${zxb}/bin/zxb`)) {
		console.log(`  zxb already exists in ${zxb}/bin/zxb`)
		return;
	}

	const template = `
		#!/bin/bash
		~/.zxb/zxb.mjs $@
		`.split("\n")
		.map(s => s.trim())
		.join("\n")
		.trim("\n")
	await $`echo ${template} >> ${zxb}/bin/zxb`
	await $`chmod +x ${zxb}/bin/zxb`

}

async function download(url) {
	if (await $`which wget`.exitCode == 0) {
		return await $`wget -q ${url} -O latest.zip`
	}
	if (await $`which curl`.exitCode == 0) {
		return await $`curl -L ${url} --output latest.zip`
	}

	console.error("Can't find neither `wget` nor `curl` on your system to download the zxb §zip file.")
	process.exit(1);
}

export async function installLatestRelease() {
	const releaseUrl = "https://github.com/pyronaur/zxb/releases/latest/download/latest.zip";

	cd(zxb)
	await download(releaseUrl);
	await $`unzip -o latest.zip -d .`
	await $`rm latest.zip`
	await fs.ensureDir(`${zxb}/bin`)
	await fs.ensureDir(`${zxb}/sources`)

}

async function displayWelcomeMessage() {
	console.log("")
	console.log(chalk.gray("============================================================"));
	console.log(" Welcome to zxb!")
	console.log(chalk.gray("============================================================"));
	console.log("")
	console.log(`Reload the terminal and run ${chalk.bold("zxb")} to finish the setup process.`)
	console.log("")
	console.log(`Some useful commands to get you started:`)
	console.log("")
	console.log(` - ${chalk.bold("zxb help")} 		get the full list of available commands`)
	console.log(` - ${chalk.bold("zxb new my-script")} 	create your first script`)
	console.log(` - ${chalk.bold("zxb list")} 		see a list of scripts you've defined.`)
	console.log("")
}




/**
 * 🚀
 * This is a file that can be run directly to perform zxb installation
 * But we also want to reuse some of that code to update zxb.
 * 
 * That's why this is is a necessary side-effect:
 */
if (argv._.length === 1 && !argv._[0].includes('zxb.mjs')) {

	// Turn off verbose mode by default
	$.verbose = argv.verbose || false;

	await fs.ensureDir(`${zxb}/bin`);

	console.log(`\nInstalling ${chalk.bold("zxb")}...\n`);

	console.log(`\n- Setting up the necessary paths for zxb scripts to run.`);
	await setupPath();

	console.log(`\n- Installing latest version of ${chalk.bold("zxb")} from GitHub...`)
	await installLatestRelease();

	console.log(`\n- Adding zxb executable`)
	await createZxbAlias();

	// Welcome!
	await displayWelcomeMessage();
}





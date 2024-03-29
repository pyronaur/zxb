#!/usr/bin/env zx
const zxb = `${os.homedir()}/.zxb`

/**
 * 
 * This is a standalone zx file for installing and updating zxb.
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

async function installLatestRelease() {
	const releaseUrl = "https://github.com/pyronaur/zxb/releases/latest/download/latest.zip";

	cd(zxb)
	await download(releaseUrl);
	await $`unzip -o latest.zip -d .`
	await $`rm latest.zip`
	await fs.ensureDir(`${zxb}/bin`)
	await fs.ensureDir(`${zxb}/sources`)

}

async function displayWelcomeMessage() {
	const grayLine = chalk.gray("===============================================================");
	const message = `
	${grayLine}
	 Welcome to ${chalk.bold("zxb")}!
	${grayLine}
	
	 Reload the terminal and run ${chalk.bold("zxb")} to finish the setup process.
	
	 Some useful commands to get you started:
	 • ${chalk.bold("zxb help")} 		get the full list of available commands
	 • ${chalk.bold("zxb new my-script")} 	create your first script
	 • ${chalk.bold("zxb list")} 		see a list of scripts you've defined.

	 ${grayLine}`

	console.log(message.replace(/^\t/gm, '|'));
}

const verbose = $.verbose;
$.verbose = false;
const zx_version = await $`zx --version`
$.verbose = verbose;


if (parseInt(zx_version.toString()[0]) < 7) {
	console.error(`Please update ${chalk.bold("zx")} to version 7 or higher to use ${chalk.bold("zxb")}.`)
	process.exit();
}

/**
 * 🚀
 * This is a file that can be run directly to perform zxb installation
 * But we also want to reuse some of that code to update zxb.
 * 
 * That's why this is is a necessary side-effect:
 */

// Turn off verbose mode by default
$.verbose = argv.verbose || false;
if (argv.update) {
	await installLatestRelease();
} else {
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





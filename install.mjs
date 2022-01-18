#!/usr/bin/env zx
const nbins = `${os.homedir()}/.nbins`
await fs.ensureDir(`${nbins}/bin`);

async function install_nbins_path() {
	const PATH = process.env.PATH;
	const BIN_PATH = `${os.homedir()}/.nbins/bin`;
	const BIN_PATH_STRING = `export PATH=~/.nbins/bin/:$PATH`

	if (PATH.includes(BIN_PATH)) {
		console.log("nbins directory is already installed in $PATH");
		return true;
	}

	const rcfile = [
		os.homedir() + "/.zshrc",
		os.homedir() + "/.bashrc"
	].find(fs.pathExistsSync);



	let pathQuestion = ``
	pathQuestion += `\n\n`
	pathQuestion += `In order for nbins to work, you'll need to update your $PATH variable.`
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

async function install_nbins_bin() {
	if (await fs.pathExists(`${nbins}/bin/nbins`)) {
		console.log(`nbins already exists in ${nbins}/bin/nbins`)
		return;
	}

	const template = `
		#!/bin/bash
		cd ~/.nbins	
		./nbins.mjs $@
		`.split("\n")
		.map(s => s.trim())
		.join("\n")
		.trim("\n")
	await $`echo ${template} >> ${nbins}/bin/nbins`
	await $`chmod +x ${nbins}/bin/nbins`

}

async function download(url) {
	if (await $`which wget`.exitCode == 0) {
		return await $`wget -q ${url} -O latest.zip`
	}
	if (await $`which curl`.exitCode == 0) {
		return await $`curl -L ${url} --output latest.zip`
	}

	console.error("Can't find neither `wget` nor `curl` on your system to download the nbins §zip file.")
	process.exit(1);
}

async function install_nbins_from_zip() {
	const releaseUrl = "https://github.com/pyronaur/nbins/releases/latest/download/latest.zip";

	cd(nbins)
	await download(releaseUrl);
	await $`unzip -o latest.zip -d .`
	await $`rm latest.zip`
	await fs.ensureDir(`${nbins}/bin`)
	await fs.ensureDir(`${nbins}/sources`)

}




// 🚀
await install_nbins_path();
await install_nbins_bin();
await install_nbins_from_zip();

const directory = process.env.NSCRIPTS_PATH;
const wildcard = `${os.homedir}/.nbins/wildcard.sh`;

function paths(utilityName) {
	return {
		slug: utilityName,
		file: `${directory}/${utilityName}.mjs`,
		bins: `${os.homedir}/.nbins/bin/`,
		bin: `${os.homedir}/.nbins/bin/${utilityName}`,
	};
}

async function list() {
	const scripts = await globby(`${directory}/*.mjs`);
	return scripts.map((script) => path.basename(script, ".mjs"));
}

async function bins() {
	return await globby(`${directory}/bin/*`);
}

export default { paths, list, directory, wildcard, bins };

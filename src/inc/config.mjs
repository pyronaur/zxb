export const paths = {
	zxb: `${os.homedir()}/.zxb`,
	bins: `${os.homedir()}/.zxb/bin`,
	config: `${os.homedir()}/.zxb/config.json`,
	sources: `${os.homedir()}/.zxb/sources`,
}

export function get(key = false) {
	if (!fs.pathExistsSync(paths.config)) {
		return false;
	}
	const json = JSON.parse(fs.readFileSync(paths.config));
	if (key === false) {
		return json;
	}

	if (json[key]) {
		return json[key];
	}

	return false;
}

export function update(key, value) {
	let json = {};
	if (fs.pathExistsSync(paths.config)) {
		json = get();
	}

	json[key] = value;

	fs.writeFileSync(paths.config, JSON.stringify(json), {
		encoding: "utf8",
	});
}

export function getSources() {
	return new Set(get("sources").filter(n => n) || []);
}

export async function addSources() {
	const defaultSource = `${paths.zxb}/default`;
	const sourcePath = `Where are your script files located?\n${chalk.gray(
		`Default: ${defaultSource}`
	)}\n> `;

	const pathToAdd = (await question(sourcePath)) || defaultSource;
	const sources = await getSources();

	sources.add(pathToAdd);
	fs.ensureDirSync(pathToAdd)

	const addedName = path.basename(pathToAdd)
	const addedSymlink = `${paths.sources}/${addedName}`

	if (defaultSource !== pathToAdd && !fs.pathExistsSync(addedSymlink)) {
		await $`ln -s ${pathToAdd} ${addedSymlink}`;
	}
	update("sources", [...sources]);
}
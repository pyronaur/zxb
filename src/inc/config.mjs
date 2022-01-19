export const paths = {
	zxb: `${os.homedir()}/.zxb`,
	bins: `${os.homedir()}/.zxb/bin`,
	config: `${os.homedir()}/.zxb/config.json`
}

export function nbin(file) {
	const slug = path.parse(file).name
	const filename = path.parse(file).base
	const bin = `${paths.bins}/${slug}`
	const directory = path.dirname(file)
	return {
		slug,
		bin,
		file,
		filename,
		directory
	}
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
	return new Set(get("sources") || []);
}

export async function addSources() {
	const defaultSources = `${os.homedir()}/.zxb/scripts/`;
	const sourcePath = `Where are your script files located?\n${chalk.gray(
		`Default: ${defaultSources}`
	)}\n> `;

	const path = (await question(sourcePath)) ?? defaultSources;
	const sources = await getSources();

	sources.add(path);

	update("sources", [...sources]);
}
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
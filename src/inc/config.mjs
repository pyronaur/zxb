export const ZXB_PATHS = {
	zxb: `${os.homedir()}/.zxb`,
	bins: `${os.homedir()}/.zxb/bin`,
	config: `${os.homedir()}/.zxb/config.json`,
	sources: `${os.homedir()}/.zxb/sources`,
}

export function get(key = false) {
	if (!fs.pathExistsSync(ZXB_PATHS.config)) {
		return false;
	}
	const json = JSON.parse(fs.readFileSync(ZXB_PATHS.config));
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
	if (fs.pathExistsSync(ZXB_PATHS.config)) {
		json = get();
	}

	json[key] = value;

	fs.writeFileSync(ZXB_PATHS.config, JSON.stringify(json, null, 4), {
		encoding: "utf8",
	});
}
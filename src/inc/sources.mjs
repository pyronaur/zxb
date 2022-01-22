import { ZXB_PATHS, get, update } from "./config.mjs";



export function scriptPaths(file) {
	const slug = path.parse(file).name;
	const filename = path.parse(file).base;
	const bin = `${ZXB_PATHS.bins}/${slug}`;
	const directory = path.dirname(file);
	return {
		slug,
		bin,
		file,
		filename,
		directory
	};
}



export async function binfo() {
	return (await getScriptSources()).map(scriptPaths)
}


export async function search(slug) {
	const bins = await binfo();
	return bins.find(bin =>
		bin.slug === slug
	)

}


export async function getScripts(directory) {
	return await globby(`${directory}/*.mjs`);
}


export async function getScriptSources() {
	const sources = [...getSourceDirectories()];
	const scripts = await Promise.all(sources.map(getScripts))
	return scripts.flat();
}


export function getSourceDirectories() {

	const sources = get("sources");
	if (!sources) {
		return new Set([]);
	}

	return new Set(sources.filter(n => n));
}


export async function addSourceDirectory() {
	const sources = await getSourceDirectories();

	const defaultSource = `${ZXB_PATHS.zxb}/default`;
	const sourcePath = `Enter full path to source directory:\n${chalk.gray(
		`Default: ${defaultSource}`
	)}\n> `;

	const pathToAdd = (await question(sourcePath)) || defaultSource;


	sources.add(pathToAdd);
	fs.ensureDirSync(pathToAdd)

	const addedName = path.basename(pathToAdd)
	const addedSymlink = `${ZXB_PATHS.sources}/${addedName}`

	if (defaultSource !== pathToAdd && !fs.pathExistsSync(addedSymlink)) {
		await $`ln -s ${pathToAdd} ${addedSymlink}`;
	}
	update("sources", [...sources]);
}
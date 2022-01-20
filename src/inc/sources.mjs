import { paths, get, update } from "./config.mjs";




export function scriptPaths(file) {
	const slug = path.parse(file).name;
	const filename = path.parse(file).base;
	const bin = `${paths.bins}/${slug}`;
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
	return new Set(get("sources").filter(n => n) || []);
}




export async function addSourceDirectory() {
	const defaultSource = `${paths.zxb}/default`;
	const sourcePath = `Where are your script files located?\n${chalk.gray(
		`Default: ${defaultSource}`
	)}\n> `;

	const pathToAdd = (await question(sourcePath)) || defaultSource;
	const sources = await getSourceDirectories();

	sources.add(pathToAdd);
	fs.ensureDirSync(pathToAdd)

	const addedName = path.basename(pathToAdd)
	const addedSymlink = `${paths.sources}/${addedName}`

	if (defaultSource !== pathToAdd && !fs.pathExistsSync(addedSymlink)) {
		await $`ln -s ${pathToAdd} ${addedSymlink}`;
	}
	update("sources", [...sources]);
}
import { getSources } from './config.mjs'
import { paths } from "./config";

export async function getScripts(directory) {
	return await globby(`${directory}/*.mjs`);
}

export async function getScriptSources() {
	const sources = [...getSources()];
	const scripts = await Promise.all(sources.map(getScripts))
	return scripts.flat();
}

export async function binfo() {
	return (await getScriptSources()).map(info)
}

export async function search(slug) {
	const bins = await binfo();
	return bins.find(bin =>
		bin.slug === slug
	)

}

export function info(file) {
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
import { getSources, info } from './config.mjs'

export async function getScripts(directory) {
	return await globby(`${directory}/*.mjs`);
}

export async function getScriptSources() {
	const sources = [...getSources()];
	const scripts = await Promise.all(sources.map(getScripts))
	return scripts.flat();
}


export async function search(slug) {
	const bins = await (await getScriptSources()).map(info);
	return bins.find(bin =>
		bin.slug === slug
	)

}
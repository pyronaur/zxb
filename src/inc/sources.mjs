import { getSources, info } from './config.mjs'

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
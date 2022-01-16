import { getSources, nbin } from './config.mjs'

export async function getScripts(directory) {
	return await globby(`${directory}/*.mjs`);
}

export async function getScriptSources() {
	const sources = [...getSources()];
	const scripts = await Promise.all(sources.map(getScripts))
	return scripts.flat();
}

export async function nbins(key = false) {
	return (await getScriptSources()).map((file) => {

		if (key) {
			return nbin(file)[key]
		}

		return nbin(file)
	})
}

export async function search(name) {
	const nbs = await nbins();
	return nbs.find(nbin =>
		nbin.slug === name
	)

}
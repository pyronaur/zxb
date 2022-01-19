import {getSources, addSources } from './config.mjs'
export default async function env_requirements() {
	const PATH = process.env.PATH;
	const BIN_PATH = `${os.homedir()}/.nbins/bin`

	if( getSources().size === 0 ) {
		await addSources();
	}

	if (!PATH.includes(BIN_PATH)) {
		console.log("Make sure that you've set up the $PATH correctly.");
		console.log(PATH);
		console.log(`Your $PATH should include ${BIN_PATH}`);
		return false;
	}


	return true;
}

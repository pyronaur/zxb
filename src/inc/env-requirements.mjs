export default function env_requirements() {
	const PATH = process.env.PATH;
	const BIN_PATH = `${os.homedir()}/.nbins/bin`

	// if (!NSCRIPTS_PATH) {
	// 	console.log(`Scripts path is missing.`)
	// 	return false;
	// }

	if (!PATH.includes(BIN_PATH)) {
		console.log("Make sure that you've set up the $PATH correctly.");
		console.log(PATH);
		console.log(NSCRIPTS_PATH);
		console.log(`Your $PATH should include `);
		return false;
	}


	return true;
}

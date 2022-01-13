export default function env_requirements() {
	const NSCRIPTS_PATH = process.env.NSCRIPTS_PATH;
	const PATH = process.env.PATH;
	const BIN_PATH = `${os.homedir()}/.nbins/bin`

	if (!NSCRIPTS_PATH) {
		console.log(`\nLooks like NSCRIPTS_PATH is not defined.`);
		console.log(`Add this to your bash profile file:`);

		// @TODO: Initialize the setup



		return false;
	}

	if (!PATH.includes(BIN_PATH)) {
		console.log("Make sure that you've set up the $PATH correctly.");
		console.log(PATH);
		console.log(NSCRIPTS_PATH);
		console.log(`Your $PATH should include `);
		return false;
	}


	return true;
}

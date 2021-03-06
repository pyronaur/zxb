import { getSourceDirectories, addSourceDirectory } from './sources.mjs'
import { relinkBins } from './bins.mjs'

export default async function env_requirements() {
	const PATH = process.env.PATH;
	const BIN_PATH = `${os.homedir()}/.zxb/bin`

	if (getSourceDirectories().size === 0) {
		console.log("Welcome! Where should zxb store your scripts?")
		await addSourceDirectory();
		await relinkBins();

		console.log("All done! If you want to add more source directories,")
		console.log(`run ${chalk.bold("zxb add_source")}`);
	}

	if (!PATH.includes(BIN_PATH)) {
		console.log("Make sure that you've set up the $PATH correctly.");
		console.log(PATH);
		console.log(`Your $PATH should include ${BIN_PATH}`);
		return false;
	}


	return true;
}

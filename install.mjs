#!/usr/bin/env zx



const paths = {
  home: os.homedir(),
  nbins: `${os.homedir()}/.nbins`,
  bins: `${os.homedir()}/.nbins/bin`,
  scripts: process.env.NSCRIPTS_PATH,
};

await $`echo "Clearning nbins: Dev Mode"`
await $`rm -rf ${paths.nbins}`

await fs.ensureDir(paths.bins);
await $`cp -r src/* ${paths.nbins}`
await $`ln -s ${paths.nbins}/wildcard.sh ${paths.bins}/nbins`



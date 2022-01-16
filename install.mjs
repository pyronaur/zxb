#!/usr/bin/env zx
const nbins = `${os.homedir()}/.nbins`
await fs.ensureDir(`${nbins}/bin`);


async function install_nbins_bin() {
	if (! await fs.pathExists(`${nbins}/bin/nbins`)) {
		const template = `
		#!/bin/bash
		cd ~/.nbins	
		./nbins.mjs $@
		`.split("\n")
			.map(s => s.trim())
			.join("\n")
			.trim("\n")
		await $`echo ${template} >> ${nbins}/bin/nbins`
		await $`chmod +x ${nbins}/bin/nbins`
	}

}



await install_nbins_bin();
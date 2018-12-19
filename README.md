# JupyterLab Shell File

This extension is intended for creating and running a shell script file in JupyterLab. Additionally, it supports creation of SLURM job script and able to run through `sbatch` command.

![](https://lh3.googleusercontent.com/Q1OIvG9s-5HhSld6NF3p2LKG3SFM-DzmXdzReQ5AbtzltVb1ZKhRtO9_2dQych1iDoPQrmwsrno)
![](https://lh3.googleusercontent.com/aCZSA3KcX69VfLoEav0QTsQ9NzyO6B0rVBzuYOR133tv30DnTv6Gu2w1ivpxoaL3jPRIMYE8eIQ)

## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install @enlznep/jupyterlab_shell_file
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

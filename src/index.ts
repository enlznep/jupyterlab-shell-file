import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the xtreme_stargate_slurm extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab_shell_file',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension jupyterlab_shell_file is activated!');
  }
};

export default extension;

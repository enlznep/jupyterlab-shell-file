import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { map, toArray } from '@phosphor/algorithm';

import '../style/index.css';

const FACTORY = 'Editor';
const PALETTE_CATEGORY = 'Text Editor';
const ICON_CLASS = 'jp-FileIcon';
const SLURM_ICON_CLASS = 'jp-slurmIcon';
const SHELL_ICON_CLASS = 'jp-shellIcon'
const SHELL_EXT_LABEL = "Shell Script";
const SLURM_EXT_LABEL = "Job Script";
const SHELL_EXT = "sh";
const SLURM_EXT = "sbatch";

namespace CommandIDs {
  export const createFile = 'fileeditor:create-file';
  export const runFile = 'fileeditor:run-file';
};

function activate(
  app: JupyterLab,
  browserFactory: IFileBrowserFactory,
  launcher: ILauncher,
  menu: IMainMenu | null,
  palette: ICommandPalette
) {
  const { commands } = app;

  const createFile = (cwd: string, ext: string) => {
    return commands
      .execute('docmanager:new-untitled', {
        path: cwd,
        type: 'file',
        ext
      })
      .then(model => {
        return commands.execute('docmanager:open', {
          path: model.path,
          factory: FACTORY
        });
      });
  };

  // Add commands
  commands.addCommand(CommandIDs.createFile, {
    execute: args => {
      let cwd = args['cwd'] || browserFactory.defaultBrowser.model.path;
      let ext = args['ext'];
      return createFile(cwd as string, ext as string);
    },
    iconClass: args => (
      args['displayIcon'] ? args['iconClass'] as string : ''
    ),
    label: args => (
      args['isPalette'] ?
        `New ${args['extLabel'] as string}` : (args['extLabel'] as string)
    )
  });

  commands.addCommand(CommandIDs.runFile, {
    execute: args => {
      const { tracker } = browserFactory;
      const { currentWidget } = tracker;

      if (!currentWidget) {
        return;
      }

      return Promise.all(
        toArray(
          map(currentWidget.selectedItems(), item => {
            const fileName = item.path.split(" ").join("\\ ");
            let fileNameExt = item.path.split(".");
            let command = `bash ${fileName}`;

            if (fileNameExt[fileNameExt.length-1] === SLURM_EXT) {
              command = `sbatch ${fileName}`;
            }

            return commands.execute('terminal:create-new', {
              initialCommand: command
            });
          })
        )
      );
    },
    iconClass: 'jp-RunIcon',
    label: 'Run shell script',
  });

  prepareLauncher(launcher);
  preparePalette(palette);
  prepareContextMenu(app);
  prepareFileMenu(menu);
}

function prepareLauncher(launcher: any) {
  launcher.add({
    command: CommandIDs.createFile,
    category: 'Other',
    args: {
      displayIcon: true,
      iconClass: `${ICON_CLASS} ${SHELL_ICON_CLASS}`,
      ext: SHELL_EXT,
      extLabel: SHELL_EXT_LABEL
    },
    rank: 2
  });

  launcher.add({
    command: CommandIDs.createFile,
    category: 'Slurm',
    args: {
      displayIcon: true,
      iconClass: `${ICON_CLASS} ${SLURM_ICON_CLASS}`,
      ext: SLURM_EXT,
      extLabel: SLURM_EXT_LABEL
    },
    rank: 1
  });
}

function preparePalette(palette: any) {
  palette.addItem({
    command: CommandIDs.createFile,
    args: {
      isPalette: true,
      extLabel: SHELL_EXT_LABEL
    },
    category: PALETTE_CATEGORY
  });

  palette.addItem({
    command: CommandIDs.createFile,
    args: {
      isPalette: true,
      ext: SLURM_EXT,
      extLabel: SLURM_EXT_LABEL
    },
    category: PALETTE_CATEGORY
  });
}

function prepareContextMenu(app: any) {
  // matches only non-directory items
  const selectorNotDir = '.jp-DirListing-item[data-isdir="false"]';
  app.contextMenu.addItem({
    command: CommandIDs.runFile,
    selector: selectorNotDir,
    rank: 3
  });

  // matches anywhere on filebrowser
  const selectorContent = '.jp-DirListing-content';
  app.contextMenu.addItem({
    command: CommandIDs.createFile,
    selector: selectorContent,
    args: {
      displayIcon: true,
      iconClass: `${ICON_CLASS} ${SHELL_ICON_CLASS}`,
      isPalette: true,
      ext: SHELL_EXT,
      extLabel: SHELL_EXT_LABEL
    },
    rank: -0.5
  });

  app.contextMenu.addItem({
    command: CommandIDs.createFile,
    selector: selectorContent,
    args: {
      displayIcon: true,
      iconClass: `${ICON_CLASS} ${SLURM_ICON_CLASS}`,
      isPalette: true,
      ext: SLURM_EXT,
      extLabel: SLURM_EXT_LABEL
    },
    rank: -0.5
  });
}

function prepareFileMenu(menu: any) {
  menu.fileMenu.newMenu.addGroup([
    {
      command: CommandIDs.createFile,
      args: {
        displayIcon: true,
        iconClass: `${ICON_CLASS} ${SHELL_ICON_CLASS}`,
        ext: SHELL_EXT,
        extLabel: SHELL_EXT_LABEL
      }
    },
    {
      command: CommandIDs.createFile,
      args: {
        displayIcon: true,
        iconClass: `${ICON_CLASS} ${SLURM_ICON_CLASS}`,
        ext: SLURM_EXT,
        extLabel: SLURM_EXT_LABEL
      }
    }
  ], 30);
}

const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-shell-script-file',
  autoStart: true,
  requires: [
    IFileBrowserFactory,
    ILauncher,
    IMainMenu,
    ICommandPalette
  ],
  activate: activate
};

export default extension;

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { IMainMenu } from '@jupyterlab/mainmenu';

import '../style/index.css';

const FACTORY = 'Editor';
const ICON_CLASS = 'jp-FileIcon';
const PALETTE_CATEGORY = 'Text Editor';
const EXT_LABEL = "Shell Script"

namespace CommandIDs {
  export const createNewShellFile = 'fileeditor:create-shell-script-file';
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

  const createNewShellFile = (cwd: string, ext: string = 'sh') => {
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

  const runFile = (command: string) => {
    return commands
      .execute('terminal:create-new', {
        initialCommand: command
      })
  }

  // Add commands
  commands.addCommand(CommandIDs.createNewShellFile, {
    label: args => (args['isPalette'] ? `New ${EXT_LABEL}` : EXT_LABEL),
    iconClass: args => (args['displayIcon'] ? ICON_CLASS : ''),
    execute: args => {
      let cwd = args['cwd'] || browserFactory.defaultBrowser.model.path;
      return createNewShellFile(cwd as string);
    }
  });

  commands.addCommand(CommandIDs.runFile, {
    label: "Run shell script",
    iconClass: "jp-RunIcon",
    execute: args => {
      const widget = browserFactory.tracker.currentWidget.selectedItems().next().path;
      const fileName = widget.split(" ").join("\\ ");
      let initialCommand = "bash";
      const command = `${initialCommand} ${fileName}`;
      return runFile(command as string);
    }
  })

  // add to the launcher
  if (launcher) {
    launcher.add({
      command: CommandIDs.createNewShellFile,
      category: 'Other',
      args: { displayIcon: true },
      rank: 1
    });
  }

  // add to the palette
  if (palette) {
    palette.addItem({
      command: CommandIDs.createNewShellFile,
      args: { isPalette: true },
      category: PALETTE_CATEGORY
    });
  }

  // add to the context menu
  const selectorContent = '.jp-DirListing-content';
  const selectorNotDir = '.jp-DirListing-item[data-isdir="false"]';
  app.contextMenu.addItem({
    command: CommandIDs.createNewShellFile,
    selector: selectorContent,
    args: { displayIcon: true, isPalette: true },
    rank: -0.5
  });

  app.contextMenu.addItem({
    command: CommandIDs.runFile,
    selector: selectorNotDir,
    rank: 3
  });

  // add to the menu
  menu.fileMenu.newMenu.addGroup([
    {
      command: CommandIDs.createNewShellFile,
      args: { displayIcon: true }
    }
  ], 30);
}

const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-shell-script-file',
  autoStart: true,
  requires: [IFileBrowserFactory],
  optional: [
    ILauncher,
    IMainMenu,
    ICommandPalette
  ],
  activate: activate
};

export default extension;

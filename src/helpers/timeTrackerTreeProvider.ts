import * as vscode from "vscode";
import { TimeTracker, FolderTime } from "./timeTracker";

export class TimeTrackerTreeItem extends vscode.TreeItem {
    constructor(public readonly folderTime: FolderTime) {
        super(folderTime.folder_name, vscode.TreeItemCollapsibleState.None);
        this.description = `${folderTime.minutes} mins`;
        this.tooltip = `${folderTime.folder_name}: ${folderTime.minutes} minutes coding time`;
        this.contextValue = "timeTrackerItem";

        this.command = {
            command: "fun-rpc.editTime",
            title: "Edit Workspace Time",
            arguments: [this]
        };
    }
}

export class TimeTrackerTreeProvider implements vscode.TreeDataProvider<TimeTrackerTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TimeTrackerTreeItem | undefined | null | void> =
        new vscode.EventEmitter<TimeTrackerTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TimeTrackerTreeItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TimeTrackerTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TimeTrackerTreeItem): Thenable<TimeTrackerTreeItem[]> {
        if (element) {
            return Promise.resolve([]);
        }

        const data = TimeTracker.load();
        const items = data.folders.map((folder) => new TimeTrackerTreeItem(folder));
        return Promise.resolve(items);
    }
}

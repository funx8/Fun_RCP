import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { type ExtensionContext } from "vscode";
import { logInfo } from "../logger";

export interface FolderTime {
    folder_name: string;
    minutes: number;
}

export interface TimeTrackerData {
    folders: FolderTime[];
}

export class TimeTracker {
    private static filePath: string;

    public static initialize(context: ExtensionContext) {
        try {
            const storagePath = context.globalStorageUri.fsPath;
            if (!fs.existsSync(storagePath)) {
                fs.mkdirSync(storagePath, { recursive: true });
            }
            this.filePath = path.join(storagePath, "time_tracker.json");
        } catch {
            this.filePath = path.join(os.homedir(), ".vscord_time_tracker.json");
        }
        logInfo(`[TimeTracker] Initialized with path: ${this.filePath}`);
    }

    public static load(): TimeTrackerData {
        try {
            if (fs.existsSync(this.filePath)) {
                const content = fs.readFileSync(this.filePath, "utf-8");
                return JSON.parse(content);
            }
        } catch (e) {
            logInfo(`[TimeTracker] Error loading time tracker: ${e}`);
        }
        return { folders: [] };
    }

    public static save(data: TimeTrackerData) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
        } catch (e) {
            logInfo(`[TimeTracker] Error saving time tracker: ${e}`);
        }
    }

    public static getAccumulatedMinutes(folderName: string): number {
        if (!folderName) return 0;
        const data = this.load();
        const found = data.folders.find((f) => f.folder_name === folderName);
        return found ? found.minutes : 0;
    }

    public static incrementMinutes(folderName: string) {
        if (!folderName) return;
        const data = this.load();
        let found = data.folders.find((f) => f.folder_name === folderName);
        if (found) {
            found.minutes += 1;
        } else {
            data.folders.push({ folder_name: folderName, minutes: 1 });
        }
        this.save(data);
        logInfo(`[TimeTracker] Incremented time for folder "${folderName}". Total minutes: ${found ? found.minutes : 1}`);
    }
}

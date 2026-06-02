import { commands, window, workspace, type ExtensionContext } from "vscode";
import { getApplicationId } from "./helpers/getApplicationId";
import { StatusBarMode, editor } from "./editor";
import { RPCController } from "./controller";
import { CONFIG_KEYS } from "./constants";
import { getConfig } from "./config";
import { logInfo } from "./logger";
import { dataClass } from "./data";
import { TimeTracker } from "./helpers/timeTracker";
import { TimeTrackerTreeProvider, TimeTrackerTreeItem } from "./helpers/timeTrackerTreeProvider";

const controller = new RPCController(
    getApplicationId(getConfig()).clientId,
    getConfig().get(CONFIG_KEYS.Behaviour.Debug)
);

export const registerListeners = (ctx: ExtensionContext) => {
    const onConfigurationChanged = workspace.onDidChangeConfiguration(async () => {
        const config = getConfig();
        const clientId = getApplicationId(config).clientId;
        const isEnabled = config.get(CONFIG_KEYS.Enable);

        controller.debug = config.get(CONFIG_KEYS.Behaviour.Debug) ?? false;
        editor.updateStatusBarFromConfig();

        if (controller.client.clientId !== clientId) {
            if (!isEnabled) await controller.disable();
            await controller.login();
            if (isEnabled) await controller.enable();
        }

        controller.manualIdleMode = config.get(CONFIG_KEYS.Status.Idle.Check) === false;
    });

    ctx.subscriptions.push(onConfigurationChanged);
};

export const registerCommands = (ctx: ExtensionContext) => {
    const config = getConfig();

    const enable = async (update = true) => {
        if (update)
            try {
                await config.update(CONFIG_KEYS.Enable, true);
            } catch {}

        await controller.enable();
    };

    const disable = async (update = true) => {
        if (update)
            try {
                await config.update(CONFIG_KEYS.Enable, false);
            } catch {}

        await controller.disable();

        logInfo("[003] Destroyed Discord RPC client");
        editor.setStatusBarItem(StatusBarMode.Disabled);
    };

    const togglePrivacyMode = async (activate: boolean) => {
        try {
            await config.update(CONFIG_KEYS.App.PrivacyMode, activate);
        } catch {}

        await controller.sendActivity(dataClass.editor != null);
    };

    const enableCommand = commands.registerCommand("fun-rpc.enable", async () => {
        await disable(false);
        await enable(false);

        logInfo("Enabled Discord Rich Presence.");

        if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications))
            await window.showInformationMessage("Enabled Discord Rich Presence");
    });

    const disableCommand = commands.registerCommand("fun-rpc.disable", async () => {
        logInfo("Disabled Discord Rich Presence");

        await disable(false);

        if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications))
            await window.showInformationMessage("Disabled Discord Rich Presence");
    });

    const enableWorkspaceCommand = commands.registerCommand("fun-rpc.workspace.enable", async () => {
        logInfo("Enabled Discord Rich Presence");

        await disable();
        await enable();

        if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications))
            await window.showInformationMessage("Enabled Discord Rich Presence for this workspace");
    });

    const disableWorkspaceCommand = commands.registerCommand("fun-rpc.workspace.disable", async () => {
        logInfo("Disabled Discord Rich Presence");

        await disable();

        if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications))
            await window.showInformationMessage("Disabled Discord Rich Presence for this workspace");
    });

    const reconnectCommand = commands.registerCommand("fun-rpc.reconnect", async () => {
        logInfo("Reconnecting to Discord Gateway...");

        editor.setStatusBarItem(StatusBarMode.Pending);

        await controller
            .login()
            .then(async () => await controller.enable())
            .catch(() => {
                if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications))
                    window.showErrorMessage("Failed to reconnect to Discord Gateway");
                editor.setStatusBarItem(StatusBarMode.Disconnected);
            });
    });

    const disconnectCommand = commands.registerCommand("fun-rpc.disconnect", async () => {
        logInfo("Disconnecting from Discord Gateway...");

        await controller.destroy();

        editor.setStatusBarItem(StatusBarMode.Disconnected);
    });

    const enablePrivacyModeCommand = commands.registerCommand("fun-rpc.enablePrivacyMode", async () => {
        logInfo("Enabled Privacy Mode");

        await togglePrivacyMode(true);

        if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications))
            await window.showInformationMessage("Enabled Privacy Mode.");
    });

    const disablePrivacyModeCommand = commands.registerCommand("fun-rpc.disablePrivacyMode", async () => {
        logInfo("Disabled Privacy Mode");

        await togglePrivacyMode(false);

        if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications))
            await window.showInformationMessage("Disabled Privacy Mode.");
    });

    const startIdlingCommand = commands.registerCommand("fun-rpc.startIdling", async () => {
        logInfo("Started Idling");

        controller.manualIdling = true;
        await controller.sendActivity(false, true);

        if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications))
            await window.showInformationMessage("Started Idling.");
    });

    const stopIdlingCommand = commands.registerCommand("fun-rpc.stopIdling", async () => {
        logInfo("Stopped Idling");

        controller.manualIdling = false;
        await controller.sendActivity();

        if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications))
            await window.showInformationMessage("Stopped Idling.");
    });

    ctx.subscriptions.push(
        enableCommand,
        disableCommand,
        enableWorkspaceCommand,
        disableWorkspaceCommand,
        reconnectCommand,
        disconnectCommand,
        enablePrivacyModeCommand,
        disablePrivacyModeCommand,
        startIdlingCommand,
        stopIdlingCommand
    );

    logInfo("Registered Discord Rich Presence commands");
};

export async function activate(ctx: ExtensionContext) {
    logInfo("Discord Rich Presence for VS Code activated.");
    
    // Initialize persistent time tracker
    TimeTracker.initialize(ctx);

    // Initialize Tree Provider for Sidebar Time Tracker View
    const treeProvider = new TimeTrackerTreeProvider();
    window.registerTreeDataProvider("funRpcTimeTrackerView", treeProvider);

    // Register Edit Time Command
    const editTimeCommand = commands.registerCommand("fun-rpc.editTime", async (item?: TimeTrackerTreeItem) => {
        let folderName = item?.folderTime.folder_name;
        if (!folderName) {
            return;
        }

        const currentMinutes = TimeTracker.getAccumulatedMinutes(folderName);
        const input = await window.showInputBox({
            title: `Edit Time for ${folderName}`,
            prompt: "Enter the new coding time in minutes",
            value: String(currentMinutes),
            validateInput: (value) => {
                const parsed = parseInt(value, 10);
                if (isNaN(parsed) || parsed < 0) {
                    return "Please enter a valid non-negative number of minutes.";
                }
                return null;
            }
        });

        if (input !== undefined) {
            const newMinutes = parseInt(input, 10);
            const data = TimeTracker.load();
            const idx = data.folders.findIndex(f => f.folder_name === folderName);
            if (idx !== -1) {
                data.folders[idx].minutes = newMinutes;
            } else {
                data.folders.push({ folder_name: folderName, minutes: newMinutes });
            }
            TimeTracker.save(data);
            treeProvider.refresh();
            
            // Force immediate update of Discord activity
            await controller.sendActivity();
            
            window.showInformationMessage(`Successfully updated coding time for "${folderName}" to ${newMinutes} minutes.`);
        }
    });

    ctx.subscriptions.push(editTimeCommand);

    editor.setStatusBarItem(StatusBarMode.Pending);
    registerCommands(ctx);
    registerListeners(ctx);

    if (!getConfig().get(CONFIG_KEYS.Enable)) await controller.disable();

    // Start persistent time tracking (every 60 seconds) and refresh sidebar
    const timeTrackingInterval = setInterval(() => {
        if (controller.enabled && !controller.isIdling && dataClass.workspaceName) {
            TimeTracker.incrementMinutes(dataClass.workspaceName);
            treeProvider.refresh();
        }
    }, 60000);

    ctx.subscriptions.push({
        dispose: () => clearInterval(timeTrackingInterval)
    });
}

export async function deactivate() {
    logInfo("Discord Rich Presence for VS Code deactivated.");
    editor.dispose();
    dataClass.dispose();
    await controller.destroy();
    logInfo("[004] Destroyed Discord RPC client");
}

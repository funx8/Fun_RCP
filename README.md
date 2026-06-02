<div align="center">

<img width="128" alt="Fun RPC Logo" src="https://raw.githubusercontent.com/funx8/Fun_RCP/main/assets/icon.png" />

# Fun RPC 🚀

**Premium Discord Rich Presence extension for Visual Studio Code, locked to official assets with built-in persistent time-tracking and sidebar time editor.**
</div>

---

**Fun RPC** is a highly customized, feature-rich Discord Rich Presence extension designed to showcase your coding activity in real-time. Created to deliver a premium and seamless developer experience, it keeps your presence updated with precise active coding stats.

## ✨ Premium Features

*   **🔒 Locked VS Code Identity**: The extension is locked to display the official **Visual Studio Code** application name and assets on Discord, ensuring a consistent and clean look regardless of your IDE flavor.
*   **⏳ Persistent Time Tracking**: Tracks your actual coding minutes per workspace folder. The elapsed time is saved locally to a JSON file (`time_tracker.json`) and continues accumulating dynamically across IDE sessions and system restarts.
*   **📊 Sidebar Time Editor**: A dedicated sidebar TreeView shows all your projects and their accumulated minutes. Click on any item to instantly edit its time using a popup input box. Changes are applied immediately without restarting the IDE.
*   **💻 Clean Status Bar**: Displays the presence status on the **bottom-left** status bar next to your Git branch indicator as **"Fun Discord RPC"**.

---

## 🛠️ Sidebar Time Tracker & Editor

Fun RPC adds an icon to your activity bar (Sidebar). When opened, you can:
1. **View All Workspaces**: See a clear list of all workspace folders you have worked on and their active minutes.
2. **Edit Time Instantly**: Click on any workspace folder, enter the new coding time in minutes, and press `Enter`. The time is updated locally and the Discord status resets immediately in real-time.

---

## 📌 Variables List

You can use the following variables to customize your status messages:

| Variable                              | Value                                              |
| ------------------------------------- | -------------------------------------------------- |
| `{app_name}`                          | always "Visual Studio Code"                        |
| `{app_id}`                            | always "vscode" or "vscode-insiders"               |
| `{file_name}`                         | Name of the current file                           |
| `{file_extension}`                    | Extension of the file                              |
| `{file_size}`                         | Size of the file                                   |
| `{folder_and_file}`                   | Folder and file name                               |
| `{relative_file_path}`                | Filepath relative to the workspace folder          |
| `{directory_name}`                    | Directory name                                     |
| `{workspace}`                         | Name of the active workspace                       |
| `{problems_count}`                    | Number of active errors/warnings                   |
| `{line_count}`                        | Total lines in file                                |
| `{current_line}`                      | Current cursor line                                |
| `{git_branch}`                        | Current git branch                                 |
| `{git_url}`                           | URL link to the git repository                     |

---

## 📥 Installation

1. Open your IDE.
2. Go to Extensions (`Ctrl+Shift+X`).
3. Click the three dots `...` in the top right of the extensions pane.
4. Select **Install from VSIX...**
5. Choose `fun-rpc-1.0.2.vsix`.
6. Reload Window.

---

## 📋 License

This project is licensed under the MIT License - see the LICENSE file for details.

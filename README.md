<div align="center">

<img width="128" alt="Fun RPC Logo" src="https://raw.githubusercontent.com/funx8/Fun_RCP/main/assets/icon.png" />

# Fun RPC 🚀

**Highly customizable Discord Rich Presence extension for Visual Studio Code, Cursor, VSCodium, and Antigravity IDE.**

[![Visual Studio Marketplace Version](https://img.shields.io/badge/version-1.0.2-blue.svg)](#)

</div>

---

**Fun RPC** is a custom, feature-rich version of Discord Rich Presence designed to showcase your coding activity in real-time. It has been customized to deliver a premium, consistent developer experience.

## ✨ Special Customized Features

*   **🔒 Locked VS Code Theme**: No matter which editor you use (Cursor, VSCodium, Antigravity, etc.), the extension is locked to display the official **Visual Studio Code** icons and application name automatically to your friends on Discord.
*   **⏳ Persistent Time Tracker**: Tracks active coding minutes spent on each workspace folder. The elapsed time is saved locally to a JSON file (`time_tracker.json`) and continues/accumulates dynamically—even if you close the IDE or restart your machine!
*   **💻 Clean Status Bar**: Displays status on the **bottom-left** next to Git branch indicators for better visibility, under the name **"Fun Discord RPC"**.

---

## ⚙️ How to Personalize

To fully customize this document and your extension, please update the following placeholders in `package.json` and this `README.md`:

1.  **Your GitHub Repository**: Replace `[GITHUB_URL]` with your repo link (e.g. `https://github.com/funx8/Fun_RCP`).
2.  **Your Name/Handle**: Change the publisher and author fields in `package.json`.
3.  **Custom Badges/Social Links**: Add links to your Discord server or website.

---

## 📌 Variables list

The following variables will be replaced with their respective values in your custom strings:

| Variable                              | Value                                              |
| ------------------------------------- | -------------------------------------------------- |
| `{app_name}`                          | always "Visual Studio Code"                        |
| `{app_id}`                            | always "vscode" or "vscode-insiders"               |
| `{file_name}`                         | name of the current file                           |
| `{file_extension}`                    | extension of the file                              |
| `{file_size}`                         | size of the file                                   |
| `{folder_and_file}`                   | folder and file name                               |
| `{relative_file_path}`                | filepath relative to the workspace folder          |
| `{directory_name}`                    | directory name                                     |
| `{workspace}`                         | name of the active workspace                       |
| `{problems_count}`                    | number of active errors/warnings                   |
| `{line_count}`                        | total lines in file                                |
| `{current_line}`                      | current cursor line                                |
| `{git_branch}`                        | current git branch                                 |
| `{git_url}`                           | url link to the git repository                     |

---

## 📥 Installation (VSIX)

1. Open your IDE (VS Code).
2. Go to Extensions (`Ctrl+Shift+X`).
3. Click the three dots `...` in the top right.
4. Select **Install from VSIX...**
5. Choose `fun-rpc-1.0.2.vsix`.
6. Reload Window.

---

## 📋 License

This project is licensed under the MIT License - see the LICENSE file for details.

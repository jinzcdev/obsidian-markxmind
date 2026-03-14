# MarkXMind Plugin for Obsidian

[![License](https://img.shields.io/github/license/jinzcdev/obsidian-markxmind.svg)](https://github.com/jinzcdev/obsidian-markxmind/blob/main/LICENSE)
[![英文文档](https://img.shields.io/badge/英文文档-点击查看-blue)](README.md)

在 [Obsidian](https://obsidian.md) 中，将 [MarkXMind](https://github.com/jinzcdev/markxmind) 的 **XMindMark** 语法在 `xmind` 代码块内渲染为 XMind 思维导图。

<img src="./docs/xmind-codeblock-demo.png" alt="XMindMark 代码块示例" width="70%">

## ✨ 功能

- 📝 使用 XMindMark 语法解析 `xmind`（或 `xmindmark`）代码块为 XMind 思维导图
- 🔗 支持多种标记
- 🌗 支持浅色/深色主题

## 📦 安装

### 从社区插件安装

1. 打开 Obsidian **设置** → **社区插件** → **浏览**
2. 搜索 **MarkXMind**
3. 安装并启用插件

### 手动安装

1. 在仓库中创建插件目录：`.obsidian/plugins/markxmind/`
2. 将以下文件复制到该目录：`main.js`、`styles.css`、`manifest.json`
3. 在 Obsidian 设置 → 社区插件中启用 **MarkXMind** 插件

## 📝 使用示例

> 💡 **强烈建议先体验 [MarkXMind 在线版](https://markxmind.js.org/)**，用于学习 XMindMark 语法并预览效果。

添加思维导图时，创建一个 `xmind`（或 `xmindmark`）代码块，在其中编写 XMindMark 语法即可。

````markdown
```xmind
XMindMark

- 中心主题[L:https://markxmind.js.org/]
    - 文档第一行作为中心主题
    - 前面的空行会被忽略
- 主题层级 [B1]
    - 使用 `-` 或 `*` 开始一行 [N:这是备注]
    * 主题后至少保留一个空格[S]
    * 同级主题之间的空行会被忽略[S][1]
    [S] 行首使用 `*` 效果相同
- 缩进规则 [B1]
    - 主主题（第一级）无需缩进
    - 子主题需缩进（1 个 Tab 等于 4 个空格）
    - 缩进层级决定主题层级
        - 例如，边界与摘要说明应处于同一缩进层级 [B1][S1]
        - 可参考本主题块内的缩进示例 [B1][S1]
        [B1] 边界
        [S1] 摘要[^1](关系)
[B1] 基本语法
```
````

语法遵循 **XMindMark**：

- 第一个非空行为**中心主题**
- 以 `-` 或 `*` 开头的行为主题；缩进表示层级
- 语法支持：边界 `[B1]`、摘要 `[S]`、关系 `[1] with [^1](...)`、链接 `[L:url]`、备注 `[N:...]`、折叠 `[F]` 等

完整语法与示例请参见 [MarkXMind](https://github.com/jinzcdev/markxmind) 项目。

> [!TIP]
>
> **XMindMark** 是用于创建 XMind 思维导图的轻量级标记语言；**MarkXMind** 是一个在线使用 XMindMark 语法生成思维导图的工具。

## 📄 许可证

MIT

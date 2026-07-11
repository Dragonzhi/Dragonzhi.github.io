# 你好，我是 Dragonzhi

[访问我的个人主页！](https://dragonzhi.github.io/)

---

## 徽章与统计

### 项目状态
[![Update Project Data](https://github.com/Dragonzhi/Dragonzhi.github.io/actions/workflows/update-data.yml/badge.svg)](https://github.com/Dragonzhi/Dragonzhi.github.io/actions)
[![GitHub last commit](https://img.shields.io/github/last-commit/Dragonzhi/Dragonzhi.github.io)](https://github.com/Dragonzhi/Dragonzhi.github.io/commits/main)
[![GitHub repo size](https://img.shields.io/github/repo-size/Dragonzhi/Dragonzhi.github.io)](https://github.com/Dragonzhi/Dragonzhi.github.io)

### 技术栈
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---
## 关于项目

这是一个我的个人静态主页，使用原生 HTML, CSS, 和 JavaScript 构建。

这个项目旨在展示我的个人项目与游戏开发经历，并作为一份可以配合简历使用的在线作品集。项目数据通过 GitHub Actions 自动从我的 GitHub 账户同步。

---
## 主要功能

* **精选作品集**：主页从 `data/portfolio.json` 读取并生成项目案例。
* **自动排序与布局**：案例编号、总数和左右交替布局由 JavaScript 自动计算。
* **旧版归档**：原始主页保留在 `/legacy/` 路径。
* **响应式设计**：适配桌面端和移动端。

---

## 更新作品集

作品数据统一维护在 [`data/portfolio.json`](data/portfolio.json)。

### 调整项目顺序

修改项目的 `order` 数字即可，数字越小越靠前。案例编号和左右布局会自动更新。

### 添加项目

1. 把封面图片放到 `images/projects/`。
2. 在 `data/portfolio.json` 中复制一条现有项目记录。
3. 修改 `id`、`order`、标题、图片、简介、职责、技术和链接。
4. 保持 `published` 为 `true`；设为 `false` 可暂时隐藏项目。

可用的 `theme` 值为 `blue`、`immune`、`red`、`ink`。项目链接可以填写任意数量。

本地预览需要通过 HTTP 服务访问，例如：

```bash
python -m http.server 8000
```

然后打开 `http://127.0.0.1:8000/`。直接双击 HTML 时，浏览器可能会阻止读取 JSON。

---

## 最近更新

- **数据驱动作品集**：项目内容、顺序和显示状态统一改由 JSON 管理。
- **页面过渡动画**: 为所有页面添加了平滑的淡入淡出过渡效果，提升了页面的切换体验。
- **夜间模式闪烁修复**: 优化了夜间模式的加载逻辑，现在切换到夜间模式时不再出现白屏闪烁，确保了更流畅的视觉体验。

# WuHua-Gacha-OCR-Export-Power-Automate
物华弥新抽卡记录导出项目：基于 Power Automate 进行 OCR 操作以获取记录；数据处理基于 Vue 3 实现

----

### 如何导出记录
1. 安装 Power Automate，并登录您的微软账号
> 参考文档：https://learn.microsoft.com/zh-cn/power-automate/desktop-flows/install#install-power-automate-using-the-msi-installer
2. 新建流，并粘贴 `script.lua` 文件内的全部内容到 `Power Automate` 编辑器内，更改编辑器底部的 `运行延迟` 为 `1` 毫秒，并保存流
> 流的名称可自定义；默认延迟不改的话执行流内的每一步都要等上 100 毫秒
3. 打开安装有游戏的模拟器，进入到游戏的招集记录页面
> 推荐使用官方提供下载的模拟器：https://game.bilibili.com/whmx/ 点击 `MuMu 模拟器 桌面端下载` 进行下载安装

> 招集记录页面位于：`招集` → `概率详情` → `招集记录`
4. 回到 `Power Automate` 我的流页面，点击刚才保存的流上的 `▷` 运行流
5. 根据弹出窗口内的提示进行相应操作，直至流执行完成

### 导出记录处理与统计（开发中）
通过 Vue 3 进行实现的 Web 端应用，现可以对新版导出的数据进行 `Base64` 转码和 `JSON` 解析

#### 项目开发环境运行方式
> 需要预先安装 Node，（选装 YARN，以下为使用 YARN 的运行示例）
 ```
 yarn
 yarn start
 ```

----

Matce. 24

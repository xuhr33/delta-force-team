# 哈工大三角洲校队主页

暗色电竞风单页官网：横向顶部导航 + 全屏首屏 + 深紫卡片 + 绿色强调。

**纯静态，零依赖，零构建**：没有 Node、没有框架、没有外部 CDN（字体走系统字体栈）。断网双击 `index.html` 就能完整打开。

---

## 一、本地预览

直接双击 `index.html` 即可。

想用本地服务器预览（更接近线上环境）：

```bash
cd D:\delta-force-team-site
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

---

## 二、改内容：改哪个文件

### 1. 单条文字 → 改 `index.html`

页面上只出现一次的文字都在 `index.html` 里，用中文注释标好了位置，搜 `↓↓ 改这里` 就能找到全部：

| 想改什么 | 大概在哪 |
|---|---|
| 首屏小字 / 两行大标题 / 主标语 / 简介 | 首屏 `<section class="hero">` 里 |
| 队伍简介三段话 | 队伍简介板块 |
| 报名流程四步 | 加入我们 → 报名流程 |
| QQ 群号 | 加入我们 → 联系方式 |
| 常见问题 | 加入我们 → 常见问题 |
| 页脚版权、更新日期 | 文件最下面的 `<footer>` |

> 改群号要改**两处**：显示的文字 `<p class="contactcard__value">` 和按钮上的 `data-copy="..."`。

### 2. 重复内容 → 改 `js/data.js`

队伍数字、荣誉焦点、定位卡、战绩、明星队员、队员名单、考核标准这些块由 `js/data.js` 里的数组渲染，改数据不用碰 HTML 结构。

```js
var STATS        = [{ value: '2023', label: '成立年份' }, ...];      // 首屏数据条
var HIGHLIGHT    = { label: '…', text: '…' };                        // 战绩区的荣誉焦点，设为 null 则整块消失
var PILLARS      = [{ keyword: '固定编制', label: '定位·协作·职责', text: '…' }, ...];  // 队伍简介三张卡
var QUOTE        = '个人能力能赢下一次交火…';                        // 队伍简介下方的引言
var ACHIEVEMENTS = [{ date: '2025', title: '赛事名', rank: '名次', desc: '说明' }, ...];
var STARS        = { title: '…', lead: '…', members: [{ name, gameId, note }, ...] };  // 明星队员
var MEMBERS      = [{ name, gameId, role, rank, joined, quote, avatar, lead }, ...];
var RECRUIT      = { intro: [...], groups: [ ... ] };                // 招新考核标准
```

**队员里的 `lead: true`**（现在只有指挥官玖酒仙儿）会被单独提出来，渲染成名单最上面那张带徽章的重点卡。

- 战绩按**时间从新到旧**排，日期写 `YYYY-MM` 格式（页面会自动拆成年 / 月显示）。
- 增删一条就是往数组里加 / 删一个 `{ ... }`，注意每条之间用逗号隔开、最后一条不加逗号。

**队员名单只登记游戏 ID，不写真实姓名。** 每条长这样：

```js
{ name: '奈瑟卡特', gameId: 'HIT、奈瑟卡特',
  role: '突击', rank: '钻石', joined: '2025-09', quote: '一句话', avatar: '' }
```

- `name` 是卡片上的大字，`gameId` 是完整 ID；两者相同时只显示一次
- `role` / `rank` / `joined` / `quote` / `avatar` **都可以不写**。四个文字字段全空时，卡片上不会出现「展开资料」按钮 —— 后面补上资料，按钮会自动出现
- `avatar` 不填时显示「名字首字」色块头像；填了图片路径就显示图片

### 3. 招新考核标准 → 改 `js/data.js` 的 `RECRUIT`

来源是《HIT三角洲行动校队全面战场考核标准规范》，结构分成三层：

```js
var RECRUIT = {
  intro: ['所有兵种分均 > 950（…）', '视报名人数分情况考核…', '以实战为主。'],

  groups: [
    {
      title: '（一）载具类',            // 大类标题
      note:  '',                        // 可选：这一类下面的一段说明
      blocks: [                         // 大类下面再分小类
        {
          label: '空中载具',            // 小类标签，留空字符串就不显示
          items: [
            {
              name: '武直',             // 岗位名
              reqs: ['需全程盯住敌方是否叫载具。', '…']   // 逐条要求
            }
          ]
        }
      ]
    },
    { title: '（二）步战类', … },
    { title: '（三）综合类', … },
    { title: '（四）免考类', … }
  ]
};
```

- 加一个岗位 = 往 `items` 里加一个 `{ name, reqs }`
- 加一整个大类 = 往 `groups` 里加一个 `{ title, note, blocks }`
- 新赛季改标准，只动这一块，`index.html` 里的结构不用碰

---

## 三、换成真实图片（重要）

现在的图片全是**占位图**，换成真图**不需要改任何代码**——把同名文件覆盖掉就行：

| 位置 | 现在是什么 | 换成 | 建议尺寸 |
|---|---|---|---|
| 队徽（左上角 / 页脚） | `images/logo.jpg` | 你的队徽，保持同名覆盖 | 正方形，512×512 以上 |
| 首屏底图 | `images/hero.svg` | **原创战场插画**，想换成真实照片就放进 `images/hero.jpg`，再把 `index.html` 里 `src="images/hero.svg"` 改成 `hero.jpg` | 横版 1920×1080 以上 |
| 队员 / 明星头像 | `images/operators/op1~6.svg` | **原创干员剪影**，6 款按名字自动分配。想给某人单独换就把图片放进 `images/`，路径填进 `data.js` 那条的 `avatar` | 正方形 400×400 |

> 现在所有图都是**程序生成的原创插画**，没有任何版权问题，也不依赖外部图床。
> 你有自己在游戏里截的图（自己拍的）想用，按上表替换即可。

### 换头像

`data.js` 里的队员默认按**名字哈希**从 6 款干员头像里分配，刷新不变。要单独指定某人：

```js
{ name: '奈瑟卡特', gameId: 'HIT、奈瑟卡特', avatar: 'images/avatars/nsk.jpg' }
```

---

## 四、发布到 GitHub Pages（免费）

1. 到 [github.com](https://github.com) 注册账号（已有就跳过）。
2. 右上角 **+ → New repository**：
   - 仓库名填 `delta-force-team`（或你喜欢的名字）
   - 可见性必须选 **Public**（免费版 Pages 只支持公开仓库）
   - 不要勾 "Add a README file"，直接 **Create repository**
3. 把本项目推上去（在项目目录里执行）：

```bash
cd D:\delta-force-team-site
git init
git add .
git commit -m "校队主页第一版"
git branch -M main
git remote add origin https://github.com/你的用户名/delta-force-team.git
git push -u origin main
```

4. 回到仓库页面 → **Settings → Pages**：
   - Source 选 `Deploy from a branch`
   - Branch 选 `main`，目录选 `/ (root)`
   - 点 **Save**
5. 等 1~2 分钟，访问：

```
https://你的用户名.github.io/delta-force-team/
```

### 以后要改内容

改完文件后执行：

```bash
git add .
git commit -m "更新战绩"
git push
```

等一分钟，线上自动更新。

---

## 五、文件结构

```
delta-force-team-site/
├── index.html          ← 单条文字都在这，搜「改这里」
├── README.md           ← 本文件
├── css/
│   └── style.css       ← 配色、排版（改颜色看文件顶部的 :root 变量）
├── js/
│   ├── data.js         ← 数据条/战绩/明星/队员/考核标准 全在这
│   └── main.js         ← 交互逻辑（一般不用动）
├── images/
│   ├── logo.jpg            ← 队徽
│   ├── hero.svg            ← 首屏底图（原创战场插画）
│   ├── qq-group.png        ← QQ 群二维码（已裁好）
│   ├── qq-group-original.png  ← 二维码原图备份，可删
│   ├── operators/
│   │   └── op1~6.svg       ← 原创干员剪影头像（6 款）
│   └── gallery/
│       └── g1.svg ~ g6.svg ← 图集占位
└── docs/
    └── superpowers/specs/  ← 设计规格文档
```

想换整体配色，只改 `css/style.css` 开头 `:root` 里的变量：

```css
--purple-700: #4C0C56;   /* 卡片紫 */
--accent:     #22C55E;   /* 强调绿 */
--bg:         #0C1219;   /* 页面底色 */
```

---

## 六、已实现的功能

- 手机 / 平板 / 桌面全尺寸响应式，窄屏自动折叠成汉堡菜单
- 顶部导航滚动吸附 + 当前板块自动高亮
- 首屏底部数据条（由 `data.js` 的 `STATS` 驱动）
- 队员卡片「展开资料 / 收起资料」手风琴
- 招新考核标准：总则 + 四大类（载具 / 步战 / 综合 / 免考）分组卡片，数据来自 `data.js` 的 `RECRUIT`
- 明星队员板块（国家队预选赛五位校友）· 指挥官重点卡
- 一键复制 QQ 群号（带提示）
- 滚动淡入动画、回到顶部按钮
- 跟随系统「减少动态效果」设置

---

## 七、还没做的（明确不在范围内）

- 在线报名表单 / 数据收集
- 后台管理、登录、数据库
- 评论、留言板、访客统计
- 多语言
- 自定义域名与备案

需要的话再说，这些都要另做方案。

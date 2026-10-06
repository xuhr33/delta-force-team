/* ==========================================================================
   data.js — 页面里「会重复出现的内容」都放在这个文件
   改队员、改战绩、换图片，只需要动这里，不用碰 index.html 的结构。

   当前状态：
     STATS / ACHIEVEMENTS / MEMBERS / RECRUIT 都已是真实内容
     GALLERY 里的图片还是占位图，换成真照片时改这里的 src
   ========================================================================== */

/* ---------- 首屏的四个数字 ---------- */
var STATS = [
  { value: '2023', label: '成立年份' },
  { value: '30+',  label: '在队队员' },
  { value: '7',    label: '获奖次数' },
  { value: '3',    label: '每周训练' }
];

/* ---------- 荣誉焦点 ----------
   战绩区上方那条高亮提示。设为 null 就整块不显示。
   （2026 国际邀请赛那条按用户要求已删，内容在「明星队员」板块保留）
*/
var HIGHLIGHT = null;

/* ---------- 明星队员 ----------
   展示进过国家队预选赛的校友。note 会显示在名字下面。
*/
var STARS = {
  eyebrow: 'National Team Trial',
  title: '国家队预选赛，有我们的人。',
  lead: '2026 国际邀请赛国家队预选赛，五位校队校友代表出战。',
  members: [
    { name: '奈瑟卡特', gameId: 'HIT、奈瑟卡特', note: '国家队预选赛队员' },
    { name: 'bbbing',  gameId: 'HIT、bbbing',  note: '国家队预选赛队员' },
    { name: 'MAVZ',    gameId: 'HIT、MAVZ',    note: '国家队预选赛队员' },
    { name: '茉铭',    gameId: 'HIT、茉铭',    note: '国家队预选赛队员' },
    { name: '江河之情', gameId: 'HIT、江河之情', note: '国家队预选赛队员' }
  ]
};

/* ---------- 战绩荣誉（按时间从新到旧排） ----------
   date 可以不写：不写就不显示左侧的日期方块，卡片自动变两栏
*/
var ACHIEVEMENTS = [
  { title: '全国高校赛',   rank: '四强' },
  { title: '北部赛区',     rank: '冠军' },
  { title: '山河杯',       rank: '冠军' },
  { title: '北疆英雄杯',   rank: '冠军' },
  { title: '山河杯 2.0',   rank: '冠军' },
  { title: '华东杯',       rank: '冠军' },
  { title: '锐战杯',       rank: '冠军' }
];

/* ---------- 队员 ----------
   只登记游戏 ID，不写真实姓名。

   name   = 卡片上的大字（一般是去掉「HIT、」前缀的昵称）
   gameId = 完整游戏 ID（和 name 一样时不会重复显示）

   下面四个字段留空 / 不写，卡片上就不会出现「展开资料」按钮：
     role   位置，如 '突击' / '车长' / '指挥官'
     rank   段位或其他等级
     joined 入队时间，如 '2025-09'
     quote  一句话
     avatar 头像路径，如 'images/members/m1.jpg'；不填则显示首字头像
*/
var MEMBERS = [
  { name: '奈瑟卡特',        gameId: 'HIT、奈瑟卡特', team: 'A 队', captain: true },
  { name: 'Yahbim',         gameId: 'HIT、Yahbim', team: 'A 队' },
  { name: '水無月MINAZUKI',  gameId: 'HIT、水無月MINAZUKI', team: 'A 队' },
  { name: 'hanluo',         gameId: 'HIT、hanluo', team: 'A 队' },
  { name: '江河之情',        gameId: 'HIT、江河之情', team: 'C 队' },
  { name: '友利七奈',        gameId: 'HIT、友利七奈', team: 'B 队' },
  { name: '人好话不多说',    gameId: '人好话不多说', team: 'B 队' },
  { name: '高金兵',          gameId: 'HIT、高金兵', team: 'B 队' },
  { name: '菜花',            gameId: 'HIT、菜花', team: 'C 队', captain: true },
  { name: 'MAVZ',           gameId: 'HIT、MAVZ', team: 'C 队' },
  { name: '许子远',          gameId: 'HIT、许子远', avatar: 'images/avatars/av10.jpg', note: 'HIT 最帅之人', team: 'C 队' },
  { name: '小恐龙',          gameId: 'HIT、小恐龙', avatar: 'images/avatars/member-xlk.jpg', team: 'C 队' },
  { name: '小狼嗷',          gameId: 'HIT、小狼嗷', team: 'D 队' },
  { name: 'Austral1s',      gameId: 'HIT、Austral1s', team: 'D 队' },
  { name: '贩梦',            gameId: 'HIT、贩梦', team: 'D 队' },
  { name: '雨暮花落',        gameId: 'HIT、雨暮花落', team: 'D 队' },
  { name: '鸣濑白羽',        gameId: 'HIT、鸣濑白羽', team: 'E 队' },
  { name: '薯条大王',        gameId: 'HIT、薯条大王', team: 'E 队' },
  { name: '玖酒仙儿',        gameId: 'HIT、玖酒仙儿', role: '指挥官', team: 'E 队', captain: true, lead: true },
  { name: '白宇BaiYu',      gameId: 'HIT、白宇BaiYu', team: 'E 队' },
  { name: '小飞鼠II',        gameId: 'HIT、小飞鼠II', team: 'E 队' },
  { name: '巅峰之作',        gameId: 'HIT、巅峰之作', team: 'E 队' },
  { name: '爆米花大王',      gameId: 'HIT爆米花大王' },
  { name: '纯情男大',        gameId: 'HIT、纯情男大' },
  { name: '环庚三烯正离子',  gameId: '环庚三烯正离子', team: 'C 队' },
  { name: '说什么狸猫',      gameId: 'HIT说什么狸猫', team: 'C 队' },
  { name: '春风秋雨行',      gameId: 'HIT春风秋雨行' },
  { name: '玉面手雷王',      gameId: 'HIT玉面手雷王' },
  { name: 'bbbing',         gameId: 'HIT、bbbing', team: 'B 队' },
  { name: '第n个人',         gameId: 'HIT、第n个人' },
  { name: '茉铭',            gameId: 'HIT、茉铭', team: 'D 队', captain: true },

  /* ---- 以下为第二批补充的队员，按所属队伍排 ---- */
  { name: 'RocXOvO',        gameId: 'HIT、RocXOvO',  team: 'A 队' },
  { name: '贝勒',            gameId: 'HIT、贝勒',      team: 'B 队' },
  { name: 'muyasami',       gameId: 'HIT、muyasami', team: 'B 队' },
  { name: 'sanwu82',        gameId: 'HIT、sanwu82',  team: 'C 队' },
  { name: 'error',          gameId: 'HIT、error',    team: 'C 队' },
  { name: 'weita',          gameId: 'HIT、weita',    team: 'D 队' },
  { name: 'ak',             gameId: 'HIT、ak',       team: 'E 队' }
];

/* ---------- 鸣谢 ----------
   建队以来带过我们、帮过我们的人。
   name = 称呼，role = 身份，alt = 想额外显示的一行（游戏 ID / 备注）
   kind: 'staff' 的人点开弹窗时显示「身份」而不是「位置/段位/入队时间」
   quote 可选，会显示在弹窗底部
*/
var THANKS = {
  title: '这支队伍，是从他们开始的。',
  lead: '感谢建队以来带过我们、帮过我们的人。',
  people: [
    {
      kind: 'staff',
      name: '白宇',
      role: '建队之初的队长',
      alt: '',
      quote: '队伍是他攒起来的，第一套战术也是他定的。'
    },
    {
      kind: 'staff',
      name: '大爷',
      role: '主教练',
      alt: '中国近卫',
      quote: '带着我们从野排打到能上全国赛。'
    },
    {
      kind: 'staff',
      name: '子祺',
      role: '顾问',
      alt: '',
      quote: '关键场次的分析和复盘，都是他帮着看的。'
    }
  ]
};

/* ---------- 队伍简介旁边的三张定位卡 ---------- */
var PILLARS = [
  {
    keyword: '固定编制',
    label: '定位 · 协作 · 职责',
    text: '每个位置有人负责，谁打头阵、谁断后、谁补位，赛前就说清楚。'
  },
  {
    keyword: '战术协同',
    label: '规划 · 响应 · 执行',
    text: '步坦协同、多坦协同、穿插进攻，练的是整队的节奏而不是个人的枪法。'
  },
  {
    keyword: '长期成长',
    label: '投入 · 沟通 · 复盘',
    text: '每次训练赛后看录像复盘，把上一局的失误变成下一局的本能。'
  }
];

var QUOTE = '个人能力能赢下一次交火，稳定的团队才能控制整个战局。';

/* ---------- 招新考核标准 ----------
   来源：《HIT三角洲行动校队全面战场考核标准规范》
   intro  = 开头的总则，逐条列
   groups = 大类 → blocks（可选小标题）→ items（岗位 + 要求逐条）
   一个新赛季要改标准，只动这里。
*/
var RECRUIT = {
  intro: [
    '所有兵种分均 > 950（以下标准皆以正常对局长度为准，若时长较短考官会酌情降低要求，具体情况具体考虑。注意：除了临界点和烬区都是大图）',
    '视报名人数分情况考核：人数较多会进行 3-5 场野排考核，人数较少则直接训练赛考核。',
    '以实战为主。'
  ],

  groups: [
    {
      title: '（一）载具类',
      note: '',
      blocks: [
        {
          label: '空中载具',
          items: [
            {
              name: '武直',
              reqs: [
                '需全程盯住敌方是否叫载具。',
                '攀升地图结束阶段敌方剩余载具数量 ≤ 1（断层视情况而定）。',
                '被毒刺或防空导弹命中 ≤ 8。'
              ]
            },
            {
              name: '小鸟',
              reqs: [
                '给步兵复活合理位置。',
                '被毒刺或防空导弹命中 ≤ 8。'
              ]
            },
            {
              name: '固定翼',
              reqs: [
                '风暴眼结束阶段敌方剩余载具 ≤ 1（具体情况视局内而定）。',
                '断层要求敲掉敌方所有空载。',
                '命中毒刺或防空导弹 ≤ 8。'
              ]
            }
          ]
        },
        {
          label: '地面载具',
          items: [
            {
              name: '车长',
              reqs: [
                '岗位定位：地载编队指挥核心。',
                '考核要求：负责路线规划、把控攻防节奏；主动搜寻并摧毁敌方载具；统筹残局与团队推进。',
                '参考标准：均分 ≥ 1050；分钟击败 ≥ 1.5；单局炸毁敌方载具 ≥ 2 台。',
                '考核规则：重点考核大局观、带队能力、载具作战效率。'
              ]
            },
            {
              name: '防空车',
              reqs: [
                '岗位定位：团队专职防空防守岗位。',
                '考核要求：熟练 30 提前量计算；精通雷达制导导弹；熟练走位、藏点、生存拉扯。',
                '参考标准：无击杀要求，考核防空预判、生存时长、空载拦截效率。',
                '考核规则：侧重团队意识，不看击杀数据。'
              ]
            },
            {
              name: '通用地载',
              reqs: [
                '岗位定位：地面主力突击载具。',
                '考核要求：精通除防空车和大运外全部地载；掌握步兵反载具打法；会主动补充 AT4 反坦克装备。',
                '参考标准：乌鲁鲁巡飞弹有足够熟练度（会跟车麦更好）。',
                '考核规则：先看实战发挥，后看数据。'
              ]
            }
          ]
        }
      ]
    },
    {
      title: '（二）步战类',
      note: '步战 kpm 是基础，毕竟 FPS 步兵没枪法可不行。其他方面也有一定要求：要能够根据局势更换英雄，有至少 2-3 个英雄的熟练度。',
      blocks: [
        {
          label: '',
          items: [
            {
              name: '突击',
              reqs: [
                '基本要求：kpm ≥ 2。',
                '小图：击杀 ≥ 45。',
                '大图：击杀 ≥ 60。'
              ]
            },
            {
              name: '医突医疗',
              reqs: [
                '小图：击杀 ≥ 30，救援 ≥ 40。',
                '大图：击杀 ≥ 40，救援 ≥ 50。',
                '补充说明：kpm ≥ 1.8 且救援分均达 1.5。'
              ]
            },
            {
              name: '纯医医疗',
              reqs: [
                '基本要求：救援每分钟 ≥ 2.3。',
                '小图：救援 ≥ 50。',
                '大图：救援 ≥ 70。',
                '补充说明：只峰医。'
              ]
            },
            {
              name: '侦查',
              reqs: [
                '基本要求：kpm ≥ 1.8。',
                '小图：击杀 ≥ 40。',
                '大图：击杀 ≥ 50。',
                '会打狙者更好（打狙时不看分均，只看压制力）。',
                '补充说明：精确报出敌人位置，绕后的信标放置，信息的侦查情况；跟车时在遇到载具对抗能及时下车骇载具，以及对面载具信息汇报（考载具跟车时不考虑击杀）。'
              ]
            }
          ]
        }
      ]
    },
    {
      title: '（三）综合类',
      note: '',
      blocks: [
        {
          label: '',
          items: [
            {
              name: '指挥官',
              reqs: [
                '分均 ≥ 1300，正确地使用高价、高威，及时与载具组沟通，熟练掌握紧增运用，如快速压点回点。',
                '起到团队领头作用，在队员消极游戏时稳定心态。',
                '熟练掌握岸防炮等工程设施运用，作为指挥官积分结算不低于前五。',
                '是否拥有清晰指挥思路，了解基本战术，如步坦协同、多坦协同、穿插进攻等战术。'
              ]
            }
          ]
        }
      ]
    },
    {
      title: '（四）免考类',
      note: '',
      blocks: [
        {
          label: '',
          items: [
            {
              name: '免考条件（当前赛季满足一条即可）',
              reqs: [
                '步兵分均 > 1300。',
                '突击：主页详细数据日中的胜者为王 kpm ≥ 2.5。',
                '载具：kpm ≥ 2.2，分均 ≥ 1200。'
              ]
            }
          ]
        }
      ]
    }
  ]
};

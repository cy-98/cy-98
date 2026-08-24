import type { Note } from '../note'

export const completeAgentic: Note = {
  slug: 'complete-agentic',
  title: '如何尽可能使用 AI 替代日常工作',
  date: '2026-08-01',
  excerpt: '从问答助手到能提 MR、跑测试的团队，日常工作里哪些步骤已经能交给 agent，哪些还必须人来收口。',
  body: [
    {
      type: 'p',
      text: '找到这个问题的答案之前，我先回顾一下在自己的工作里，agent 在不同阶段充当过什么角色。',
    },
    { type: 'h3', text: '助手' },
    {
      type: 'p',
      text: '24 年初 OpenAI 推出 ChatGPT，可以通过问答帮用户。当时团队里特别震惊：机器人竟然可以和人一样，不需要预先编程，对不特定的输入也能给出贴切的回答。不过这时对工作交付帮助有限，只能以答案形式产出代码片段。代码往往和仓库上下文无关，基本不能直接用。',
    },
    { type: 'h3', text: '码农' },
    {
      type: 'p',
      text: '同年 Cursor 和 GitHub Copilot 越来越多进入视野，能够快速补全代码，出现「Tab 工程师」的戏称。之后 Cursor 能把整个工程当作模型输入，去做特定目标的代码编写。agent 开始能基于工程理解来编程。后来又有 custom agent、Plan mode、agent review，把日常工作顺了不少。',
    },
    { type: 'h3', text: '工程师' },
    {
      type: 'p',
      text: 'MCP、Skill、A2A 出现之后，agent 开始进入日常工作：读文档、出设计图和流程图，甚至搜代码和部署。这时它已经能独立完成不少工作，但首先受上下文限制，往往还需要人中途介入。',
    },
    { type: 'h3', text: '团队' },
    {
      type: 'p',
      text: '25 年初公司开始用 Claude Code。和 Cursor 很大的不同是用 Terminal UI 代替代码编辑器。极简的交互、丰富的命令，加上当时很好用的 Sonnet，让很多人很快换掉了手里的 Cursor。Terminal agent 弱化了代码文件的存在感，更多是靠连续对话把任务做完。此后 vibe coding 更流行，社区对 agent orchestration 的讨论也更热。',
    },
    {
      type: 'p',
      text: '一个 terminal session 很快就不够用了，往往要开多个 session，于是 agent 管理和编排工具也越来越多。到 26 年，工具集成已经很丰富：一句 “Hi, could you help finish this task for me?”，agent 几乎可以持续写代码、提 MR、部署测试环境、做端到端验证，然后等人审查和合并。',
    },
    {
      type: 'p',
      text: '从极简问答到完整交付，日常工作可以粗看成：计划 → 编码 ⇄ 测试 → 上线。每一步还要对需求状态做标记。',
    },
    { type: 'h3', text: '计划' },
    {
      type: 'p',
      text: '想法 → 知识搜索 → 写文档 → 反复审查 → 确定计划。想法仍然需要人来产出；搜索、写文档、审查已经可以交给 agent。',
    },
    {
      type: 'ul',
      items: ['想法：人', '知识搜索：可以', '书写文档：可以', '审查：可以'],
    },
    { type: 'h3', text: '编码' },
    {
      type: 'p',
      text: '理解计划 → 理解工程 → 程序设计 → 构建测试 → 编码 → 及时验证。这一段 agent 基本可以走完完整的代码任务。',
    },
    {
      type: 'ul',
      items: [
        '理解计划：可以',
        '理解工程：可以',
        '程序设计：可以',
        '构建测试：可以',
        '编码：可以',
        '及时验证：可以',
      ],
    },
    { type: 'h3', text: '测试' },
    {
      type: 'p',
      text: '部署 → 数据准备 → 验证。测试非常重要，也最需要人盯着。Agent 会出错，上下文会漂移，最终还要有人对结果负责，所以上线前的结果必须人来验收。',
    },
    {
      type: 'ul',
      items: ['部署：可以', '数据准备：可以', '验证：上线前的最终结果需要人'],
    },
    { type: 'h3', text: '上线' },
    {
      type: 'p',
      text: '部署 → 观察 → 报警 → 继续计划。上线时机和决定权在人；观察和报警可以交给 agent。',
    },
    {
      type: 'ul',
      items: ['部署：人来决定时机', '观察：可以', '报警：可以'],
    },
    {
      type: 'p',
      text: '对公司来说，每一步都要给 agent 足够的工具和环境，让它能按特定流程稳定跑完，才谈得上顺利交付。',
    },
    { type: 'h3', text: '一个常见的 Web 团队' },
    {
      type: 'p',
      text: '产品、设计、前端、后端、测试、运维。如果要把团队做成尽可能 agentic，就要在每一步细节里都提供 agent 能用的工具。',
    },
    {
      type: 'ul',
      items: [
        '产品写 PRD、看用户反馈：agent 访问文档库并创建文档（如 Atlassian MCP）',
        '设计出交互稿：agent 感知意图并创建设计稿（如 Figma MCP）',
        '前后端实现界面和接口：agent 访问代码库并提交 MR',
        '测试按 PRD 定范围、保质量：agent 做自动化并访问测试环境（如 Playwright CLI）',
        '运维保测试和生产稳定：agent 观察服务并按规则设置报警',
      ],
    },
    {
      type: 'quote',
      text: '人负责想法、上线决定和最终验收。其余步骤可以工具化；缺的不是模型，是每一步都能稳定执行的环境。',
    },
  ],
}

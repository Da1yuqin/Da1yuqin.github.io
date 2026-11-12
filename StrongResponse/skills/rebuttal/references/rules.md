# Rebuttal · 规则与模板

方括号填写真实材料；模拟反馈供作者内部使用。

<a id="mindset"></a>
## 0. 心态准备

Reveiw虐你千百遍，你也待ta如初恋。


### 别辜负好心审稿人

不是所有人都配拥有好心审稿人。

有的人真的不是我说你：没有满足他的要求，也不给情绪价值，你还不如不re呢，反正都是降分。（恨铁不成钢）

### 情绪给出去了，对自己的要求也要跟上

Rebuttal 的时候心情肯定不会好的，因为你的情绪价值都给出去了。也很容易和团队小伙伴吵架（虽然我没有吵过，因为我情绪稳定）。

但是 rebuttal 期间自我攻击肯定是要拉满的。时刻问：你凭什么不回复/不解释/不做实验/不好好说话……

### 把回复的姿态放低

要用那种贬低自己的姿态去说。

### 先让他愿意看，再让他轻松看懂

审稿的时候去博一个 0.1s 审稿人看到你文字的机会，给它一种稍微瞄了一眼就觉得自己的问题被很好解决了的感觉。

然后仔细阅读发现逻辑流畅而且完全不费力理解的感觉。

### 开头和结尾的感谢，也要认真写

最后他实在不愿意涨分，看到你开头结尾的感谢一开心，才可能涨分。

<a id="prepare"></a>
## 2. 整理问题与证据

先读完整 review，再写回答。不要只盯着 Questions：具体关切也可能出现在 Weaknesses、建议和评分理由里。

- 【铁律】Weaknesses、Questions、建议和评分理由里的具体关切都要回答；保留原意，一句话有多问就拆开。
- 逐题记录：原问题 → 回应类型 → 现有依据及位置 → 缺口。
- 定义不清给定义，流程不清给案例，效果存疑给对照，实际错误就修正。
- 先查正文和补充材料，逐题提取能直接回答问题的原文与数据，并记录出处。
- 优先整理已有实验；确实缺证据时，提出能区分争议解释的最小检验，交作者决定。
- 【铁律】向工具提供材料前，确认当轮保密与 AI 规则允许；不上传密钥、个人数据或无权使用的材料。

<a id="prepare-template-1"></a>
### 问题清单

```markdown
| ID | 原问题 | 需要回答什么 | 已有证据与位置 | 缺口 |
| :--- | :--- | :--- | :--- | :--- |
| Q1.1 | 【审稿原话】 | 【具体结论】 | 【节、表、记录】 | 【仍缺什么；没有则写无】 |
| Q1.2a | 【子问题：定义】 | 【对象与判定方式】 | 【定义所在位置】 | 【歧义在哪里】 |
| Q1.2b | 【子问题：有效性】 | 【必要对照】 | 【已有比较】 | 【不能由现有结果回答的部分】 |
```

这张表供作者整理问题；正式回复按下一节的 Q&A 交付。

<a id="collaboration"></a>
## 3. 合作环节：先把回复思路和实验写清楚

先不管字数，把每一题准备怎么回复、为什么这样回复、还缺什么证据写清楚，方便合作者一起讨论。合作稿按“审稿意见 → 需补充的点 → 分版本的逐题回复”组织；思路和实验安排确认后，再压缩成限字版。

- 每位审稿人单独整理，按原问题顺序编号；一句话有多个问题就拆开。每题保留问题要点、拟回答、回复思路、已有证据和缺口，不能只列标题。
- 回复思路要说明：审稿人担心什么，我们先回答什么，用哪项依据说明，为什么这项依据能回答这个问题。先把话说清楚，再考虑英文表达和篇幅。
- 【铁律】不限字数的 rebuttal 中，正文和补充材料里能直接回答该题的原文、定义、设置和结果，必须全部摘进该题的证据表，并标明节号、表号或行号。按实际相关内容增行，不固定证据条数或来源类型。
- 逐题标明“无需实验 / 需要实验及编号 / 待确认”。需补充的点统一汇总，区分新增实验、重跑、已有结果重分析和文字说明，并填写负责人、截止时间及待确认事项。
- 同一个实验可回应多位审稿人的多道题，沿用同一个实验编号，只计一次。多个设置、模型或随机种子另列运行次数，不当成独立实验重复计数。
- 先给出实验数量与分类，再列明细：本轮确定要做多少项、其中还剩多少项、可选多少项、待确认多少项。未确定写待定，不能按零处理；已有结果复用和仅改文字不计新增实验。
- 合作稿可以保留中文讨论和不同版本；正式回复只保留已核实的回答。拟做实验、预期结果和待改文字分别标明，不能写成已经完成。

### 先一起确定每一题怎么答

先整理完整审稿意见，再逐题写出拟直接回答和推理过程。合作者在同一题下确认依据是否够用、是否需要实验、谁来补充；不要一开始就为了省字省掉解释。

### 把补充任务合并成一份实验清单

把所有标为需要实验的题与实验编号双向对应。每项实验写清要检验什么、固定什么、改变什么、与谁比较、看什么结果，以及什么结果支持或不支持回复。重复需求合并，新增实验、重跑和重分析分别统计。

### 确认思路后再写下一版

保留各题编号，记录本版改了什么、还有哪些问题要合作者决定。已有证据可直接起草；缺证据的题保留真实缺口，等实验和事实确认后再形成可提交的回复。

<a id="collaboration-template-1"></a>
### 合作初稿：不限字数（空白模板）

```markdown
# [合作稿标题]
版本：[版本]　更新：[时间]

## 审稿意见
### Reviewer [编号]
- 原问题编号与要点：[由作者填写]
- 评分、信心与相关讨论：[由作者填写；没有则删去]
[按实际审稿人数和问题数重复]

## 需补充的点
- [任务编号]：[要补充什么，以及为什么需要]
  - 类型：[新增实验 / 重跑 / 重分析 / 文字说明]
  - 回应问题：[Reviewer 编号 + Q 编号，可列多个]
  - 负责人：[姓名]；截止时间：[时间]；状态：[待确认 / 待做 / 进行中 / 已完成]
  - 待合作者决定：[需要决定的具体事项；没有则写无]

## 逐题回复（第 [版本] 版）
### Response to Reviewer [编号]
> **Q[编号]: [问题要点]**

**这题在问什么**：[用普通话说明审稿人的疑虑]

**准备怎么回答**：[先写一句直接回答；尚不能确定时说明需确认什么]

**回复思路**：[先解释什么，再用什么证据，怎样把证据与问题连起来]

**已有依据**：
| 来源 | 原文摘录或实验数据 | 回答哪一问 |
|---|---|---|
| [正文节号／表号／行号] | [逐字原文，或保留单位与条件的数据] | [问题编号] |
| [补充材料节号／表号／行号] | [逐字原文，或保留单位与条件的数据] | [问题编号] |

**还缺什么**：[缺口，以及不补会影响哪一句回答；没有则写无]

**实验需求**：[无需实验 / 需要实验 E[编号] / 待确认]

**拟回复正文**：[先回答问题，接着放上方对应证据表，只补必要解释；未做事项用计划时态]

**合作确认**：[负责人、合作者意见、需要决定的事项]

**本版修改**：[改了什么，以及仍需确认什么]

[同一审稿人的下一题沿用上述格式；其他审稿人另起标题]
```

这里只提供空白结构。按实际人数和问题数增删；合作讨论、负责人和版本记录留在内部，不粘入正式回复。

<a id="collaboration-template-2"></a>
### 实验盘点与分工（空白模板）

```markdown
# 实验盘点

## 数量总览（按去重后的实验编号统计）
- 确定需要新增的实验：[项数]；已完成：[项数]；还需完成：[项数]
- 可选新增实验：[项数]
- 是否需要尚待确认：[项数 / 待定]
- 重跑已有实验：[项数]（单列，不计新增）
- 已有结果重分析：[项数]（单列，不计新增）
- 仅复用结果或修改文字：[任务数]（不计实验）
- 预计实际运行：[次数 / 待定]；估算依据：[设置与重复次数，扣除可复用运行]

## 实验清单
| 实验编号 | 回应哪些问题 | 要验证什么 | 类型与必要性 | 状态与负责人 |
| :--- | :--- | :--- | :--- | :--- |
| E[编号] | [Reviewer + Q，可列多个] | [具体疑虑] | [新增 / 重跑；必做 / 可选 / 待确认] | [状态；负责人；截止时间] |
[按去重后的实验项数增删行]

## 每项实验怎么做
### E[编号]：[实验名称]
- 目的：[这项实验要检验回复中的哪句话]
- 输入与范围：[数据、对象、规模及适用条件]
- 对照：[和什么比较]
- 固定条件：[保持不变的内容]
- 改变条件：[本实验要改变的内容]
- 输出与评价：[得到什么，怎样判断]
- 判断依据：[什么结果支持该回复；什么结果不支持]
- 设置与重复：[设置数、重复次数和可复用部分；未知写待定]
- 交付物：[结果表、分析文字或其他材料]
- 对应问题：[Reviewer + Q，与上表保持一致]
- 实际状态与结果位置：[待做 / 进行中 / 已完成；完成后填真实记录]

## 重分析与文字任务
- [任务编号]：[任务内容]；对应问题：[Q]；负责人：[姓名]；状态：[状态]

## 需要合作者决定
- [待确认事项、影响的问题及决定人]
```

每个“需要实验”的问题都能找到实验编号，每个实验也能回指问题。同一结果换图、换表或被多题引用不加计数；运行次数与实验项数分别报告。

<a id="response-format"></a>
## 4. 逐题回复格式

一题一个答案：结论 → 证据 → 解释 → 位置。对 ICLR 这类当轮允许修改正文的会议，用有颜色的字体标注正文的更改部分，并在回复中说清改了什么、对应节号或行号。非必要不大改，以修复审稿人指出的问题和 typo 为主；具体修订与标色方式遵守当轮规定。

- 【铁律】用最简洁、最直白的话回答对方的具体问题，先给答案，再给必要证据和位置。不用空话、套话，不重复背景和结论，不作无关扩展。不添加任何防御性陈述。
- 【铁律】默认每位审稿人单独交付一个 Markdown 代码块；平台只有统一回复框或要求限字格式时，按平台要求合并正文。
- 【铁律】通用模板和完整示例使用明显的 mock 名称、结果和出处，如 Method A、Metric A、Metric B；不用具体研究内容和数值。Novelty 文风示范可保留作者明确提供的原句与数据。
- 【铁律】完整回复可沿用统一 Q 编号，也可按原审稿章节编号：Weaknesses 用 W1、W2，Questions 用 Q1、Q2，Strengths 用 S1、S2，Suggestions 用 SG1、SG2。仅保留原 review 实际存在且需要回应的章节，首次说明缩写；每位审稿人内分别从 1 编起。
- 【铁律】一个大问题有多问，拆成 Q1.1a、Q1.1b，或 W1a、W1b；标题忠于原意，不遗漏原问题。
- 【铁律】第一句直接回答：是否题先给结论，证据不足就说明不能判断；原因题给原因，流程题给操作，数值题给具体值。
- 【铁律】回答之后给必要设置、证据、解释与表号、节号或行号。通常不先感谢或讲背景；回应 novelty／贡献质疑时，先具体肯定审稿人说对的关键点，再用一句话说核心贡献并给证据表。
- 【铁律】实验数据优先用表格呈现，列出对照、关键条件、数值、单位及必要统计信息；表后只写必要结论，不再用长句重复报数。
- 【铁律】不限字数的 rebuttal 中，正文和补充材料里能直接回答该题的原文、定义、设置和结果，必须全部摘进该题的证据表，并标明节号、表号或行号。按实际相关内容增行，不固定证据条数或来源类型。
- 原文逐字摘抄并加引号，节选标出省略；数据保留原数值、单位和对应条件。转述明确写成转述。
- 【铁律】一个小点一段；问题之间空一行。感谢具体、克制，不重复泛泛致谢；贡献质疑的开头只肯定原 review 中有依据的判断。
- 【铁律】修改给真实位置；只有实际改过稿件，才能写成已修改。
- 【铁律】同一实验跨 Q 引用，首次定义简短名称，后续统一使用；每个 Q 仍要独立读懂。
- 限字前先完成合作稿。按平台实际口径区分英文单词、字符或中文字符，确认是总上限还是每位审稿人上限；为关键问题分配篇幅，填入真实内容后重新计数，以提交框计数为准。

### 不限字数时，把已有证据摘进回复

不限字数的 rebuttal 中，正文和补充材料里能直接回答该题的原文、定义、设置和结果，必须全部摘进该题的证据表，并标明节号、表号或行号。按实际相关内容增行，不固定证据条数或来源类型。 原文逐字摘抄并加引号，节选标出省略；数据保留原数值、单位和对应条件。转述明确写成转述。

### 限字版也先保留表格

每问先给答案，再放最关键的对照表和出处。删除泛泛致谢、重复背景和表中已有的数值；按平台上限压缩。

<a id="response-format-template-1"></a>
### 一位审稿人的完整回复

```markdown
# Response to Reviewer [ID]

> **Q1.1: How does [method] differ from [closest prior work]?**

Method B [operation, input and output]; Method A [corresponding operation, input and output].

| Source | Relevant excerpt |
|---|---|
| [Prior work, Section X] | “[Exact sentence describing its decision or output].” |
| [Our paper, Section Y, lines Z] | “[Exact sentence describing our decision or output].” |

> **Q1.2: Does [component] improve [metric]?**

[Direct answer supported by the comparison].

| Source | Relevant setting excerpt |
|---|---|
| [正文或补充材料节号／行号] | “[与该实验比较直接相关的设置原文]” |

| Configuration | [Metric, unit, direction] | [Samples, runs and reported uncertainty] | Source |
|---|---:|---:|---|
| [Control] | [Verified value] | [Verified counts and uncertainty] | [Table / section] |
| [With component] | [Verified value] | [Verified counts and uncertainty] | [Table / section] |

[One necessary explanation of the observed effect, if needed].
```

把方括号替换为真实材料；出处保留节号、表号或行号。表格直接摘录能回答该题的已有内容；表后不重复报数。 按相关内容增行，保留原报告已有的样本数、运行数与不确定性。

<a id="response-format-template-2"></a>
### 一位审稿人的完整回复：最小示例（统一 Q 编号）

```markdown
# Response to Reviewer A

> **Q1.1: How does Method B differ from Method A?**

Method B selects Action B using Signal B; Method A selects Action A using Signal A.

| Source (mock) | Mock excerpt |
|---|---|
| Mock Main Paper, Section A | “Method A selects Action A using Signal A.” |
| Mock Supplement, Section B | “Method B selects Action B using Signal B.” |

> **Q1.2: Does Method B improve Metric A while reducing Metric B?**

Yes. Method B improves Metric A and reduces Metric B.

| Source (mock) | Mock setting excerpt |
|---|---|
| Mock Main Paper, Section C | “Both methods use Setting A.” |

| Method (Setting A fixed) | Metric A ↑ (mock units) | Metric B ↓ (mock units) | Source (mock) |
|---|---|---|---|
| Method A | Mock low | Mock high | Mock Supplement, Table B |
| Method B | Mock high | Mock low | Mock Supplement, Table B |
```

完整 mock 示例：方法、指标、结果、引文和出处均为 mock。与 W／Q 和限字示例回答相同问题。

<a id="response-format-template-3"></a>
### 按原审稿章节逐题回复（空白模板）

```markdown
# Response to Reviewer [ID]

W = Weaknesses; Q = Questions.

> #### **W1. [第一条 weakness 的要点]**

${\color{green}\mathbf{Response.}}$ [直接回答]。

| Source | Relevant excerpt or result |
|---|---|
| [正文节号／表号／行号] | [逐字原文或含单位、条件的数据] |
| [补充材料节号／表号／行号] | [逐字原文或含单位、条件的数据] |

[必要解释；表格已经说明的内容不再重复。]

> #### **Q1. [第一条 question 的要点]**

${\color{green}\mathbf{Response.}}$ [直接回答]。

| Source | Relevant excerpt or result |
|---|---|
| [正文或补充材料出处] | [回答这道题的原文或数据] |
```

按原 review 的实际章节和问题增删，分别编号。表格摘录该题所需的正文或补充证据；平台不支持颜色时，Response. 用普通加粗。 不限字数时按实际相关证据增行。

<a id="response-format-template-4"></a>
### 按原审稿章节：最小完整示例

```markdown
# Response to Reviewer A

W = Weaknesses; Q = Questions.

> #### **W1. How does Method B differ from Method A?**

${\color{green}\mathbf{Response.}}$ Method B selects Action B using Signal B; Method A selects Action A using Signal A.

| Source (mock) | Mock excerpt |
|---|---|
| Mock Main Paper, Section A | “Method A selects Action A using Signal A.” |
| Mock Supplement, Section B | “Method B selects Action B using Signal B.” |

> #### **Q1. Does Method B improve Metric A while reducing Metric B?**

${\color{green}\mathbf{Response.}}$ Yes. Method B improves Metric A and reduces Metric B.

| Source (mock) | Mock setting excerpt |
|---|---|
| Mock Main Paper, Section C | “Both methods use Setting A.” |

| Method (Setting A fixed) | Metric A ↑ (mock units) | Metric B ↓ (mock units) | Source (mock) |
|---|---|---|---|
| Method A | Mock low | Mock high | Mock Supplement, Table B |
| Method B | Mock high | Mock low | Mock Supplement, Table B |
```

完整 mock 示例。W 与 Q 分别从 1 编号；定义原文和实验结果分别摘入表格。

<a id="response-format-template-5"></a>
### 限字回复：按审稿人分组（空白模板）

```markdown
# Rebuttal

## To [Reviewer ID]

- **[问题编号]：[问题要点]** [直接回答]。

| [关键对照] | [指标、单位、方向] | Source |
|---|---:|---|
| [对照] | [已核实值] | [表号或节号] |
| [我们的方法] | [已核实值] | [表号或节号] |

- **[问题编号]：[问题要点]** [直接回答；必要解释或已完成修改及位置]。
```

按实际人数增添审稿人标题。保留答案和关键证据表；若平台无法容纳表格，再依实际字数限制压缩。计数和分工记录留在内部。 不限字数时按实际相关证据增行。

<a id="response-format-template-6"></a>
### 已有正文与补充材料：摘抄回复（空白模板）

```markdown
> **W1. [问题要点]**

[一句话直接回答]。

| Source | Evidence type | Relevant excerpt or data |
|---|---|---|
| [正文节号／表号／行号] | [定义／设置／结果] | [逐字原文或含单位、条件和统计信息的数据] |
| [补充材料节号／表号／行号] | [定义／设置／结果] | [逐字原文或含单位、条件和统计信息的数据] |

[需要时用一句话解释这些证据与问题的关系]。
```

不限字数时，逐题收录正文与补充材料中全部直接相关内容，按实际证据增行。任一来源均可提供定义、设置或结果。原文加引号，数据保留数值、单位、条件及原报告统计信息。

<a id="response-format-template-7"></a>
### 限字回复：最小完整示例

```markdown
# Rebuttal

## To Reviewer A

- **W1: Method difference.** Method B selects Action B using Signal B; Method A selects Action A using Signal A.

| Source (mock) | Mock excerpt |
|---|---|
| Mock Main Paper, Section A | “Method A selects Action A using Signal A.” |
| Mock Supplement, Section B | “Method B selects Action B using Signal B.” |

- **Q1: Metric improvement.** Method B improves Metric A and reduces Metric B.

| Method (Setting A fixed) | Metric A ↑ (mock units) | Metric B ↓ (mock units) | Source (mock) |
|---|---|---|---|
| Method A | Mock low | Mock high | Mock Supplement, Table B |
| Method B | Mock high | Mock low | Mock Supplement, Table B |
```

完整 mock 示例。保留两道题的直接答案与关键证据表；实际提交前按平台口径计数。

<a id="response-format-example-1"></a>

### 表后解释：需要时才写

教学模板：把方括号换成自己的真实证据。

**English 教学改写**

[If needed: one evidence-supported explanation connecting the comparison to the reviewer’s question].


**高亮与旁批**

1. **[If needed: one evidence-supported explanation connecting the comparison to the reviewer’s question].**：必要解释。只补表格尚未说清的关键推理；没有新增信息就省略整段。

StrongResponse · 原创教学模板

原创教学模板，不是真实审稿回复。

本指南原创内容采用 CC BY 4.0；转载请附作者、原文链接与许可，改写注明改动。

<a id="answer-types"></a>
## 5. 常见问题与回答模板

先看常见的 novelty／贡献质疑，再按问题选择定义、对照、不同意见或证据不足的回答。

- 【铁律】解释性答复：先定义具体对象，再给输入、操作、输出；必要时用一条样例走完整个流程。
- 【铁律】实验数据优先用表格呈现，列出对照、关键条件、数值、单位及必要统计信息；表后只写必要结论，不再用长句重复报数。
- 【铁律】不限字数的 rebuttal 中，正文和补充材料里能直接回答该题的原文、定义、设置和结果，必须全部摘进该题的证据表，并标明节号、表号或行号。按实际相关内容增行，不固定证据条数或来源类型。
- 【铁律】合理不同意见：指出争议前提和证据，只讨论论文；确有错误就修正，不评价审稿人的能力或动机。
- 【铁律】承诺不是证据。阶段性结果写实际范围；没有直接证据就说明缺口、缩小主张，不能把计划写成已完成。
- 【铁律】表格保留影响判断的设置差异和负结果；删列是为了省阅读时间，不能为了改变结论。

### Novelty：先肯定审稿人说对的具体点

学习作者提供的开头：“You correctly identify conditional deployment as a major source of the gain.” 这句话点明对方抓住了哪个关键机制，并明确认可其判断。接着用一句话说明核心贡献，再给收益表。

通用写法是“You correctly identify [specific mechanism] as [its supported role].” 先说清对方哪里说对了，省去泛泛的感谢、恭维和反复辩解。

<a id="answer-types-template-1"></a>
### Novelty／贡献质疑（空白模板）

```markdown
> #### **W1. What does [core contribution] add beyond [simpler alternative]?**

${\color{green}\mathbf{Response.}}$ You correctly identify [specific correct point actually made by the reviewer] as [its supported role]. Our core contribution is [specific addition relative to Method A].

| Method | Relevant mechanism excerpt | [Key condition] | Metric A [unit, direction] | Source |
|---|---|---|---|---|
| Method A | “[Exact mechanism excerpt A]” | [Mock condition] | [Mock value A] | [Section / table] |
| Method B | “[Exact mechanism excerpt B]” | [Mock condition] | [Mock value B] | [Section / table] |

[One specific explanation, if the table needs it].
```

先具体肯定原 review 中有依据的判断，再说核心贡献。方括号填写真实材料，表格给直接对照。 不限字数时按相关内容增行，收录贡献差异、设置与结果。

<a id="answer-types-template-2"></a>
### Novelty 文风示范：作者提供的开头与数据

```markdown
> #### **W1. What does learning deployment conditions contribute?**

${\color{green}\mathbf{Response.}}$ You correctly identify conditional deployment as a major source of the gain. Our core contribution is to learn where a reusable workflow adds value over the same agent's continuation.

| Deployment rule, Table 32 | Intervention (%) | Utility gain over bare (points) |
|---|---:|---:|
| Global mean gate | 100.00 | 3.35 |
| Same candidate, regional mean gate | 76.17 | 7.15 |
| Regional candidates, development-selected mean threshold | 77.21 | 9.58 |
```

作者授权保留的 novelty 文风示范；第一句沿用原文，表格摘自作者提供的 Table 32，1 个效用点为 0.01U。其余通用示例使用 mock。

<a id="answer-types-template-3"></a>
### 5.1 定义与流程

```markdown
> **Q1.2a: What does [term] mean, and how is it used?**

[Term] is [concrete object]. For input [x], [module] performs [operation] and returns [y].

| Source | Relevant excerpt |
|---|---|
| [Section X, lines Y–Z] | “[Exact definition].” |
| [Supplement Section A.X] | “[Exact sentence describing the disputed operation].” |
```

术语先落到对象；举例要解释被问到的环节，不重讲整篇方法。 不限字数时按实际相关证据增行。

<a id="answer-types-template-4"></a>
### 5.2 实验与对照

```markdown
> **Q1.2b: Could [alternative explanation] account for [result]?**

The controlled comparison [supports / partly supports / does not support / leaves unresolved] [the proposed explanation].

| Source | Relevant setting excerpt |
|---|---|
| [正文或补充材料节号／行号] | “[与该实验比较直接相关的设置原文]” |

| Configuration | [Metric, unit, direction] | [Samples, runs and reported uncertainty] | Source |
|---|---:|---|---|
| [Control] | [Verified value] | [Verified counts and uncertainty] | [Table / section] |
| [Test condition] | [Verified value] | [Verified counts and uncertainty] | [Table / section] |

[Specific reason this comparison answers the question, if needed].
```

结论按对照实际能识别的效应填写。把共同设置及原文出处列入表格，保留原报告已有的样本数、运行数和不确定性。

<a id="answer-types-template-5"></a>
### 5.3 有依据的不同意见

```markdown
> **Q2.1: How does [specific concern] affect [claim]?**

[Direct answer about the concern's effect on the claim].

| Source | Relevant excerpt or result |
|---|---|
| [Section / table / lines] | [Exact quoted sentence or verified result that answers the concern] |
```

直接给事实和依据，省去“这不会推翻我们的贡献”等辩解。只回答审稿人提出的具体问题。 不限字数时按实际相关证据增行。

<a id="answer-types-template-6"></a>
### 5.4 未测试的条件

```markdown
> **Q2.2: Does [claim] hold under [untested condition]?**

The effect in [untested condition] is unknown.

[If asked how to test it: Testing it requires a specific comparison.]

| Evaluated condition | Result | Source |
|---|---|---|
| [Tested setting] | [Verified result, unit and uncertainty] | [Table / section] |
```

先如实回答未测条件的结果状态；审稿人询问如何验证时再说明所需比较。已有结果按实测条件列入表格。

<a id="follow-up"></a>
## 7. 追问与 AC letter

追问用 Rebuttal skill 只补新增信息。完成回复后，再用独立的 AC letter skill 总结审稿人的评价、改分与核心回应。

- 【铁律】保留原 Q 编号和问题关系；新子问可续为 Q1.2c，编号仍以平台要求为准。
- 【铁律】先回答追问，再给该题所需的证据表与出处。不限字数时，正文或补充材料中的已有证据也摘进回复。

<a id="follow-up-template-1"></a>
### 7.1 追问回复模板

```markdown
> **Q1.2c: [Follow-up question]**

[Direct answer].

| Source | Relevant excerpt or result |
|---|---|
| [Section / table / lines] | [Exact quotation or verified result answering this follow-up] |
| [If revised: Section X, lines Y–Z] | “[Exact revised wording]” |

[One necessary explanation, if needed].
```

保留原问题关系；不限字数时摘入全部直接相关证据，按实际内容增行。改稿行只在实际修改时保留。表后只补必要解释。

---

Da1yuqin / [StrongResponse](https://da1yuqin.github.io/StrongResponse/)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。转载请保留署名、出处及许可，改写注明改动。

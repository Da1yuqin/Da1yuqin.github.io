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

**已有依据**：[真实材料及位置；尚未核实则标明]

**还缺什么**：[缺口，以及不补会影响哪一句回答；没有则写无]

**实验需求**：[无需实验 / 需要实验 E[编号] / 待确认]

**拟回复正文**：[按“直接回答 → 证据 → 解释 → 位置”写完整；未做事项用计划时态]

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

一题一个答案：结论 → 证据 → 解释 → 位置。首句把问题答了，后面才有必要读。

- 【铁律】默认每位审稿人单独交付一个 Markdown 代码块；平台只有统一回复框或要求限字格式时，按平台要求合并正文。
- 【铁律】完整回复的问题标题使用 > **Q1.1: [问题标题]**。限字版可以用“问题编号 + 简短要点”的列表，仍须与合作稿逐题对应。
- 【铁律】一个大问题有多问，拆成 Q1.1a、Q1.1b，标题忠于原意。
- 【铁律】第一句直接回答：是否题先给结论，证据不足就说明不能判断；原因题给原因，流程题给操作，数值题给具体值。
- 【铁律】回答之后给必要设置、证据、解释与表号、节号或行号；不先感谢，不先讲背景。
- 【铁律】可比较数据用表格，写全条件、单位、指标方向和统计口径；表后解释结论，不逐格复述。
- 【铁律】一个小点一段；问题之间空一行。感谢具体、克制，放在相关解释后或文末，第一句仍先回答问题。
- 【铁律】修改给真实位置；只有实际改过稿件，才能写成已修改。
- 【铁律】同一实验跨 Q 引用，首次定义简短名称，后续统一使用；每个 Q 仍要独立读懂。
- 限字前先完成合作稿。按平台实际口径区分英文单词、字符或中文字符，确认是总上限还是每位审稿人上限；为关键问题分配篇幅，填入真实内容后重新计数，以提交框计数为准。

### 有字数限制时，先保留答案和关键依据

使用下面的限字模板：整体标题 → 可选的简短致谢 → 按审稿人分组 → 逐点回复。每点先直接回答，再保留最关键的依据、必要解释与位置；删重复背景和内部讨论，不能删掉影响结论的条件。致谢可省，每题首句仍先回答。

<a id="response-format-template-1"></a>
### 一位审稿人的完整回复

```markdown
> **Q1.1: How does [method] differ from [closest prior work]?**

The main difference is [specific mechanism or evaluation target]. [Prior work] uses [input or operation] to produce [output], whereas [our method] uses [corresponding input or operation] to produce [corresponding output]. This difference addresses [precise limitation] under [stated scope]. The description and comparison are in Section [X] and Table [Y].

> **Q1.2: Does [component] improve [metric]?**

Under [tested setting], [component] [improves / does not improve] [metric] relative to [control] by [absolute difference and unit]. We hold [necessary conditions] fixed and change only [tested component].

| Configuration | [Metric and direction] | [Sample size or number of runs] |
| :--- | :---: | :---: |
| [Control] | [Verified value] | [Verified count] |
| [With component] | [Verified value] | [Verified count] |

The observed [finding] addresses [the reviewer’s concern] because [explanation of the result], supporting [the corresponding contribution]. The results and protocol are in [table or record] and Section [X].
```

方括号全部换成已核实材料；增删表格列取决于比较需要，不能删掉影响公平性或解释结果的条件。若 Q1.2 同时问定义与效果，拆为 Q1.2a、Q1.2b，分别首句回答。

<a id="response-format-template-2"></a>
### 限字回复：按审稿人分组（空白模板）

```markdown
# Rebuttal

[可选：一句简短致谢；篇幅紧张时删除]

## To [Reviewer ID]

- **[问题编号]：[问题要点]** [直接回答]。[最关键的已核实依据与必要条件]。[这项依据为何回答疑虑，以及简短位置]。
- **[问题编号]：[问题要点]** [直接回答]。[必要解释或已完成修改及位置]。

## To [Reviewer ID]

- **[问题编号]：[问题要点]** [直接回答]。[最关键的已核实依据与必要条件]。[解释与简短位置]。
```

按实际审稿人数和问题数增删，问题编号沿用合作稿；不固定每题句数。内部另记【上限】【计数单位】【总限额或分审稿人限额】【各题预算】【填入后实际计数】，这些信息不放入提交正文。没有对应结果时如实写已有依据和当前缺口。

<a id="response-format-example-1"></a>

### 一段回复怎样读

教学模板：把方括号换成自己的真实证据。

**English 教学改写**

Under [tested setting], [component] improves [metric] relative to [control] by [absolute difference and unit]. We hold [confounding factors] fixed and compare [configurations] on [same test set]. The observed [finding] addresses [the reviewer’s concern] because [explanation of the result], supporting [the corresponding contribution]. The protocol and results are in Section [X] and Table [Y].


**高亮与旁批**

1. **Under [tested setting], [component] improves [metric] relative to [control] by [absolute difference and unit].**：【铁律】先答问题。首句给答案：条件、比较对象、指标与差异都在。仅在相应结果支持时使用。
2. **We hold [confounding factors] fixed and compare [configurations] on [same test set].**：【铁律】交代对照。交代怎样得到答案；对照要对应审稿人的质疑。
3. **The observed [finding] addresses [the reviewer’s concern] because [explanation of the result], supporting [the corresponding contribution].**：分析实验。实验后解释现象，回应审稿人的疑虑，并落到论文的创新点和贡献。
4. **The protocol and results are in Section [X] and Table [Y].**：【铁律】给出位置。给位置，便于核查。

StrongResponse · 原创教学模板

原创教学模板，不是真实审稿回复。

本指南原创内容采用 CC BY 4.0；转载请附作者、原文链接与许可，改写注明改动。

<a id="answer-types"></a>
## 5. 四类回答模板

按问题选证据，不强行把每个问题都变成补实验。澄清用定义和流程，效果用比较，机制用能区分解释的检验。

- 【铁律】解释性答复：先定义具体对象，再给输入、操作、输出；必要时用一条样例走完整个流程。
- 【铁律】实证答复：报告真实绝对值、比较对象、指标方向与必要条件。平均值涉及波动时给相应不确定性。
- 【铁律】合理不同意见：指出争议前提和证据，只讨论论文；确有错误就修正，不评价审稿人的能力或动机。
- 【铁律】承诺不是证据。阶段性结果写实际范围；没有直接证据就说明缺口、缩小主张，不能把计划写成已完成。
- 【铁律】表格保留影响判断的设置差异和负结果；删列是为了省阅读时间，不能为了改变结论。

<a id="answer-types-template-1"></a>
### 5.1 定义与流程

```markdown
> **Q1.2a: What does [term] mean, and how is it used?**

[Term] denotes [concrete object and decision rule]. For input [x], [module] performs [operation] and returns [y] to [next module]. This interface is specified in Section [X]; [example or algorithm] shows [the disputed step].
```

术语先落到对象；举例要解释被问到的环节，不重讲整篇方法。

<a id="answer-types-template-2"></a>
### 5.2 实验与对照

```markdown
> **Q1.2b: Could [alternative explanation] account for [result]?**

Under [matched setting], the result [persists / does not persist] when [confounding factor] is controlled. We compare [A] and [B] with identical [necessary conditions]; [metric] is [verified A] versus [verified B] ([direction]; Table [R]). This comparison [supports / does not support] [bounded conclusion]. [Remaining uncertainty] is not resolved by this test.
```

对照必须能检验替代解释；同一批数据换个表头，不等于排除了混淆。

<a id="answer-types-template-3"></a>
### 5.3 有依据的不同意见

```markdown
> **Q2.1: Does [specific concern] invalidate [claim]?**

[Specific concern] does not invalidate [bounded claim] under [stated setting], because [verified fact]. The concern assumes [premise], whereas [paper location or verified record] specifies [relevant fact]. This supports [limited conclusion]. We agree that [valid part of the concern], and [verified clarification or correction, if applicable] is documented in [location].
```

只有证据支持时才使用“不推翻主张”的首句；依据不够就说明不能判断。不同意见也要承认成立的部分。

<a id="answer-types-template-4"></a>
### 5.4 目前不能回答

```markdown
> **Q2.2: Does [claim] hold under [untested condition]?**

We do not have direct evidence for [claim] under [untested condition]. The available result in [location] covers [tested scope] only. We therefore limit our conclusion to [supported claim]. Establishing [broader claim] would require [specific comparison or measurement].
```

没有依据就把边界写清楚；只有稿件确已修订时，才能追加具体修改与位置。

<a id="follow-up"></a>
## 7. 追问与 AC letter

追问用 Rebuttal skill 只补新增信息。完成回复后，再用独立的 AC letter skill 总结审稿人的评价、改分与核心回应。

- 【铁律】保留原 Q 编号和问题关系；新子问可续为 Q1.2c，编号仍以平台要求为准。
- 【铁律】先回答追问，再定位新增证据；已经讲清的背景用位置引用。

<a id="follow-up-template-1"></a>
### 7.1 追问回复模板

```markdown
> **Q1.2c: [Faithful title of the follow-up question]**

[Direct answer to the new question, with the necessary scope].

**New evidence**: Compared with Q1.2, we now provide [verified result or clarification]. Under [necessary setting], [comparison or reasoning] shows [specific finding] ([table / section / lines]). This supports [bounded conclusion] because [link between the evidence and the question].

**Revision**: Section [X], lines [Y–Z], now states: “[Exact wording of the completed revision].”

**Remaining issue**: The evidence covers [tested scope]; it does not establish [unresolved claim]. [Specific evidence still needed, if any].
```

保留原 Q 编号，追问新子项续编。填真实证据与位置；无新结果就给已有依据和明确边界。未改稿删 Revision，没有剩余疑问删 Remaining issue；可比较数据改用紧凑表格。

---

Da1yuqin / [StrongResponse](https://da1yuqin.github.io/StrongResponse/)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。转载请保留署名、出处及许可，改写注明改动。

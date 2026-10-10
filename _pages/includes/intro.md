目前我是清华大学的博2学生（预计28年毕业，三年毕业）。截至 2026.10，我累计参与 **17 篇一作/共一论文工作**，其中 **10 篇已被国际会议/期刊接收**，其余 7 篇为预印本或在投工作；另参与 **2 篇技术报告**。

我拥有 **5 家大厂的实习经历**（小红书、字节跳动、快手、美团、蚂蚁集团），入选 **3 个人才计划**（小红书 Red star、快手 K-Star、美团北斗）。此前申博阶段，我曾在 **上海 AI Lab、NJU、清华 SIGS** 开展 3 段科研实习或科研助理（RA）工作，并与光明实验室开展论文合作。

2025年3月，我正式进入 LLM 领域，并很快在工业界发表了多篇论文、展开了有效实践，具备较快的学习加速度。我的跨领域研究经历使我形成了从多模态生成到智能体推理的连续研究视角。此外，我曾在北京、上海、杭州、深圳、苏州、南京等多个城市生活工作，对每座城市都有深刻的体验与感受。


 我的研究经历涵盖工业界实习与高校、科研机构合作，研究方向包括智能体推理、检索增强生成、数字人动作生成、三维渲染、脑机接口等。

__我的研究方向包括但不限于__:

**🤖 LLM 方向**
 - 🔍 Agentic RAG & 多跳推理（蚂蚁 + 美团实习产出）
 - 🎯 LLM 推理与 RL 训练: WebFilter (AAAI26), EviNote-RAG, DAGENT, Rehearsal-RL, OneReason Tech Report
 - 🛒 LLM4RAG（快手实习产出）
 - 📊 对话 Agent 评测 (SAGE Benchmark): 美团实习产出
 - 🛍️ 多轮购物推荐 Agent 评测 (ShopRecBench): 小红书实习工作

<details>
<summary><strong>👁️ CV 方向（点击展开）</strong></summary>
<div markdown="1">

 - 🕺 数字人动作生成 (Motion Generation): ICASSP24，AAAI25 👑Oral，IJCV25
 - 🎨 三维渲染 (3D Rendering): ICASSP24 👑Oral
 - 🧠 脑机接口交叉研究 (AI4Neuro): ICML25

</div>
</details>


我做过很多有意思的方向，学习能力很快，最后我发现学的东西实在太杂了，机缘巧合拿我当时在做的群舞模型做了一个这样的 vcr：

{% include site-image.html src='/images/30001-0150.gif' alt='群舞动作生成演示' defer=true observe=true style='max-width:100%;height:auto;' %}


如果您看到了这个网页，只能说明一件事：我正在找工作（Waiting to be hired 😭！）。毕竟我是一个非常有边界感的人🥺，宣传自己只能是生活所迫了，我的联系方式： daiyq25 [at] mails.tsinghua.edu.cn

<span class='anchor' id='-gzsx'></span>


<span class="anchor" id="-internship"></span>

# 👨‍👩‍👧‍👦 Internship {#internship}

<details open>
<summary style="font-size:1.1em; font-weight:bold; cursor:pointer; padding:8px 0;">
🏢 企业实习 (Industry)
</summary>
<div markdown="1">

<div class='paper-box internship-box'><div class='paper-box-image'><div>{% include site-image.html src='/images/logo_xiaohongshu.png' alt='小红书' defer=true observe=true sizes='200px' %}</div></div>
<div class='paper-box-text' markdown="1">
**小红书 Xiaohongshu · 电商搜索部门** &nbsp; *2026.08 - 至今*

<strong>🏅 Red star 人才计划 · 购物推荐 Agent 评测</strong>

📊 工作: **ShopRecBench 多轮购物推荐评测基准**

- 围绕真实购物需求构建 ShopRecBench，将多轮对话与商品网页证据配对，覆盖复杂约束、需求变化与信息不明确等场景；当前基准包含 17 个零售领域的 169 个案例和 1,325 条逐项评价标准。
- 设计面向具体案例的评价标准（rubrics），分别评估基础能力、额外决策帮助与安全性，检查当前需求、事实依据和推荐方案的可行性，允许有证据支持的不同推荐答案。
- 构建数据标注与结果审核网页，串联推荐生成、模型逐项判分和人工复核；对 10 个商业 API 与开源模型开展评测，分析无依据的商品描述、缺乏支持的适用性推断，以及过早替用户确定尚不明确的需求等共性问题。
</div>
</div>

<div class='paper-box internship-box'><div class='paper-box-image'><div>{% include site-image.html src='/images/logo_bytedance.png' alt='字节跳动 ByteDance' defer=true observe=true sizes='200px' %}</div></div>
<div class='paper-box-text' markdown="1">
**字节跳动 ByteDance · 国际电商部门** &nbsp; *2026.06 - 2026.08*

<strong>🤝 校企合作项目 · 新加坡</strong>

📍 期间在新加坡开展为期一个月的线下实习

- 围绕购物任务中智能体自动化工作流的优化开展研究与实践，以 ShoppingComp 为评测基准，依据任务执行结果与评测反馈迭代工作流策略。
- 构建基于 harness 自进化的自动化优化流程，将任务执行、效果评测与反馈驱动的策略改进串联，支持候选工作流的持续迭代与对比评估。
</div>
</div>

<div class='paper-box internship-box'><div class='paper-box-image'><div>{% include site-image.html src='/images/logo_kuaishou.png' alt='快手' defer=true observe=true sizes='200px' %}</div></div>
<div class='paper-box-text' markdown="1">
**快手 Kuaishou · 核心推荐部门 / 基模算法部门** &nbsp; *2026.03 - 2026.06*

<strong>🏅 K-Star 人才计划</strong>

📄 产出: OneReason 技术报告已公开

💼 参与快手推荐推理基座模型全流程开发：经历多轮 RFT、GRPO、OPSD 等策略与多阶段训练迭代，按日迭代训练与评测，使用千卡级集群协同推进；**主导核心 CoT 蒸馏方向**，系统定位 think &lt; non-think 性能瓶颈，设计并验证 CoT 构建方案，最终方案被论文正式采用；后续进一步研发改进版 CoT，经多轮验证性能较当时内部版本提升约 80%，不到一个月取得行业领先结果
</div>
</div>

<div class='paper-box internship-box'><div class='paper-box-image'><div>{% include site-image.html src='/images/logo_meituan.png' alt='美团' defer=true observe=true sizes='200px' %}</div></div>
<div class='paper-box-text' markdown="1">
**美团 Meituan · 对话智能体方向** &nbsp; *2025.08 - 2026.02*

<strong>🏅 北斗人才计划</strong>

📄 产出: ACL 2026\*1, EMNLP 2026\*1, ICML 2026\*1, NeurIPS 2026\*1

💼 主导 Agentic RAG 与服务对话 Agent 研究：提出 SEAD 自进化 Agent 框架（ACL26）、SAGE 服务对话评测基准
</div>
</div>

<div class='paper-box internship-box'><div class='paper-box-image'><div>{% include site-image.html src='/images/logo_antgroup.png' alt='蚂蚁集团' defer=true observe=true sizes='200px' %}</div></div>
<div class='paper-box-text' markdown="1">
**蚂蚁集团 Ant Group · 研究型实习生** &nbsp; *2025.03 - 2025.08*

<strong>🏅 研究型实习（杭州）</strong>

📄 产出: AAAI 2026\*1, EMNLP 2026\*1, DAGENT / Rehearsal-RL 等多跳推理工作流工作

✨ 亮点: 参与的技术报告 Atom-Searcher 已公开，GitHub 获得 300+ Stars

💼 RAG + RL 方向研究：提出 WebFilter 知识过滤框架（AAAI26）、EviNote-RAG 证据笔记增强方法
</div>
</div>

</div>
</details>

<details>
<summary style="font-size:1.1em; font-weight:bold; cursor:pointer; padding:8px 0;">
🔬 科研实习 (Research)
</summary>
<div markdown="1">

<div class='paper-box internship-box'><div class='paper-box-image'><div>{% include site-image.html src='/images/logo_shailab.png' alt='上海AI Lab' defer=true observe=true sizes='200px' %}</div></div>
<div class='paper-box-text' markdown="1">
**上海人工智能实验室 Shanghai AI Lab · 浦江实验室** &nbsp; *2024.09 - 2025.03*

📍 上海 · 实习生 (Intern)

💡 产出: ICML 2025 \*1
</div>
</div>

<div class='paper-box internship-box'><div class='paper-box-image'><div>{% include site-image.html src='/images/logo_guangming.png' alt='光明实验室' defer=true observe=true sizes='200px' %}</div></div>
<div class='paper-box-text' markdown="1">
**光明实验室 Guangming Laboratory** &nbsp; *2024.06 - 2024.09*

📍 深圳 · 论文合作者

💡 产出: TPAMI 2025 \*1
</div>
</div>

<div class='paper-box internship-box'><div class='paper-box-image'><div>{% include site-image.html src='/images/logo_nju.png' alt='南京大学' defer=true observe=true sizes='200px' %}</div></div>
<div class='paper-box-text' markdown="1">
**南京大学 NJU · 苏州校区** &nbsp; *2024.05 - 2024.08*

📍 江苏苏州 · 科研助理 (RA)

💡 产出: AAAI 2025 👑Oral \*1
</div>
</div>

<div class='paper-box internship-box'><div class='paper-box-image'><div>{% include site-image.html src='/images/logo_thugsz.png' alt='清华深研院' defer=true observe=true sizes='200px' %}</div></div>
<div class='paper-box-text' markdown="1">
**清华大学深圳国际研究生院 SIGS** &nbsp; *2023.04 - 2024.03*

📍 深圳 · 科研助理 (RA)

💡 产出: ICASSP 2024 👑Oral \*1, ICASSP 2024 \*1
</div>
</div>

</div>
</details>

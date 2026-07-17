const translations = {
  en: {
    "nav.research": "Research",
    "nav.demos": "Demos",
    "nav.publications": "Publications",
    "nav.openSource": "Open source",
    "nav.journey": "Journey",
    "nav.contact": "Contact",
    "hero.kicker": "AI researcher · 3D human motion",
    "hero.statement": "I build generative models that understand, create, and precisely control how humans move.",
    "hero.current": "Currently",
    "hero.role": "Researcher at Tencent Hunyuan",
    "hero.educationLabel": "Education",
    "hero.education": "Ph.D. candidate at Zhejiang University",
    "hero.caption": "MotionHub · text to motion",
    "research.eyebrow": "Research direction",
    "research.title": "Making motion a first-class language for AI.",
    "research.body": "My work connects structured motion representations, multimodal foundation models, and precise control. I am interested in general motion intelligence that can understand intent, reason over body structure, and produce animation-ready movement.",
    "news.title": "Recent",
    "news.prism": "Released PRISM for streaming and controllable motion generation.",
    "news.versatile": "VersatileMotion accepted to ECCV 2026.",
    "news.synclip": "Released the SyncLipMAE arXiv preprint.",
    "selected.eyebrow": "Selected work",
    "selected.title": "Recent research",
    "selected.subtitle": "Structured representations and unified systems for generating, understanding, and controlling human motion.",
    "selected.prismLead": "Streaming human motion generation with per-joint latent decomposition.",
    "selected.prismBody": "A joint-factorized latent space and noise-free condition injection unify text-to-motion, pose conditioning, and stable long-horizon generation.",
    "selected.versatileLead": "A unified framework for motion synthesis and comprehension.",
    "selected.versatileBody": "Motion becomes a message that language models can read and write across single-person, multi-person, generation, and understanding tasks.",
    "common.firstAuthor": "First author",
    "common.present": "Present",
    "demos.eyebrow": "Watch the research",
    "demos.title": "Research demos",
    "demos.subtitle": "A few methods are easier to understand in motion.",
    "demos.prism": "Streaming motion generation",
    "demos.synclip": "Audio-visual representation learning",
    "demos.enchant": "Music-driven dance generation",
    "demos.mcm": "Multi-condition motion synthesis",
    "publications.eyebrow": "Academic record",
    "publications.title": "Publications",
    "publications.all": "All",
    "publications.motion": "Motion",
    "publications.multimodal": "Multimodal",
    "publications.viewAll": "Complete record on Google Scholar",
    "openSource.eyebrow": "Build in public",
    "openSource.title": "Open-source systems",
    "openSource.body": "Reusable infrastructure for motion research and large-scale model training.",
    "openSource.motius": "A modular framework for human-motion training, evaluation, inference, representation conversion, and reproducible leaderboards.",
    "openSource.hftrainer": "Config-driven training for Hugging Face-native models with Accelerate, Transformers, Diffusers, and PEFT integration.",
    "openSource.motionHub": "A curated human-motion collection spanning text, music, speech, and two-person interaction.",
    "journey.eyebrow": "Experience & education",
    "journey.title": "Journey",
    "journey.tencentRole": "Algorithm Researcher, Qingyun Program",
    "journey.tencentOrg": "Tencent · Hunyuan Lab · 3D Generation Center",
    "journey.tencentDesc": "Leading HYMotion M2M for unified motion repair, in-betweening, and precise control.",
    "journey.bytedanceRole": "Algorithm Research Intern",
    "journey.bytedanceDesc": "Talking-face generation, lip sync, and multi-view texture generation.",
    "journey.zjlabRole": "Algorithm Research Intern",
    "journey.zjlabOrg": "Zhejiang Lab",
    "journey.zjlabDesc": "Led large-scale Text2Video model research with diffusion architectures.",
    "journey.phd": "Ph.D. in Computer Science",
    "journey.zju": "Zhejiang University · State Key Lab of CAD&CG",
    "journey.phdDesc": "Researching generative models for 3D human motion and multimodal intelligence.",
    "journey.master": "M.Eng. in Software Engineering",
    "journey.zjuSoftware": "Zhejiang University",
    "journey.bachelor": "B.Eng. in Software Engineering",
    "journey.zjsu": "Zhejiang Gongshang University",
    "contact.eyebrow": "Let’s connect",
    "contact.title": "Research moves forward through good conversations.",
    "contact.body": "I am always glad to discuss human motion, multimodal generation, and open research collaboration.",
    "footer.note": "Research, code, and motion in one place."
  },
  zh: {
    "nav.research": "研究",
    "nav.demos": "演示",
    "nav.publications": "论文",
    "nav.openSource": "开源",
    "nav.journey": "经历",
    "nav.contact": "联系",
    "hero.kicker": "AI 算法研究员 · 3D 人体动作",
    "hero.statement": "我研究能够理解、生成并精准控制人体运动的生成模型。",
    "hero.current": "目前",
    "hero.role": "腾讯混元实验室算法研究员",
    "hero.educationLabel": "教育经历",
    "hero.education": "浙江大学计算机博士生",
    "hero.caption": "MotionHub · 文本生成动作",
    "research.eyebrow": "研究方向",
    "research.title": "让动作成为 AI 的第一类语言。",
    "research.body": "我的研究连接结构化动作表征、多模态基础模型与精准控制，关注能够理解意图、推理身体结构，并生成动画级运动的通用动作智能。",
    "news.title": "近期动态",
    "news.prism": "发布流式可控动作生成模型 PRISM。",
    "news.versatile": "VersatileMotion 被 ECCV 2026 接收。",
    "news.synclip": "发布 SyncLipMAE arXiv 预印本。",
    "selected.eyebrow": "代表工作",
    "selected.title": "近期研究",
    "selected.subtitle": "面向人体动作生成、理解与控制的结构化表征和统一系统。",
    "selected.prismLead": "基于逐关节隐空间分解的流式人体动作生成。",
    "selected.prismBody": "逐关节隐空间与无噪声条件注入，让单一模型统一文本生成动作、姿态条件控制与稳定长序列生成。",
    "selected.versatileLead": "统一动作生成与理解的基础模型框架。",
    "selected.versatileBody": "将动作表示成语言模型可读写的 Motion Message，统一处理单人、多人、生成与理解任务。",
    "common.firstAuthor": "第一作者",
    "common.present": "至今",
    "demos.eyebrow": "动态展示",
    "demos.title": "研究演示",
    "demos.subtitle": "有些方法，动起来才更容易理解。",
    "demos.prism": "流式人体动作生成",
    "demos.synclip": "音视频表征学习",
    "demos.enchant": "音乐驱动舞蹈生成",
    "demos.mcm": "多条件动作合成",
    "publications.eyebrow": "学术档案",
    "publications.title": "论文",
    "publications.all": "全部",
    "publications.motion": "动作",
    "publications.multimodal": "多模态",
    "publications.viewAll": "在 Google Scholar 查看完整记录",
    "openSource.eyebrow": "开放研究",
    "openSource.title": "开源系统",
    "openSource.body": "面向动作研究和大模型训练的可复用基础设施。",
    "openSource.motius": "模块化人体动作训练、评测与推理框架，覆盖动作表征转换、模型库和可复现排行榜。",
    "openSource.hftrainer": "基于 Accelerate 的配置驱动训练框架，原生集成 Transformers、Diffusers 与 PEFT。",
    "openSource.motionHub": "覆盖文本、音乐、语音和双人交互的高质量统一人体动作数据集。",
    "journey.eyebrow": "工作与教育经历",
    "journey.title": "经历",
    "journey.tencentRole": "算法研究员 · 青云计划",
    "journey.tencentOrg": "腾讯 · 混元实验室 · 3D 生成中心",
    "journey.tencentDesc": "主导 HYMotion M2M，统一动作修复、补间与精准控制。",
    "journey.bytedanceRole": "算法研究员实习生",
    "journey.bytedanceDesc": "研究 Talking Face 生成、Lip Sync 与 3D 多视角贴图生成。",
    "journey.zjlabRole": "算法研究员实习生",
    "journey.zjlabOrg": "之江实验室",
    "journey.zjlabDesc": "主导基于扩散架构的大型 Text2Video 模型研究。",
    "journey.phd": "计算机科学与技术博士",
    "journey.zju": "浙江大学 · CAD&CG 国家重点实验室",
    "journey.phdDesc": "研究 3D 人体动作生成与多模态智能。",
    "journey.master": "软件工程硕士",
    "journey.zjuSoftware": "浙江大学",
    "journey.bachelor": "软件工程学士",
    "journey.zjsu": "浙江工商大学",
    "contact.eyebrow": "保持联系",
    "contact.title": "好的交流，会让研究继续向前。",
    "contact.body": "欢迎交流人体动作、多模态生成，以及开放研究合作。",
    "footer.note": "在一个页面里放下研究、代码与运动。"
  }
};

const root = document.documentElement;
const header = document.querySelector(".site-header");
const languageButton = document.querySelector(".language-toggle");
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

const storedLanguage = localStorage.getItem("language");
const storedTheme = localStorage.getItem("theme");
let language = storedLanguage === "zh" ? "zh" : "en";

function updateIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  root.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = translations[language][element.dataset.i18n];
    if (value) element.textContent = value;
  });
  languageButton.querySelector("span").textContent = language === "en" ? "中" : "EN";
  languageButton.setAttribute("aria-label", language === "en" ? "Switch to Chinese" : "切换到英文");
  localStorage.setItem("language", language);
}

function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.innerHTML = `<i data-lucide="${theme === "dark" ? "sun" : "moon"}" aria-hidden="true"></i>`;
  themeButton.setAttribute("aria-label", theme === "dark" ? "Use light theme" : "Use dark theme");
  document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "dark" ? "#111411" : "#f5f5f0");
  localStorage.setItem("theme", theme);
  updateIcons();
}

function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
  updateIcons();
}

function toggleMenu() {
  const willOpen = mobileNav.hidden;
  mobileNav.hidden = !willOpen;
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.innerHTML = `<i data-lucide="${willOpen ? "x" : "menu"}" aria-hidden="true"></i>`;
  header.classList.toggle("menu-active", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
  updateIcons();
}

languageButton.addEventListener("click", () => setLanguage(language === "en" ? "zh" : "en"));
themeButton.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));
menuButton.addEventListener("click", toggleMenu);
mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".publication-row").forEach((row) => {
      row.hidden = filter !== "all" && !row.dataset.category.split(" ").includes(filter);
    });
  });
});

document.querySelectorAll(".video-launch").forEach((button) => {
  button.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${button.dataset.videoId}?autoplay=1&rel=0`;
    iframe.title = "PRISM research demo";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    button.replaceWith(iframe);
  });
});

window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 24), { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 1040 && !mobileNav.hidden) closeMenu();
});

document.getElementById("year").textContent = new Date().getFullYear();

const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
setLanguage(language);
setTheme(storedTheme === "dark" || storedTheme === "light" ? storedTheme : preferredTheme);
updateIcons();

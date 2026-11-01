/**
 * SEO body copy for the 17 course pages.
 * Topic titles must match catalog modules. Tools/projects come from the catalog.
 */
export const COURSE_PAGE_COPY = {
  "python-programming": {
    introHeading: "Python Programming Training covering Python Basics, OOP and APIs",
    intro:
      "This Python Programming Course is beginner Python Programming Training at Knock Your Knowledge. It is a Python Course for Beginners: 40 hours, five topics, and 20 videos covering Python Basics, Functions & Modules, OOP Concepts, File I/O & APIs, and a Capstone Project. The published course fee is ₹299/- plus 18% GST at checkout. You Learn Python as a language — Python Fundamentals and Python Coding with variables, loops, functions, classes, files, and APIs. This is not Data Science (Pandas, NumPy, ML), not MERN Stack Development (MongoDB, Express, React, Node.js), and not Python for Analytics on the Business Analytics track.",
    whyLearn:
      "Python is the common language behind automation, data work, and many web backends. This Python Programming Training teaches the language itself — not a shortcut around it — so you can read error messages, reuse functions, and ship a small Capstone Project you can explain. It is a language course, not an internship programme.",
    whoFor: [
      "Beginners who want a structured path through Python Basics before tackling data or web work",
      "Students who need OOP Concepts, files, and APIs for college projects or personal scripts",
      "Career switchers who want to practise Python before the Data Science or MERN courses in this track",
    ],
    topicDetails: {
      "Python Basics":
        "Python Basics is the first topic in this Python Course for Beginners. Cover variables, data types, operators, loops, and conditionals so you can write small programs and understand how Python executes line by line. This is Python Fundamentals, not a data-science library tour.",
      "Functions & Modules":
        "Functions & Modules is the second topic. Break work into reusable functions, import modules, and organise scripts so Python Coding stays readable as it grows.",
      "OOP Concepts":
        "OOP Concepts is the third topic. Use classes, objects, and core OOP ideas to model real things in code — the same pattern used in larger Python applications. The catalog tags OOP; it does not name Django or Flask.",
      "File I/O & APIs":
        "File I/O & APIs is the fourth topic. Read and write files, then call APIs so your programs can work with real data instead of only in-memory examples.",
      "Capstone Project":
        "Capstone Project is the fifth topic. Apply Python Basics, functions, OOP Concepts, files, and APIs in one capstone so you practise connecting the topics rather than leaving them as isolated drills.",
    },
    outcomes: [
      "Write Python scripts using variables, loops, and conditionals after this Python Programming Course",
      "Organise code with Functions & Modules instead of one long file",
      "Use OOP Concepts — classes and objects — for simple real-world models",
      "Load data with File I/O & APIs in a beginner project",
      "Finish a Capstone Project that combines the five course topics",
    ],
    faqs: [
      {
        q: "Is this Python course suitable for beginners?",
        a: "Yes. The catalog lists it as Beginner level and starts with Python Basics before functions, OOP, files, APIs, and the capstone.",
      },
      {
        q: "How long is the Python Programming course?",
        a: "The course duration listed on KYK is 40 hrs.",
      },
      {
        q: "What will I actually practise?",
        a: "The five topics are Python Basics, Functions & Modules, OOP Concepts, File I/O & APIs, and a Capstone Project. The course page also lists Python, OOP, and Automation as tags.",
      },
      {
        q: "Does this include Data Science or MERN?",
        a: "No. Those are separate KYK courses. Python Programming focuses on the language. You can add Data Science or MERN later, or take the Development bundle that includes all three.",
      },
      {
        q: "Are there course videos?",
        a: "KYK lists five topics and twenty videos for this course. Enrol to unlock playback on the course videos page.",
      },
    ],
    trackLinks: [
      { text: "Wrangling, EDA, and ML sit on " },
      { to: "/Blog/data-science", text: "Data Science" },
      { text: ". Full-stack web with MongoDB, Express, React, and Node.js is " },
      { to: "/Blog/mern-stack-development", text: "MERN Stack Development" },
      { text: ". Cleaning, visualisation, and reporting sit on the analytics track (" },
      { to: "/Blog/python-for-analytics", text: "Python for Analytics" },
      { text: "). Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/development", text: "Development Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["data-science", "mern-stack-development", "python-for-analytics"],
  },
  "data-science": {
    introHeading: "Data Science Training covering Data Wrangling, EDA and ML Models",
    intro:
      "This Data Science Course is Intermediate Data Science Training at Knock Your Knowledge. Data science here is Python for Data Science: you take tables through Data Wrangling, Exploratory Data Analysis (EDA), Machine Learning with ML Models, Feature Engineering, and a simple Deployment step. You Learn Data Science as Data Science Fundamentals — Data Analysis and Data Visualization with Python, Pandas, NumPy, and Matplotlib, then Scikit-learn for models. The catalog lists 55 hours, five topics, and 20 videos. The published course fee is ₹299/- plus 18% GST at checkout. This is Intermediate, not a beginner language course: you should already be comfortable with basic Python. It is a Development-track retail course, not an internship. Python Programming teaches the language itself. Python for Analytics sits on the Business Analytics track (cleaning, visualisation, reporting). MERN Stack Development is a separate full-stack web course.",
    whyLearn:
      "Raw datasets are messy, and models only help if you can clean, explore, and ship them. This Data Science Course connects Data Wrangling, EDA, ML Models, Feature Engineering, and Deployment in one path so you are not stuck with a notebook that never leaves your laptop. It is Data Science Training on the Development track, not an internship programme.",
    whoFor: [
      "Learners who already know basic Python and want to apply it to Data Analysis",
      "Analysts moving from spreadsheets into Pandas, EDA, and ML Models",
      "Students preparing a Development-track data-science skill set before a Business Analytics or MERN project",
    ],
    topicDetails: {
      "Data Wrangling":
        "Data Wrangling is the first topic in this Data Science Course. Clean and reshape datasets with Python and Pandas so missing values, types, and joins do not block the rest of the workflow. NumPy sits beside Pandas for numeric arrays. This is table work, not SQL or a separate reporting course.",
      EDA: "EDA is the second topic — Exploratory Data Analysis. Explore distributions, relationships, and visual summaries with Matplotlib so you understand the data before you fit a model. This is Data Visualization on the Development track, not Tableau or Power BI.",
      "ML Models":
        "ML Models is the third topic. Train machine learning models with Scikit-learn and practise the basic fit–evaluate loop on structured data. The catalog tags ML; it does not name TensorFlow or Keras.",
      "Feature Engineering":
        "Feature Engineering is the fourth topic. Create and select features that models can use, instead of passing raw columns straight into an algorithm.",
      Deployment:
        "Deployment is the fifth topic. Take a trained workflow beyond the notebook so the analysis can be shared or run as a simple deployed output. The catalog does not name a cloud or web framework for this step.",
    },
    outcomes: [
      "Wrangle tabular data in Python with Pandas and NumPy after this Data Science Course",
      "Run Exploratory Data Analysis and plots with Matplotlib",
      "Train and evaluate basic Scikit-learn ML Models",
      "Use Feature Engineering instead of only raw columns",
      "Package the workflow for a simple Deployment step",
    ],
    faqs: [
      {
        q: "What level is Data Science at KYK?",
        a: "Intermediate. The course assumes you can follow Python well enough to use Pandas, NumPy, Matplotlib, and Scikit-learn.",
      },
      {
        q: "How long is the course?",
        a: "The listed duration is 55 hrs.",
      },
      {
        q: "Which tools are included?",
        a: "The catalog tags Pandas, NumPy, ML, and Matplotlib. The course description also names Python and Scikit-learn.",
      },
      {
        q: "Is this the same as Python for Analytics?",
        a: "No. Python for Analytics sits on the Business Analytics track (cleaning, visualisation, reporting). Data Science is on the Development track and includes ML models, feature engineering, and deployment.",
      },
      {
        q: "Can I buy it with Python and MERN?",
        a: "Yes. The Development bundle includes Python Programming, Data Science, and MERN Stack together.",
      },
    ],
    trackLinks: [
      { text: "Python as a language is " },
      { to: "/Blog/python-programming", text: "Python Programming" },
      { text: ". Cleaning, visualisation, and reporting sit on the analytics track (" },
      { to: "/Blog/python-for-analytics", text: "Python for Analytics" },
      { text: "). Full-stack web with MongoDB, Express, React, and Node.js is " },
      { to: "/Blog/mern-stack-development", text: "MERN Stack Development" },
      { text: ". Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/development", text: "Development Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["python-programming", "python-for-analytics", "sql-for-data-analysis"],
  },
  "mern-stack-development": {
    introHeading: "MERN Stack Training covering React, Node, Express and MongoDB",
    intro:
      "This MERN Stack Development Course is Advanced MERN Stack Training at Knock Your Knowledge. It is Full Stack Development — Full Stack Web Development with React on the front end, Node.js and Express on the server, MongoDB for data, then Auth & JWT and a Full-Stack Project. You cover 70 hours, five topics, and 20 videos. The published course fee is ₹299/- plus 18% GST at checkout. This is Advanced, not a beginner language course: you should already know programming basics. It is a Development-track retail course, not an internship. Python Programming teaches the Python language. Data Science is Python for wrangling, EDA, ML models, feature engineering, and deployment. MERN is JavaScript full-stack web.",
    whyLearn:
      "Hiring teams expect you to connect UI, API, and database — not only one layer. This MERN Stack Development Course walks that Full Stack Training path in order: React Fundamentals, Node & Express, MongoDB CRUD, Auth & JWT, then a Full-Stack Project that uses all four. It is MERN Stack Training on the Development track, not an internship programme.",
    whoFor: [
      "Developers who already know programming basics and want a complete MERN path",
      "Students ready for an Advanced Full Stack Web Development course after Python or similar foundations",
      "Builders who need CRUD, login, and a Full-Stack Project they can run as a full app",
    ],
    topicDetails: {
      "React Fundamentals":
        "React Fundamentals is the first topic in this MERN Stack Development Course. Build component-based UIs in React so screens, state, and user actions live in a structure you can extend. The catalog names React; it does not name Next.js or Redux.",
      "Node & Express":
        "Node & Express is the second topic. Create a Node.js server with Express to handle HTTP routes and connect the UI to backend logic.",
      "MongoDB CRUD":
        "MongoDB CRUD is the third topic. Store and change documents in MongoDB — create, read, update, and delete — from your Express API.",
      "Auth & JWT":
        "Auth & JWT is the fourth topic. Add login and protected routes using JSON Web Tokens so not every endpoint is public.",
      "Full-Stack Project":
        "Full-Stack Project is the fifth topic. Combine React, Express, MongoDB, and JWT in one full-stack project instead of leaving each topic as a demo. The catalog does not name a separate hosting platform for this step.",
    },
    outcomes: [
      "Build React interfaces for a real application flow after this MERN Stack Development Course",
      "Expose APIs with Node.js and Express",
      "Perform MongoDB CRUD from the server",
      "Protect routes with Auth & JWT",
      "Ship a Full-Stack Project that uses the MERN stack end to end",
    ],
    faqs: [
      {
        q: "Is MERN Stack Development a beginner course?",
        a: "No. KYK lists it as Advanced, with 70 hrs covering React, Node & Express, MongoDB CRUD, Auth & JWT, and a full-stack project.",
      },
      {
        q: "Which technologies are used?",
        a: "MongoDB, Express, React, and Node.js — the MERN stack named in the course title and tags.",
      },
      {
        q: "Does the course include authentication?",
        a: "Yes. Auth & JWT is one of the five topics, before the full-stack project.",
      },
      {
        q: "Do I need the Python course first?",
        a: "Python is a separate Development course. MERN is JavaScript-based. You can take MERN on its own or with Python and Data Science in the Development bundle.",
      },
      {
        q: "Are videos included?",
        a: "KYK lists five topics and twenty videos for this course on the enrol card.",
      },
    ],
    trackLinks: [
      { text: "The Python language sits on " },
      { to: "/Blog/python-programming", text: "Python Programming" },
      { text: ". Wrangling, EDA, and ML sit on " },
      { to: "/Blog/data-science", text: "Data Science" },
      { text: ". Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/development", text: "Development Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["python-programming", "data-science", "jira-for-project-management"],
  },
  "artificial-intelligence-fundamentals": {
    introHeading: "Introduction to Artificial Intelligence for Machine Learning, Neural Networks and NLP",
    intro:
      "This Artificial Intelligence Fundamentals Course is beginner Artificial Intelligence Training at Knock Your Knowledge. It is an AI Fundamentals Course and an Introduction to Artificial Intelligence: 35 hours, five topics, and 20 videos covering Introduction to AI, Machine Learning Basics, Neural Networks, NLP Essentials, and Real-world AI Use Cases. The published course fee is ₹199/- plus 18% GST at checkout. You study foundational AI concepts — Machine Learning Fundamentals (how models learn from examples), Neural Networks (stacked layers that transform inputs), and Natural Language Processing (how systems handle text). This course does not teach vendor chat or image products. Prompt Engineering covers ChatGPT, Claude, and Gemini; 8 Best AI Tools for Productivity covers Notion AI, Midjourney, Runway, and Perplexity; AI Tools in Digital Marketing covers Jasper, Surfer SEO, Canva AI, and ChatGPT for marketing work.",
    whyLearn:
      "Prompt and product courses are easier when you know what models can and cannot do. This Artificial Intelligence Training gives that foundation: Machine Learning Fundamentals, Neural Networks, and Natural Language Processing, then maps them to Real-world AI Use Cases. It is concept-first, not a tool tour.",
    whoFor: [
      "Beginners who want AI concepts before Prompt Engineering or AI tools courses",
      "Students who need a plain-language path through ML, neural networks, and NLP",
      "Professionals who must explain AI use cases without training as researchers",
    ],
    topicDetails: {
      "Introduction to AI":
        "Introduction to AI is the first topic in this AI Fundamentals Course. Learn what artificial intelligence covers in practice — problems machines can help with, and where human judgement still leads. This is an Introduction to Artificial Intelligence, not a vendor-tool workshop.",
      "Machine Learning Basics":
        "Machine Learning Basics is the second topic: Machine Learning Fundamentals for beginners. See how models learn from examples, and how training data differs from hard-coded rules.",
      "Neural Networks":
        "Neural Networks is the third topic. Build a working mental model of Neural Networks as stacked layers that transform inputs — enough to follow modern AI discussions without training a model yourself.",
      "NLP Essentials":
        "NLP Essentials is the fourth topic. Cover Natural Language Processing so text, prompts, and language models are not a black box. The catalog names NLP as a concept, not a specific chat product.",
      "Real-world AI Use Cases":
        "Real-world AI Use Cases is the fifth topic. Connect Introduction to AI, Machine Learning Basics, Neural Networks, and NLP Essentials to applications people already use, so the theory has somewhere to land.",
    },
    outcomes: [
      "Explain core AI ideas in clear language after this Artificial Intelligence Fundamentals Course",
      "Describe how Machine Learning Fundamentals differs from rule-based software",
      "Recognise what Neural Networks are doing at a high level",
      "Relate NLP Essentials and Natural Language Processing to text and language products",
      "Point to Real-world AI Use Cases using the course framing",
    ],
    faqs: [
      {
        q: "Is this course for beginners?",
        a: "Yes. KYK lists Artificial Intelligence Fundamentals as Beginner level, 35 hrs.",
      },
      {
        q: "Does it teach ChatGPT prompting?",
        a: "Prompt design for ChatGPT, Claude, and Gemini is a separate course: Prompt Engineering. This course focuses on AI, ML, neural networks, NLP, and use cases.",
      },
      {
        q: "What tags are listed?",
        a: "AI, ML, Neural Networks, and NLP.",
      },
      {
        q: "Can I take it with the other AI courses?",
        a: "Yes. The AI & Prompt Engineering bundle includes this course, Prompt Engineering, and 8 Best AI Tools for Productivity.",
      },
      {
        q: "Are there videos?",
        a: "The course enrol card lists five topics and twenty videos.",
      },
    ],
    trackLinks: [
      { text: "Prompt design for ChatGPT, Claude, and Gemini sits on " },
      { to: "/Blog/prompt-engineering", text: "Prompt Engineering" },
      { text: ". Day-to-day products such as Notion AI and Midjourney are on " },
      { to: "/Blog/8-best-ai-tools-for-productivity", text: "8 Best AI Tools for Productivity" },
      { text: ". Marketing-specific AI is a separate course (" },
      { to: "/Blog/ai-tools-in-digital-marketing", text: "AI Tools in Digital Marketing" },
      { text: "). Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/ai", text: "AI & Prompt Engineering Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["prompt-engineering", "8-best-ai-tools-for-productivity", "python-programming"],
  },
  "prompt-engineering": {
    introHeading: "Prompt Engineering Training for ChatGPT, Claude and Gemini",
    intro:
      "This Prompt Engineering Course is beginner Prompt Engineering Training at Knock Your Knowledge. It is ChatGPT Prompt Engineering with Claude and Gemini: 15 hours, five topics, and 20 videos covering Prompt Design Techniques, Working with AI Tools, Chain-of-Thought, Few-Shot Prompting, and Advanced Use Cases. The published course fee is ₹199/- plus 18% GST at checkout. Prompt engineering is AI Prompt Writing — you set the role, task, constraints, and output so those three products return usable work instead of generic chat. This course focuses on prompt design and AI Prompt Techniques, not Artificial Intelligence Fundamentals (AI, ML, neural networks, NLP), not 8 Best AI Tools for Productivity, and not AI Tools in Digital Marketing.",
    whyLearn:
      "Generic prompts waste time. This Prompt Engineering Training is about AI Prompt Techniques — Chain-of-Thought, Few-Shot Prompting, and structured Prompt Design Techniques — so you can steer ChatGPT, Claude, and Gemini toward clearer answers and repeatable workflows. It is not a theory survey and not a tour of productivity or marketing products.",
    whoFor: [
      "Beginners who already use ChatGPT, Claude, or Gemini and want better results",
      "Students and professionals who need prompt patterns, not model training",
      "Learners who completed AI Fundamentals and want a practical prompting course",
    ],
    topicDetails: {
      "Prompt Design Techniques":
        "Prompt Design Techniques is the first topic: structure prompts with role, task, constraints, and output format so ChatGPT, Claude, or Gemini has something specific to follow. This is AI Prompt Writing, not model training.",
      "Working with AI Tools":
        "Working with AI Tools is the second topic. Practise the same ChatGPT Prompt Engineering methods across ChatGPT, Claude, and Gemini instead of memorising one chat box. The catalog names those three products only.",
      "Chain-of-Thought":
        "Chain-of-Thought is the third topic. Ask models to reason step by step on multi-part tasks so answers are easier to check. It is one of the AI Prompt Techniques this beginner course names.",
      "Few-Shot Prompting":
        "Few-Shot Prompting is the fourth topic. Give short examples in the prompt so the model copies the pattern you actually want, instead of guessing from a one-shot request.",
      "Advanced Use Cases":
        "Advanced Use Cases is the fifth topic. Combine Prompt Design Techniques, Chain-of-Thought, and Few-Shot Prompting on harder tasks once the basic patterns are in place.",
    },
    outcomes: [
      "Design prompts with a clear task and output shape",
      "Work across ChatGPT, Claude, and Gemini with the same method",
      "Use Chain-of-Thought on problems that need steps",
      "Apply Few-Shot Prompting instead of one-shot guesses",
      "Handle Advanced Use Cases with those techniques together",
    ],
    faqs: [
      {
        q: "Which AI products does the course name?",
        a: "ChatGPT, Claude, and Gemini, as listed in the course description and tags.",
      },
      {
        q: "How long is Prompt Engineering?",
        a: "15 hrs, listed as Beginner.",
      },
      {
        q: "Is this the AI Fundamentals course?",
        a: "No. Fundamentals covers AI, ML, neural networks, and NLP. Prompt Engineering is about prompt design and AI tools.",
      },
      {
        q: "Do I need to train a model?",
        a: "The five topics are prompt design, working with AI tools, chain-of-thought, few-shot prompting, and advanced use cases — not model training.",
      },
      {
        q: "Is it in a bundle?",
        a: "Yes. It is part of the AI & Prompt Engineering bundle with AI Fundamentals and 8 Best AI Tools for Productivity.",
      },
    ],
    trackLinks: [
      { text: "AI, ML, neural networks, and NLP sit on " },
      { to: "/Blog/artificial-intelligence-fundamentals", text: "Artificial Intelligence Fundamentals" },
      { text: ". Day-to-day products such as Notion AI and Midjourney are on " },
      { to: "/Blog/8-best-ai-tools-for-productivity", text: "8 Best AI Tools for Productivity" },
      { text: ". Marketing-specific AI is a separate course (" },
      { to: "/Blog/ai-tools-in-digital-marketing", text: "AI Tools in Digital Marketing" },
      { text: "). Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/ai", text: "AI & Prompt Engineering Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["artificial-intelligence-fundamentals", "8-best-ai-tools-for-productivity", "ai-tools-in-digital-marketing"],
  },
  "8-best-ai-tools-for-productivity": {
    introHeading: "AI Productivity Tools Training for Writing, Research and Automation",
    intro:
      "This 8 Best AI Tools for Productivity Course is beginner AI Productivity Tools Training at Knock Your Knowledge. It is an AI Tools for Productivity course with the catalog tools Notion AI, Midjourney, Runway, and Perplexity: 12 hours, five topics, and 20 videos covering Introduction to AI Tools, Image & Video AI, Writing & Research AI, Coding Assistants, and Workflow Automation. The published course fee is ₹199/- plus 18% GST at checkout. Those products map onto daily work — draft writing, generate images and video, research, try coding assistants, and chain the steps. It is a beginner overview of productivity tools, not the marketing-track AI Tools in Digital Marketing course. The catalog names four brands plus “and more”; it does not list eight specific AI brands.",
    whyLearn:
      "New tools appear every month, but the jobs stay similar: write, research, generate media, code, and automate. This AI Productivity Tools Training groups those jobs so you practise a stack — including Notion AI, Midjourney, Runway, and Perplexity — instead of collecting random sign-ups. Marketing-specific AI (Jasper, Surfer SEO, Canva AI, ChatGPT) sits on a separate course.",
    whoFor: [
      "Beginners who want a guided tour of productivity AI rather than one chatbot",
      "Creators and students who need image, video, writing, and research tools in one course",
      "Professionals who want coding assistants and workflow automation after they know the basics",
    ],
    topicDetails: {
      "Introduction to AI Tools":
        "Introduction to AI Tools is the first topic: map the landscape so you know which kind of tool fits writing, research, media, or automation before you open ten tabs. This is a beginner survey of productivity products, not prompt-design technique and not marketing-only AI.",
      "Image & Video AI":
        "Image & Video AI is the second topic. Use image and video AI, including tools named on the course such as Midjourney and Runway, for visual drafts you can iterate. The catalog does not name extra image brands beyond those two.",
      "Writing & Research AI":
        "Writing & Research AI is the third topic. Draft and research with assistants such as Notion AI and Perplexity, then check the output instead of pasting it blindly. This is everyday writing and lookup, not ad copy or SEO tooling.",
      "Coding Assistants":
        "Coding Assistants is the fourth topic. Practise coding assistants as a way to move faster on small programming tasks, not as a replacement for reading the code. The catalog does not name a specific coding-assistant brand.",
      "Workflow Automation":
        "Workflow Automation is the fifth topic. Connect Notion AI, Midjourney, Runway, and Perplexity into a simple workflow so writing, media, research, and coding are not five disconnected logins.",
    },
    outcomes: [
      "Choose an AI tool type for writing, research, media, or automation",
      "Use Image & Video AI including Midjourney and Runway at a beginner level",
      "Draft and research with Writing & Research AI such as Notion AI and Perplexity",
      "Try Coding Assistants on small tasks",
      "Sketch a Workflow Automation that chains more than one AI step",
    ],
    faqs: [
      {
        q: "Which tools are named on the course?",
        a: "The description lists Notion AI, Midjourney, Runway, Perplexity, and more. Tags highlight Midjourney, Runway, Notion AI, and Perplexity. The course does not list a full set of eight brand names in the catalog.",
      },
      {
        q: "How long is it?",
        a: "12 hrs, Beginner level.",
      },
      {
        q: "Does this replace Prompt Engineering?",
        a: "No. Prompt Engineering teaches prompt techniques for ChatGPT, Claude, and Gemini. This course is about productivity tools across writing, media, coding, and automation.",
      },
      {
        q: "Is coding required?",
        a: "Coding Assistants is one of five topics. The course is still listed as Beginner overall.",
      },
      {
        q: "Can I buy it in a pack?",
        a: "Yes. It is in the AI & Prompt Engineering bundle with AI Fundamentals and Prompt Engineering.",
      },
    ],
    trackLinks: [
      { text: "Prompt design for ChatGPT, Claude, and Gemini sits on " },
      { to: "/Blog/prompt-engineering", text: "Prompt Engineering" },
      { text: ". Core AI concepts are in " },
      { to: "/Blog/artificial-intelligence-fundamentals", text: "Artificial Intelligence Fundamentals" },
      { text: ". Marketing-specific AI tools are a separate course (" },
      { to: "/Blog/ai-tools-in-digital-marketing", text: "AI Tools in Digital Marketing" },
      { text: "). Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/ai", text: "AI & Prompt Engineering Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["prompt-engineering", "artificial-intelligence-fundamentals", "ai-tools-in-digital-marketing"],
  },
  "sql-for-data-analysis": {
    introHeading: "SQL Training covering Queries, Joins, Aggregations and Window Functions",
    intro:
      "This SQL for Data Analysis Course is beginner SQL Training at Knock Your Knowledge. It is a SQL Course for writing queries against relational business data: 25 hours, five topics, and 20 videos covering SQL Basics, Joins & Aggregations, Window Functions, Stored Procedures, and an Analytics Project. You use MySQL and PostgreSQL. Catalog projects are Sales Dashboard and Customer Segmentation. The published course fee is ₹199/- plus 18% GST at checkout. This is Beginner. It is a Business Analytics-track retail course, not an internship. SQL is the query layer: you write SQL queries to extract, transform, and analyse tables. Python for Analytics is cleaning, visualisation, and reporting with Python and Pandas. Power BI Dashboarding and Tableau Visualization are dashboard courses. Jira for Project Management is boards, sprints, and team workflow. Python Programming is the Python language. Data Science is wrangling, EDA, and ML. This course does not teach Python, machine learning, dashboard development, or Jira.",
    whyLearn:
      "Dashboards and Python notebooks still sit on tables. If you cannot join, aggregate, and window those tables, you wait on someone else for every extract. This SQL for Data Analysis Course is SQL Training for that query layer — SELECT queries, filters, sorting, joins, aggregations, window functions, and stored procedures in MySQL and PostgreSQL — so you can extract and analyse business data yourself. It is a Business Analytics-track retail course, not an internship programme and not a Python, ML, dashboard, or Jira course.",
    whoFor: [
      "Beginners who need SQL for analysis, not only database administration",
      "Analysts who live in spreadsheets and want joins, aggregations, and window functions",
      "Learners heading toward Power BI, Tableau, or Python for Analytics on the same track",
    ],
    topicDetails: {
      "SQL Basics":
        "SQL Basics is the first topic in this SQL for Data Analysis Course. Select, filter, and sort rows so you can inspect tables in MySQL or PostgreSQL without exporting everything to Excel first.",
      "Joins & Aggregations":
        "Joins & Aggregations is the second topic. Combine tables with joins and summarise with GROUP BY so questions like totals by customer or region have a query, not a manual pivot.",
      "Window Functions":
        "Window Functions is the third topic. Use window functions for running totals, ranks, and comparisons that aggregations alone cannot express.",
      "Stored Procedures":
        "Stored Procedures is the fourth topic. Package repeatable SQL into stored procedures so the same logic is not rewritten in every ad-hoc script.",
      "Analytics Project":
        "Analytics Project is the fifth topic. Apply the topics in an analytics project. The catalog lists Sales Dashboard and Customer Segmentation as projects for this course.",
    },
    outcomes: [
      "Write SELECT queries with filters and sorting in MySQL or PostgreSQL after this SQL for Data Analysis Course",
      "Join tables and aggregate business metrics",
      "Use window functions for ranks and running comparisons",
      "Wrap repeatable logic in stored procedures",
      "Complete an analytics project in the direction of a sales dashboard or customer segmentation",
    ],
    faqs: [
      {
        q: "Which databases does the course list?",
        a: "MySQL and PostgreSQL, in the course tools list.",
      },
      {
        q: "What projects are listed?",
        a: "Sales Dashboard and Customer Segmentation.",
      },
      {
        q: "How long is SQL for Data Analysis?",
        a: "25 hrs, Beginner level.",
      },
      {
        q: "Is this Power BI?",
        a: "No. Power BI Dashboarding is a separate Business Analytics course. SQL is the query foundation many dashboards use.",
      },
      {
        q: "Is it in a bundle?",
        a: "Yes. The Business Analytics bundle includes SQL, Python for Analytics, Power BI, Tableau, and Jira.",
      },
    ],
    trackLinks: [
      { text: "Cleaning, visualisation, and reporting sit on " },
      { to: "/Blog/python-for-analytics", text: "Python for Analytics" },
      { text: ". Dashboards in Tableau sit on " },
      { to: "/Blog/tableau-visualization", text: "Tableau Visualization" },
      { text: ". Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/analytics", text: "Business Analytics Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["python-for-analytics", "power-bi-dashboarding", "tableau-visualization"],
  },
  "python-for-analytics": {
    intro:
      "Python for Analytics is an intermediate KYK course on business analysis with Python and Pandas. You work through data cleaning, exploratory analysis, visualisation with Seaborn, reporting automation, and a business project. Catalog projects include revenue analysis and a KPI dashboard.",
    whyLearn:
      "SQL gets the rows; Python helps you clean, plot, and repeat the report. This course is for analysts who need Pandas, Seaborn, and automated reporting — not a full machine-learning syllabus.",
    whoFor: [
      "Analysts who know some SQL or Excel and want Python for cleaning and charts",
      "Intermediate learners ready for Pandas and Seaborn on business data",
      "People building a revenue analysis or KPI dashboard as listed in the catalog",
    ],
    topicDetails: {
      "Data Cleaning":
        "Fix types, missing values, and messy columns in Pandas so the rest of the analysis is not built on broken inputs.",
      "Exploratory Analysis":
        "Slice business data to see trends and outliers before you present a number as a fact.",
      Visualisation:
        "Plot with Seaborn (and Python) so stakeholders can see the pattern, not only a table.",
      "Reporting Automation":
        "Repeat the same report with code instead of rebuilding it by hand every week.",
      "Business Project":
        "Bring cleaning, EDA, charts, and automation into a business project. Catalog projects are Revenue Analysis and KPI Dashboard.",
    },
    outcomes: [
      "Clean business datasets with Python and Pandas",
      "Run exploratory analysis on commercial metrics",
      "Visualise results with Seaborn",
      "Automate a repeating report in code",
      "Complete a business project such as revenue analysis or a KPI dashboard",
    ],
    faqs: [
      {
        q: "How is this different from Data Science?",
        a: "Python for Analytics is on the Business Analytics track (cleaning, visualisation, reporting, business project). Data Science is on the Development track and includes ML models, feature engineering, and deployment.",
      },
      {
        q: "Which tools are listed?",
        a: "Python, Pandas, and Seaborn.",
      },
      {
        q: "What projects are listed?",
        a: "Revenue Analysis and KPI Dashboard.",
      },
      {
        q: "What is the level and duration?",
        a: "Intermediate, 30 hrs.",
      },
      {
        q: "Can I take it with SQL and Power BI?",
        a: "Yes. All three are in the Business Analytics bundle, along with Tableau and Jira.",
      },
    ],
    relatedSlugs: ["sql-for-data-analysis", "data-science", "power-bi-dashboarding"],
  },
  "power-bi-dashboarding": {
    intro:
      "Power BI Dashboarding is an intermediate KYK course on building interactive reports. You cover Power BI basics, DAX formulas, data modelling, visuals and filters, and a live dashboard, using Power BI, DAX, and Power Query. Catalog projects include a sales report and HR analytics.",
    whyLearn:
      "A dump of charts is not a dashboard. This course ties modelling, DAX, and filters together so people can slice a live report instead of asking you for a new screenshot.",
    whoFor: [
      "Analysts who need Power BI, DAX, and Power Query for work",
      "Intermediate learners who already understand tables and want interactive reports",
      "Anyone targeting the listed sales report or HR analytics project style",
    ],
    topicDetails: {
      "Power BI Basics":
        "Load data and learn the Power BI workspace so you are not lost in ribbons before you write DAX.",
      "DAX Formulas":
        "Write DAX measures that respond to filters, instead of only dropping raw columns on a chart.",
      "Data Modelling":
        "Relate tables in a model Power BI can use, including work you start in Power Query.",
      "Visuals & Filters":
        "Choose visuals and slicers so users can ask the next question without a new file.",
      "Live Dashboard":
        "Publish a live dashboard. Catalog projects named for this course are Sales Report and HR Analytics.",
    },
    outcomes: [
      "Build a Power BI report from loaded data",
      "Write DAX formulas for filtered metrics",
      "Model tables with Power Query in the mix",
      "Add visuals and filters users can actually use",
      "Deliver a live dashboard in the spirit of a sales or HR report",
    ],
    faqs: [
      {
        q: "Which tools are listed?",
        a: "Power BI, DAX, and Power Query.",
      },
      {
        q: "What projects are listed?",
        a: "Sales Report and HR Analytics.",
      },
      {
        q: "How long is the course?",
        a: "28 hrs, Intermediate.",
      },
      {
        q: "Is Tableau included?",
        a: "Tableau Visualization is a separate course on the same Business Analytics track. You can take both, or the analytics bundle that includes them.",
      },
      {
        q: "Are there videos?",
        a: "The enrol card lists five topics and twenty videos.",
      },
    ],
    relatedSlugs: ["tableau-visualization", "sql-for-data-analysis", "python-for-analytics"],
  },
  "tableau-visualization": {
    intro:
      "Tableau Visualization is an intermediate KYK course on dashboards and data stories. You cover Tableau basics, calculated fields, dashboard design, data blending, and storytelling, using Tableau and Tableau Prep. Catalog projects include a market trend map and a financial dashboard.",
    whyLearn:
      "Tableau is built for seeing the shape of data quickly. This course moves from basics to calculated fields, blending, and dashboard design so you can tell a story — not only drop a bar chart on a sheet.",
    whoFor: [
      "Analysts who need Tableau and Tableau Prep for visual work",
      "Intermediate learners who already think in metrics and want stronger dashboards",
      "People aiming at the listed market trend map or financial dashboard projects",
    ],
    topicDetails: {
      "Tableau Basics":
        "Connect data and build first worksheets so marks, shelves, and filters feel familiar.",
      "Calculated Fields":
        "Create calculated fields when the source table does not already hold the metric you need.",
      "Dashboard Design":
        "Arrange views into a dashboard people can scan, not a pile of worksheets.",
      "Data Blending":
        "Blend data from more than one source when a single extract is not enough, including prep work in Tableau Prep.",
      Storytelling:
        "Sequence the dashboard as a story. Catalog projects are Market Trend Map and Financial Dashboard.",
    },
    outcomes: [
      "Build worksheets in Tableau from connected data",
      "Write calculated fields for missing metrics",
      "Design a dashboard layout with a clear reading order",
      "Blend sources with help from Tableau Prep where needed",
      "Present a story such as a market trend map or financial dashboard",
    ],
    faqs: [
      {
        q: "Which tools are listed?",
        a: "Tableau and Tableau Prep.",
      },
      {
        q: "What projects are listed?",
        a: "Market Trend Map and Financial Dashboard.",
      },
      {
        q: "What is the level and duration?",
        a: "Intermediate, 22 hrs.",
      },
      {
        q: "Should I take Power BI or Tableau?",
        a: "They are separate KYK courses. Many teams use one or the other. The Business Analytics bundle includes both.",
      },
      {
        q: "Is SQL required first?",
        a: "SQL for Data Analysis is a separate beginner course on the same track. It is useful but not listed as a formal prerequisite on this page.",
      },
    ],
    relatedSlugs: ["power-bi-dashboarding", "sql-for-data-analysis", "python-for-analytics"],
  },
  "jira-for-project-management": {
    introHeading: "Jira Training covering Scrum, Kanban, Backlogs and Sprints",
    intro:
      "This Jira for Project Management Course is beginner Jira Training at Knock Your Knowledge. It is a Jira Course for Agile Project Management: 10 hours, five topics, and 20 videos covering Jira Basics, Scrum & Kanban, Backlogs & Sprints, Reporting, and Team Workflow. You use Jira and Confluence. Catalog projects are Sprint Board Setup and Release Tracker. The published course fee is ₹199/- plus 18% GST at checkout. This is Beginner, not a coding course. It is a Business Analytics-track retail course, not an internship. SQL for Data Analysis teaches SQL queries. Python for Analytics is cleaning, visualisation, and reporting. Power BI Dashboarding and Tableau Visualization are dashboard courses. Python Programming is the Python language. Data Science is wrangling, EDA, and ML. MERN Stack Development is JavaScript full-stack web. Jira is boards, sprints, reporting, and team workflow.",
    whyLearn:
      "Delivery work lives in boards, sprints, and epics. This Jira for Project Management Course is Jira Training for those Agile workflows — Scrum, Kanban, backlogs, sprints, reporting, and team workflow in Jira, with Confluence beside the board — so you can run a board instead of only watching one. It is a Business Analytics-track retail course, not an internship programme and not a coding course.",
    whoFor: [
      "Beginners joining a team that already uses Jira",
      "Students who need Scrum, Kanban, backlogs, and sprints in one short course",
      "People who want to set up a sprint board or release tracker as listed in the catalog",
    ],
    topicDetails: {
      "Jira Basics":
        "Jira Basics is the first topic in this Jira for Project Management Course. Navigate projects, issues, and boards so you can find work and update it without breaking the project.",
      "Scrum & Kanban":
        "Scrum & Kanban is the second topic. See how Scrum sprints and Kanban flow differ, and when a team uses each board type.",
      "Backlogs & Sprints":
        "Backlogs & Sprints is the third topic. Order a backlog, plan a sprint, and use epics so work is not a flat list of tickets.",
      Reporting:
        "Reporting is the fourth topic. Read Jira reports that show what the board is actually doing, not only what people say in standup.",
      "Team Workflow":
        "Team Workflow is the fifth topic. Follow a team workflow across Jira and Confluence. Catalog projects are Sprint Board Setup and Release Tracker.",
    },
    outcomes: [
      "Move around Jira projects, issues, and boards after this Jira for Project Management Course",
      "Tell Scrum and Kanban boards apart in practice",
      "Work a backlog, sprint, and epic structure",
      "Use reporting to see board progress",
      "Practise team workflow toward a sprint board or release tracker",
    ],
    faqs: [
      {
        q: "Which tools are listed?",
        a: "Jira and Confluence.",
      },
      {
        q: "What projects are listed?",
        a: "Sprint Board Setup and Release Tracker.",
      },
      {
        q: "How long is the course?",
        a: "10 hrs, Beginner.",
      },
      {
        q: "Is this a coding course?",
        a: "No. The five topics are Jira basics, Scrum & Kanban, backlogs & sprints, reporting, and team workflow.",
      },
      {
        q: "Why is it in the Analytics bundle?",
        a: "KYK places Jira on the Business Analytics track with SQL, Python for Analytics, Power BI, and Tableau. The analytics bundle includes all five.",
      },
    ],
    trackLinks: [
      { text: "Cleaning, visualisation, and reporting sit on " },
      { to: "/Blog/python-for-analytics", text: "Python for Analytics" },
      { text: ". Dashboards in Tableau sit on " },
      { to: "/Blog/tableau-visualization", text: "Tableau Visualization" },
      { text: ". Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/analytics", text: "Business Analytics Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["sql-for-data-analysis", "power-bi-dashboarding", "mern-stack-development"],
  },
  "seo-search-engine-optimization": {
    introHeading: "SEO Training for Keyword Research, On-Page SEO and Technical SEO",
    intro:
      "This SEO Course is intermediate Search Engine Optimization Training at Knock Your Knowledge — a Search Engine Optimization Course for earning visibility in Google, not buying ads. You learn SEO across 30 hours, five topics, and 20 videos: SEO Fundamentals, Keyword Research, On-Page SEO, Technical SEO, and Link Building. Catalog tags are Google, Keywords, Backlinks, and Technical SEO. The published fee is ₹149/- plus 18% GST at checkout.",
    whyLearn:
      "Paid ads stop when the budget stops. Organic search keeps working if pages are crawlable, relevant, and supported by links. This SEO Training is that organic path — Keyword Research, On-Page SEO, Technical SEO, and Link Building in one intermediate course. Google Ads live in the separate SEM course.",
    whoFor: [
      "Marketers who need Keyword Research, On-Page SEO, Technical SEO, and Link Building in one SEO Course",
      "Intermediate learners who already write content and want it to rank",
      "People who will also use Search Console, which is a separate KYK course — it is not a topic on this page",
    ],
    topicDetails: {
      "SEO Fundamentals":
        "SEO Fundamentals is the first topic: how Google discovers and ranks pages, so Keyword Research, On-Page SEO, Technical SEO, and Link Building have a frame. The Google tag on this course is that search context — not a separate Google Ads module.",
      "Keyword Research":
        "Keyword Research is the second topic. Find terms people actually search, using the Keywords tag, and map them to pages instead of guessing.",
      "On-Page SEO":
        "On-Page SEO is the third topic: align titles, headings, and content with the query without stuffing the same phrase everywhere.",
      "Technical SEO":
        "Technical SEO is the fourth topic and a listed tag. Fix crawl and index issues that hide good content. This course does not include Search Console; that measurement work is a separate KYK course.",
      "Link Building":
        "Link Building is the fifth topic. Earn and evaluate backlinks as listed in the Backlinks tag, rather than treating every link as equal. The catalog does not name a separate Off-Page SEO module.",
    },
    outcomes: [
      "Explain how search visibility works at a practical level",
      "Run Keyword Research and assign terms to pages",
      "Improve On-Page SEO for a target query",
      "Spot Technical SEO issues that block indexing",
      "Plan Link Building with backlinks in mind",
    ],
    faqs: [
      {
        q: "Is this the same as Google Ads?",
        a: "No. Google Ads, bidding, and retargeting are in SEM — Search Engine Marketing. This course is organic SEO.",
      },
      {
        q: "How long is the SEO course?",
        a: "30 hrs, Intermediate.",
      },
      {
        q: "Does it include Search Console?",
        a: "Google Webmaster & Search Console is a separate course covering GSC, indexing, Core Web Vitals, and sitemaps. Take both if you need implementation plus measurement.",
      },
      {
        q: "What tags are listed?",
        a: "Google, Keywords, Backlinks, and Technical SEO.",
      },
      {
        q: "Is it in the marketing bundle?",
        a: "Yes, with SEM, SMM, SMO, Search Console, and AI Tools in Digital Marketing.",
      },
    ],
    trackLinks: [
      { text: "Paid search is a separate KYK course (" },
      { to: "/Blog/sem-search-engine-marketing", text: "SEM — Search Engine Marketing" },
      { text: "). Measurement in " },
      { to: "/Blog/google-webmaster-search-console", text: "Google Webmaster & Search Console" },
      { text: " is also separate. Related social courses are " },
      { to: "/Blog/smm-social-media-marketing", text: "SMM — Social Media Marketing" },
      { text: " and " },
      { to: "/Blog/smo-social-media-optimization", text: "SMO — Social Media Optimization" },
      { text: ". Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/marketing", text: "Advanced Digital Marketing Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["sem-search-engine-marketing", "google-webmaster-search-console", "ai-tools-in-digital-marketing"],
  },
  "sem-search-engine-marketing": {
    introHeading: "SEM Training for Google Ads, Keyword Bidding and Paid Search",
    intro:
      "This SEM Course is intermediate Search Engine Marketing Training at Knock Your Knowledge — a Search Engine Marketing Course for Paid Search, so you can Learn SEM by buying the click rather than waiting on organic ranking. You cover 25 hours, five topics, and 20 videos: Google Ads Setup, Keyword Bidding, Ad Copy, Landing Pages, and ROI Optimisation. The catalog names Google Ads and Bing Ads, plus quality score and retargeting; tags are Google Ads, PPC, and Retargeting. The published fee is ₹149/- plus 18% GST at checkout.",
    whyLearn:
      "Organic SEO takes time. SEM is how you buy the click while that work compounds — if Keyword Bidding, Ad Copy, Landing Pages, and ROI Optimisation are treated as one system, not four disconnected tasks. This SEM Training is that Paid Search path. Google Ads and Bing Ads are the named platforms; organic ranking lives in the separate SEO course.",
    whoFor: [
      "Marketers who must run Google Ads or Bing Ads with a budget",
      "Intermediate learners who understand keywords and want Paid Search execution in a SEM Course",
      "People who need Retargeting and ROI Optimisation, not only Google Ads Setup",
    ],
    topicDetails: {
      "Google Ads Setup":
        "Google Ads Setup is the first topic: build the account and campaign structure so Google Ads (and the Bing Ads work named in the description) start from a clean setup. Search Console is not a topic here — that measurement work is a separate KYK course.",
      "Keyword Bidding":
        "Keyword Bidding is the second topic. Bid on search terms with intent, instead of paying for every broad match that appears. PPC in the course tags is that paid-click bidding, not a separate extra module.",
      "Ad Copy":
        "Ad Copy is the third topic: write ads that match the query and feed quality score, which the course description names explicitly.",
      "Landing Pages":
        "Landing Pages is the fourth topic. Send traffic to a page that continues the promise in the ad, not a generic homepage.",
      "ROI Optimisation":
        "ROI Optimisation is the fifth topic. Improve return, including Retargeting as listed in the course tags, so spend is not only top-of-funnel.",
    },
    outcomes: [
      "Set up a Google Ads campaign structure you can manage",
      "Bid on keywords with a clear match to intent using Keyword Bidding",
      "Write Ad Copy that supports quality score",
      "Choose Landing Pages that match the ad",
      "Run ROI Optimisation and use Retargeting as part of Paid Search",
    ],
    faqs: [
      {
        q: "Which ad platforms are named?",
        a: "Google Ads and Bing Ads, plus tags for Google Ads, PPC, and Retargeting.",
      },
      {
        q: "How long is SEM?",
        a: "25 hrs, Intermediate.",
      },
      {
        q: "Is SEO included?",
        a: "SEO is a separate organic course. SEM is paid search: setup, bidding, copy, landing pages, and ROI.",
      },
      {
        q: "Does it cover retargeting?",
        a: "Yes. Retargeting is in the course description and tags, and ROI Optimisation is the fifth topic.",
      },
      {
        q: "Is it in the marketing bundle?",
        a: "Yes, with SEO, SMM, SMO, Search Console, and AI Tools in Digital Marketing.",
      },
    ],
    trackLinks: [
      { text: "Organic search is a separate KYK course (" },
      { to: "/Blog/seo-search-engine-optimization", text: "SEO — Search Engine Optimization" },
      { text: "). Measurement in " },
      { to: "/Blog/google-webmaster-search-console", text: "Google Webmaster & Search Console" },
      { text: " is also separate. Related social courses are " },
      { to: "/Blog/smm-social-media-marketing", text: "SMM — Social Media Marketing" },
      { text: " and " },
      { to: "/Blog/smo-social-media-optimization", text: "SMO — Social Media Optimization" },
      { text: ". Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/marketing", text: "Advanced Digital Marketing Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["seo-search-engine-optimization", "smm-social-media-marketing", "ai-tools-in-digital-marketing"],
  },
  "smm-social-media-marketing": {
    introHeading: "SMM Training for Instagram, LinkedIn, X, and YouTube",
    intro:
      "This Social Media Marketing Course is beginner-friendly SMM training at Knock Your Knowledge. It is Social Media Marketing Training Online: 28 hrs, five topics, and 20 videos covering platform strategy, content calendars, Paid Social, analytics, and Influencer Marketing. You work with the named networks — Instagram, LinkedIn, X, and YouTube — including paid ads as listed in the course tags. The published course fee is ₹149/- plus 18% GST at checkout.",
    whyLearn:
      "Posting without a platform plan, a Content Calendar, or measurement is noise. This Social Media Marketing path puts strategy, content, Paid Social, Social Media Analytics, and Influencer Marketing in one beginner course for the networks KYK actually lists. Instagram Marketing, LinkedIn Marketing, and YouTube Marketing here mean using those named platforms (plus X) with a job each — not copying one caption everywhere.",
    whoFor: [
      "Beginners responsible for Instagram, LinkedIn, X, or YouTube who want structured SMM training",
      "Students who need a Content Calendar and Paid Social, not only organic posting",
      "Marketers who will also look at SMO for profile and community tactics",
    ],
    topicDetails: {
      "Platform Strategy":
        "Choose what each named network is for. Instagram Marketing, LinkedIn Marketing, and YouTube Marketing (with X) should not share one caption — the catalog names Instagram, LinkedIn, X, and YouTube as the platforms this course uses.",
      "Content Calendar":
        "A Content Calendar is the second topic: plan posts on dates so campaigns are scheduled, not last-minute uploads.",
      "Paid Social":
        "Paid Social is the third topic. Use paid ads on social, as listed in the Paid Ads tag, to extend the organic plan rather than replace it.",
      Analytics:
        "Analytics here is Social Media Analytics: read platform analytics so you keep what works and drop what does not. The catalog does not name a separate analytics tool.",
      "Influencer Marketing":
        "Influencer Marketing is the named fifth topic. Work with creators as part of the same system, not as an afterthought to ads.",
    },
    outcomes: [
      "Set a simple platform strategy for Instagram, LinkedIn, X, and YouTube",
      "Build a Content Calendar you can actually follow",
      "Run Paid Social alongside organic posts",
      "Use Social Media Analytics to judge what to repeat",
      "Plan an Influencer Marketing step inside that system",
    ],
    faqs: [
      {
        q: "Which platforms are named?",
        a: "Instagram, LinkedIn, X, and YouTube, plus tags for Instagram, LinkedIn, YouTube, and Paid Ads.",
      },
      {
        q: "What is the level and duration?",
        a: "Beginner, 28 hrs.",
      },
      {
        q: "How is this different from SMO?",
        a: "SMO focuses on profile optimisation, hashtags, engagement, and community. SMM is broader: platform strategy, calendars, paid social, analytics, and influencers.",
      },
      {
        q: "Does it include paid ads?",
        a: "Yes. Paid Social is a topic, and Paid Ads is a tag.",
      },
      {
        q: "Is it in the marketing bundle?",
        a: "Yes, with SEO, SEM, SMO, Search Console, and AI Tools in Digital Marketing.",
      },
      {
        q: "What do students learn in the Social Media Marketing Course?",
        a: "The five topics are Platform Strategy, Content Calendar, Paid Social, Analytics, and Influencer Marketing. The course is beginner level, 28 hrs, with 20 videos across those five topics, on Instagram, LinkedIn, X, and YouTube.",
      },
    ],
    trackLinks: [
      { text: "SMO is a separate KYK course (" },
      { to: "/Blog/smo-social-media-optimization", text: "SMO — Social Media Optimization" },
      { text: ") on profiles, hashtags, engagement, and community. Related Digital Marketing courses include " },
      { to: "/Blog/seo-search-engine-optimization", text: "SEO — Search Engine Optimization" },
      { text: ", " },
      { to: "/Blog/sem-search-engine-marketing", text: "SEM — Search Engine Marketing" },
      { text: ", " },
      { to: "/Blog/google-webmaster-search-console", text: "Google Webmaster & Search Console" },
      { text: ", and " },
      { to: "/Blog/ai-tools-in-digital-marketing", text: "AI Tools in Digital Marketing" },
      { text: ". Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/marketing", text: "Advanced Digital Marketing Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["smo-social-media-optimization", "sem-search-engine-marketing", "ai-tools-in-digital-marketing"],
  },
  "smo-social-media-optimization": {
    introHeading: "SMO Training for Profile Optimisation, Hashtags and Engagement",
    intro:
      "This SMO Course is beginner Social Media Optimization Training at Knock Your Knowledge. It is a Social Media Optimization Course for organic social performance: 15 hours, five topics, and 20 videos covering Profile Optimisation, Hashtag Strategy, Engagement Tactics, Community Building, and Analytics. Catalog tags are Organic Reach, Hashtags, and Engagement. The published course fee is ₹149/- plus 18% GST at checkout. Paid social advertising is a separate SMM course — this catalog does not name specific networks as SMO platforms.",
    whyLearn:
      "Paid social cannot fix a weak profile or a dead comment thread. This SMO Training is the organic layer: Profile Optimisation, Hashtags, Engagement Tactics, and Community Building before you buy reach. Paid social advertising sits in SMM, not on this beginner course.",
    whoFor: [
      "Beginners who own a brand or personal profile and need Organic Reach",
      "Social managers who already post but lack Hashtag Strategy, Engagement Tactics, and Community Building",
      "Learners who took SMM and want a tighter organic SMO Course",
    ],
    topicDetails: {
      "Profile Optimisation":
        "Profile Optimisation is the first topic: tighten bios, links, and profile elements so a first visit explains who you are. This is organic SMO work, not a paid-ads setup.",
      "Hashtag Strategy":
        "Hashtag Strategy is the second topic. Use hashtags with intent, matching the Hashtags tag, instead of a long unrelated list.",
      "Engagement Tactics":
        "Engagement Tactics is the third topic: practise replies and prompts that create Engagement, not only broadcasts. Engagement is also a listed course tag.",
      "Community Building":
        "Community Building is the fourth topic. Turn repeat visitors into a community you can actually talk to.",
      Analytics:
        "Analytics is the fifth topic. Measure Organic Reach and Engagement with analytics so optimisation is not guesswork. Search Console is a separate KYK course.",
    },
    outcomes: [
      "Optimise a social profile for a clear first impression",
      "Apply a Hashtag Strategy tied to the content",
      "Use Engagement Tactics beyond posting and leaving",
      "Build a small community loop",
      "Read Analytics for Organic Reach and Engagement",
    ],
    faqs: [
      {
        q: "What tags are listed?",
        a: "Organic Reach, Hashtags, and Engagement.",
      },
      {
        q: "How long is SMO?",
        a: "15 hrs, Beginner.",
      },
      {
        q: "Does this include Instagram ads?",
        a: "Paid social sits in SMM. SMO is organic: profiles, hashtags, engagement, community, and analytics.",
      },
      {
        q: "Which platforms are named?",
        a: "This course page does not name specific networks in the catalog the way SMM names Instagram, LinkedIn, X, and YouTube. Tactics apply to the profiles you already run.",
      },
      {
        q: "Is it in the marketing bundle?",
        a: "Yes, with SEO, SEM, SMM, Search Console, and AI Tools in Digital Marketing.",
      },
    ],
    trackLinks: [
      { text: "Paid social advertising is a separate KYK course (" },
      { to: "/Blog/smm-social-media-marketing", text: "SMM — Social Media Marketing" },
      { text: "). Related search work includes " },
      { to: "/Blog/sem-search-engine-marketing", text: "SEM — Search Engine Marketing" },
      { text: " and measurement in " },
      { to: "/Blog/google-webmaster-search-console", text: "Google Webmaster & Search Console" },
      { text: ". Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/marketing", text: "Advanced Digital Marketing Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["smm-social-media-marketing", "seo-search-engine-optimization", "ai-tools-in-digital-marketing"],
  },
  "google-webmaster-search-console": {
    introHeading: "Google Search Console Training for Indexing, Performance and Core Web Vitals",
    intro:
      "This Google Search Console Course is beginner GSC Training at Knock Your Knowledge. It teaches measuring and understanding search presence in Search Console: 10 hours, five topics, and 20 videos covering GSC Overview, Performance Reports, Index Coverage, Core Web Vitals, and Sitemaps & Robots. Catalog tags are Search Console, Core Web Vitals, and Indexing. The published course fee is ₹149/- plus 18% GST at checkout. SEO fundamentals, keyword research, on-page SEO, technical SEO, and link building sit in a separate SEO course — this page is Search Console measurement, not a complete SEO implementation course.",
    whyLearn:
      "SEO changes are guesses until Search Console shows queries, pages, and coverage. This Google Search Console Training is how to read GSC — Performance Reports, Index Coverage, Core Web Vitals, sitemaps, and robots — so you can see what Google actually did. It does not replace the SEO implementation course.",
    whoFor: [
      "Beginners who have a site and need Search Console measurement, not another content or SEO implementation course",
      "SEO learners who already took the SEO course and need GSC Overview, Index Coverage, and Performance Reports",
      "Site owners who must debug Indexing and Core Web Vitals",
    ],
    topicDetails: {
      "GSC Overview":
        "GSC Overview is the first topic: set up and navigate Google Search Console so property, menus, and reports make sense. This is beginner measurement work, not SEO implementation.",
      "Performance Reports":
        "Performance Reports is the second topic. Read Search Console queries, pages, clicks, and impressions instead of only watching rank-tracker screenshots. These reports are search performance in GSC, not generic website uptime monitoring.",
      "Index Coverage":
        "Index Coverage is the third topic, matching the Indexing tag. See which URLs are indexed or excluded so you can debug search presence in Search Console.",
      "Core Web Vitals":
        "Core Web Vitals is the fourth topic and a listed tag. Use Core Web Vitals reports to find pages that struggle on real-user experience metrics.",
      "Sitemaps & Robots":
        "Sitemaps & Robots is the fifth topic. Submit sitemaps and understand robots guidance so crawlers can find what you intend to publish.",
    },
    outcomes: [
      "Navigate Google Search Console without getting lost",
      "Use Performance Reports for queries and pages",
      "Check Index Coverage when a URL is missing",
      "Read Core Web Vitals at a beginner level",
      "Work with Sitemaps & Robots as listed in the fifth topic",
    ],
    faqs: [
      {
        q: "Is this the full SEO course?",
        a: "No. SEO — Search Engine Optimization covers fundamentals, keywords, on-page, technical SEO, and links. This course is Search Console, coverage, Core Web Vitals, sitemaps, and robots.",
      },
      {
        q: "How long is it?",
        a: "10 hrs, Beginner.",
      },
      {
        q: "What tags are listed?",
        a: "Search Console, Core Web Vitals, and Indexing.",
      },
      {
        q: "Do I need a website?",
        a: "Search Console is tied to a property you verify. The course teaches GSC; it does not replace hosting or a CMS.",
      },
      {
        q: "Is it in the marketing bundle?",
        a: "Yes, with SEO, SEM, SMM, SMO, and AI Tools in Digital Marketing.",
      },
    ],
    trackLinks: [
      { text: "SEO implementation is a separate KYK course (" },
      { to: "/Blog/seo-search-engine-optimization", text: "SEO — Search Engine Optimization" },
      { text: ") covering fundamentals, keyword research, on-page SEO, technical SEO, and link building. This Google Search Console Course is measurement. Related paid search is " },
      { to: "/Blog/sem-search-engine-marketing", text: "SEM — Search Engine Marketing" },
      { text: ". Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/marketing", text: "Advanced Digital Marketing Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["seo-search-engine-optimization", "sem-search-engine-marketing", "ai-tools-in-digital-marketing"],
  },
  "ai-tools-in-digital-marketing": {
    introHeading: "AI Marketing Tools Training for Content, SEO Tools and Automation",
    intro:
      "This AI Tools in Digital Marketing Course is intermediate AI Marketing Training at Knock Your Knowledge. It is AI for Digital Marketing with the catalog tools Jasper, Surfer SEO, Canva AI, and ChatGPT: 18 hours, five topics, and 20 videos covering AI for Content, AI SEO Tools, AI Ad Creatives, Chatbot Marketing, and Automation Workflows. The published course fee is ₹149/- plus 18% GST at checkout. Those tools map onto marketing work you already do — draft, support on-page SEO, design ad variants, qualify with chatbots, and chain the logins. It is not a beginner overview, and it is not the AI-track 8 Best AI Tools for Productivity course.",
    whyLearn:
      "Marketing teams already write, optimise, design ads, and follow up. This AI Marketing Tools Training maps those jobs to Jasper, Surfer SEO, Canva AI, and ChatGPT — plus Chatbot Marketing and Automation Workflows — instead of treating AI as a generic chat window. SEO implementation stays on the separate SEO course.",
    whoFor: [
      "Intermediate marketers who already understand content, SEO, or ads",
      "Learners who want Jasper, Surfer SEO, Canva AI, and ChatGPT in a marketing frame",
      "People combining this with SEO, SEM, or SMM on the same track",
    ],
    topicDetails: {
      "AI for Content":
        "AI for Content is the first topic: draft marketing content with assistants such as Jasper and ChatGPT, then edit for brand and facts. This is marketing copy work, not a generic productivity-tools survey.",
      "AI SEO Tools":
        "AI SEO Tools is the second topic. Use AI SEO tools, including Surfer SEO as named on the course, to support on-page work — not to replace keyword strategy on the separate SEO course.",
      "AI Ad Creatives":
        "AI Ad Creatives is the third topic. Explore AI-assisted ad creatives, including Canva AI as listed, for faster visual variants you still review.",
      "Chatbot Marketing":
        "Chatbot Marketing is the fourth topic. See how chatbot marketing can answer or qualify, as a dedicated topic, not a side note.",
      "Automation Workflows":
        "Automation Workflows is the fifth topic. Chain Jasper, Surfer SEO, Canva AI, and ChatGPT into automation workflows so content, SEO, and ads are not five disconnected logins.",
    },
    outcomes: [
      "Draft marketing content with Jasper and ChatGPT, then edit it",
      "Use AI SEO Tools including Surfer SEO as a support layer",
      "Produce AI Ad Creatives variants with help from Canva AI",
      "Outline a Chatbot Marketing use at a course level",
      "Sketch an Automation Workflow across those tools",
    ],
    faqs: [
      {
        q: "Which tools are named?",
        a: "Jasper, Surfer SEO, Canva AI, and ChatGPT, in both the description and tags.",
      },
      {
        q: "How long is the course?",
        a: "18 hrs, Intermediate.",
      },
      {
        q: "Is this the same as 8 Best AI Tools for Productivity?",
        a: "No. That course is on the AI track (Notion AI, Midjourney, Runway, Perplexity, coding assistants, automation). This one is marketing-specific: content, SEO tools, ad creatives, chatbots, and workflows.",
      },
      {
        q: "Does it replace the SEO course?",
        a: "No. SEO remains the organic search course. This course adds AI SEO tools as one of five topics.",
      },
      {
        q: "Is it in the marketing bundle?",
        a: "Yes, with SEO, SEM, SMM, SMO, and Search Console.",
      },
    ],
    trackLinks: [
      { text: "This AI for Digital Marketing course does not replace " },
      { to: "/Blog/seo-search-engine-optimization", text: "SEO — Search Engine Optimization" },
      { text: ". Related paid and social work includes " },
      { to: "/Blog/sem-search-engine-marketing", text: "SEM — Search Engine Marketing" },
      { text: " and " },
      { to: "/Blog/smm-social-media-marketing", text: "SMM — Social Media Marketing" },
      { text: ". Productivity AI tools sit on a separate course (" },
      { to: "/Blog/8-best-ai-tools-for-productivity", text: "8 Best AI Tools for Productivity" },
      { text: "). Browse all " },
      { to: "/Courses", text: "internship courses" },
      { text: " or the " },
      { to: "/Bundles/marketing", text: "Advanced Digital Marketing Bundle" },
      { text: "." },
    ],
    relatedSlugs: ["seo-search-engine-optimization", "sem-search-engine-marketing", "prompt-engineering"],
  },
};

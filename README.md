# 📖 Narrative Analysis AI - @thebolarin/narrative-analysis-ai

An AI-powered narrative analysis tool that processes research articles to extract key narratives, analyze their dominance, and track their evolution. This package is built on OpenAI’s GPT models and designed for researchers, journalists, and analysts.

## 🚀 Features

✅ **AI-Powered Narrative Analysis** – Identifies key narratives in research articles.  
✅ **Dominance & Evolution Tracking** – Understands how narratives shift over time.  
✅ **Aggregated Insights** – Combines data from multiple articles for broad analysis.  
✅ **Statistical Data for Visualization** – Provides key metrics to build visual representations.  
✅ **Research Question Alignment** – Ensures analysis aligns with your research focus.  

---

## 📦 Installation

Install the package via npm:

```bash
npm install @thebolarin/narrative-analysis-ai
 ```

## 🛠 Usage

Import and use the package in your Node.js project:

```javascript
import { NarrativeAnalysis } from "@thebolarin/narrative-analysis-ai";

const openai = new OpenAI({
      organization: OPENAI_ORGANIZATION,
      project: OPENAI_PROJECT,
    });

const narrativeAnalysis = new NarrativeAnalysis(openai, preferred_gpt_model);

const researchQuestion = "How has climate change been represented in media?";
const articles = [
  {
    uniqueId: "1",
    title: "The Climate Crisis",
    summary: "The article explores global climate change trends."
  },
  {
    uniqueId: "2",
    title: "Green Energy Policies",
    summary: "Discusses global efforts to transition to renewable energy."
  }
];

async function analyze() {
  const result = await narrativeAnalysis.generateAnalysis({ researchQuestion, articles });
  console.log(result);
}

analyze();

```

## 📘 Features

- **Article Analysis**: Extracts key narratives, dominance, and evolution of narratives in a given set of articles.
- **Aggregated Analysis**: Combines findings across multiple articles to identify broader trends.
- **Statistical Insights**: Provides top 5 narratives with their prominence, useful for data visualization.
- **Overall Conclusion**: Summarizes findings in relation to the research question.


# 📌 API Methods

```javascript
generateAnalysis(researchQuestion: string, articles: Article[]): Promise<AnalysisResult>
```

Analyzes a set of articles and extracts narratives.

### Parameters:

- **`researchQuestion`** `(string)`  
  The central question guiding the analysis.

- **`articles`** `(Article[])`  
  Array of articles, each containing:
  - **`uniqueId`** `(string)`  : Unique identifier for the article.
    
  - **`title`** `(string)`  : The article’s title.
    
  - **`summary`** `(string)`  :  A brief summary of the article.
   

### Returns:
- **`Promise<AnalysisResult>`**  
  An object containing:
  - **`articleAnalysis`**  : Array of analyzed articles with their narratives.
  - **`statistics`**  : Data for visualization (top 5 narratives).
 
  - **`overallConclusion`**  : Summarized conclusion based on the research question.


### 📝  Example Response

```json
{
  "articleAnalysis": [
    {
      "uniqueId": "1",
      "title": "Global Warming and Its Effects",
      "summary": "This article discusses the impact of global warming on sea levels and agriculture.",
      "narratives": [
        {"narrative": "Rising sea levels", "details": "Sea levels are rising due to melting ice caps."}
      ],
      "dominance": [
        {"narrative": "Rising sea levels", "percentage": 60}
      ],
      "evolution": "Over time, the focus shifted from local effects to global policy changes."
    }
  ],
  "statistics": [
    {"narrative": "Climate Policy", "value": 45},
    {"narrative": "Renewable Energy", "value": 25}
  ],
  "overallConclusion": "The research shows that climate policies and renewable energy are key narratives in climate discussions."
}
```

### 🛠️ Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.


import OpenAI from "openai";

type ResearchOptions = {
    researchQuestion: string,
    articles: any[]
}

export class NarrativeAnalysis {
    constructor(
        private readonly openAI: OpenAI,
        private readonly model: string
    ) { }

    /**
     * Fetches the narrative analysis from OpenAI.
     * @param options Object containing researchQuestion and articles.
     * @returns {Promise<any>} Narrative analysis response with success, message, and data.
     */
    async generateAnalysis(options: ResearchOptions): Promise<any> {
        const { researchQuestion, articles } = options;

        try {
            // Format the articles into a readable string
            const formattedArticles = articles.map(article =>
                `UniqueId: ${article.uniqueId}\nTitle: ${article.title}\nContent: ${article.summary}`).join("\n\n");

            // Construct the prompt
            const prompt = `
        Based on the research question: ${researchQuestion}, analyze the provided articles and return the results in JSON string format with the following fields:

        articleAnalysis: An array of objects, each representing an analysis of one article. Each object should include:
        - UniqueId: The id of the article.
        - Title: The title of the article.
        - Summary: A concise and comprehensive summary of the article.
        - Narratives: A list and explanation of the main narratives presented in the article based on the research question. It should be returned as an array of objects.
        - Dominance: A description of the dominance of each narrative within the article based on the research question. It should be returned as an array of objects.
        - Evolution: An explanation of how the narrative has evolved over time, highlighting any changes in focus or perspective based on the research question. It should be a string.

        statistics: Combine the findings from all articles to provide an overall analysis to visualize the top 5 narratives on a pie chart. It should be an array of 5 objects, each containing the narrative and value with the keys in lowercase.

        overallConclusion: Summarize the findings based on the narrative analysis and use it to answer the research question. Provide feedback on how well the identified narratives address the research question and how social media platforms critically influence these narratives over time. Highlight any gaps or areas for further investigation based on the narrative trends. It should be a string.

        Ensure the results are short and concise, suitable for a social researcher to quickly understand and move on to the next article.

        These are the articles: ${formattedArticles}
      `;

            const response = await this.openAI.chat.completions.create({
                model: this.model, // Use the model from the constructor
                messages: [{ role: "system", content: prompt }],
            });

            const jsonString = response.choices[0].message?.content;
            const cleanedJsonString = jsonString.replace(/^```json\s*|\s*```$/g, '').trim();

            // Step 2: Parse the cleaned string into a JSON object
            let data;
            try {
                data = JSON.parse(cleanedJsonString);
                console.log(data); // Now you have the parsed JSON object
            } catch (error) {
                console.error("Error parsing JSON:", error);
                return {
                    success: false,
                    message: `Error: ${error.message}`,
                    data: null,
                };
            }

            return {
                success: true,
                message: "Narrative analysis generated successfully.",
                data,
            };
        } catch (error) {
            console.error("Error fetching narrative analysis:", error);
            return {
                success: false,
                message: `Error: ${error.message}`,
                data: null,
            };
        }
    }

    /**
     * Generates a summary of an article.
     * @param text The article content.
     * @returns {Promise<any>} The generated summary with success, message, and data.
     */
    async generateSummary(text: string): Promise<any> {
        try {
            const prompt = `Generate a concise and comprehensive summary that can aid narrative analysis of the article in no more than 150 words: ${text}`;
            const response = await this.openAI.chat.completions.create({
                model: this.model, // Use the model from the constructor
                messages: [{ role: "system", content: prompt }],
            });

            const summary = response.choices[0].message?.content;

            return {
                success: true,
                message: "Summary generated successfully.",
                data: summary,
            };
        } catch (error) {
            console.error("Error generating summary:", error);
            return {
                success: false,
                message: `Error: ${error.message}`,
                data: null,
            };
        }
    }

    /**
     * Extracts a keyword for querying an API based on the research question.
     * @param text The text that needs keyword extraction.
     * @returns {Promise<any>} The generated keyword with success, message, and data.
     */
    async extractKeyword(text: string): Promise<any> {
        try {
            const prompt = `Given the research question, ${text}, generate a keyword that can be used to query an API to fetch news and blog articles.`;
            const response = await this.openAI.chat.completions.create({
                model: this.model, // Use the model from the constructor
                messages: [{ role: "system", content: prompt }],
            });

            const keyword = response.choices[0].message?.content;

            // Step 1: Get the string from the 'data' field
            const jsonString = keyword;

            // Step 2: Remove the backticks and extra newlines using a regular expression
            const cleanedJsonString = jsonString.replace(/^```json\s*\n|\n```$/g, '').trim();

            // Step 3: Parse the cleaned JSON string
            let parsedData;
            try {
                parsedData = JSON.parse(cleanedJsonString);
                console.log(parsedData); // Now you have the parsed JSON object
            } catch (error) {
                throw new Error("Error parsing JSON:");
            }


            return {
                success: true,
                message: "Keyword extracted successfully.",
                data: parsedData,
            };
        } catch (error) {
            console.error("Error generating keyword:", error);
            return {
                success: false,
                message: `Error: ${error.message}`,
                data: null,
            };
        }
    }
}

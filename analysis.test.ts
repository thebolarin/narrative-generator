import { NarrativeAnalysis } from './src/analysis';

import { OpenAI } from 'openai';

const mockChatCompletionCreate = jest.fn();

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockChatCompletionCreate,
      },
    },
  })),
}));

const mockOpenAI = new OpenAI();
const model = "gpt-4";
const analysis = new NarrativeAnalysis(mockOpenAI, model);

describe('NarrativeAnalysis', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateAnalysis', () => {
        it('should return success with valid JSON response', async () => {
            const options = {
                researchQuestion: 'How does social media impact public opinion on climate change?',
                articles: [
                    {
                        uniqueId: '1',
                        title: 'Climate and Social Media',
                        summary: 'This article discusses how social media shapes climate change opinions.',
                    }
                ]
            };

            const mockJson = {
                articleAnalysis: [],
                statistics: [],
                overallConclusion: "Social media shapes opinions rapidly."
            };

            mockChatCompletionCreate.mockResolvedValue({
                choices: [{
                    message: {
                        content: `\`\`\`json\n${JSON.stringify(mockJson)}\n\`\`\``
                    }
                }]
            });

            const result = await analysis.generateAnalysis(options);
            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockJson);
        });

        it('should return failure on invalid JSON', async () => {
            mockChatCompletionCreate.mockResolvedValue({
                choices: [{
                    message: {
                        content: `\`\`\`json\n{ invalid json }\n\`\`\``
                    }
                }]
            });

            const result = await analysis.generateAnalysis({
                researchQuestion: 'Invalid Test',
                articles: []
            });

            expect(result.success).toBe(false);
            expect(result.data).toBeNull();
        });
    });

    describe('generateSummary', () => {
        it('should return summary successfully', async () => {
            const mockSummary = 'This article explains the effect of X on Y.';
            mockChatCompletionCreate.mockResolvedValue({
                choices: [{
                    message: {
                        content: mockSummary
                    }
                }]
            });

            const result = await analysis.generateSummary('Some article content');
            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockSummary);
        });
    });

    describe('extractKeyword', () => {
        it('should extract keyword successfully', async () => {
            const keyword = { keyword: 'climate change' };
            mockChatCompletionCreate.mockResolvedValue({
                choices: [{
                    message: {
                        content: `\`\`\`json\n${JSON.stringify(keyword)}\n\`\`\``
                    }
                }]
            });

            const result = await analysis.extractKeyword('What are the main climate change concerns?');
            expect(result.success).toBe(true);
            expect(result.data).toEqual(keyword);
        });

        it('should return failure on bad JSON response', async () => {
            mockChatCompletionCreate.mockResolvedValue({
                choices: [{
                    message: {
                        content: `\`\`\`json\n{ not valid }\n\`\`\``
                    }
                }]
            });

            const result = await analysis.extractKeyword('Bad response');
            expect(result.success).toBe(false);
            expect(result.data).toBeNull();
        });
    });
});

import { Agent } from '@openserv-labs/sdk'
import { z } from 'zod'
import dotenv from 'dotenv';
import { getHistoricalValuesByName, analyzeTrend, generateInsightWithOpenAI } from './financialAPI'

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.OPENSERV_API_KEY;

// Initialize the agent
const agent = new Agent({
  systemPrompt: `You are a financial assistant. You provide financial advice and analysis to users. 
  You can greet users by name, bid farewell, and analyze financial data for a given company within a date range. 
  You can help users by:
  - Analyzing financial data for a given company within a date range
  - Providing insights and trends based on financial data
  - Offering general financial advice based on the analysis`,
  apiKey: process.env.OPENSERV_API_KEY
})

agent.addCapabilities([
  {
    name: 'greet',
    description: 'Greet a user by name',
    schema: z.object({
      name: z.string().describe('The name of the user to greet')
    }),
    async run({ args }) {
      return `Hello, ${args.name}!`
    }
  },
  {
    name: 'farewell',
    description: 'Say goodbye to a user',
    schema: z.object({
      name: z.string().describe('The name of the user to bid farewell')
    }),
    async run({ args }) {
      return `Goodbye, ${args.name}!`
    }
  },
{
  name: 'analyzeFinancialData',
  description: 'Analyze financial data for a given company within a date range',
  schema: z.object({
    companyName: z.string().describe('The name of the company'),
    fromDate: z.string().describe('The start date in YYYY-MM-DD format'),
    toDate: z.string().describe('The end date in YYYY-MM-DD format')
  }),
  async run({ args }) {
    const { companyName, fromDate, toDate } = args
    try {
      const data = await getHistoricalValuesByName(companyName, fromDate, toDate)
      const trend = analyzeTrend(data)
      const insight = await generateInsightWithOpenAI(data)
      return `Trend: ${trend}, Insight: ${insight}`
    } catch (error) {
      if (error instanceof Error) {
        return `Error analyzing financial data: ${error.message}`
      } else {
        return 'An unknown error occurred'
      }
    }
  }
}
])


// Start the agent server
agent.start()
import axios from 'axios';
import {config} from 'dotenv'

// Load environment variables from .env file
config();

const BASE_URL = process.env.BASE_URL;
const ACCESS_KEY = process.env.ACCESS_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_DEPLOYMENT_NAME =process.env.AZURE_DEPLOYMENT_NAME; // e.g., gpt-40
const AZURE_API_KEY = process.env.AZURE_API_KEY; 
const AZURE_API_VERSION = process.env.AZURE_API_VERSION;


function createFinancialPromptFromData(entries: any[]): string {
    const sorted = entries.sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  
    const summary = sorted
      .map((entry) => {
        return `Date: ${entry.date}, Open: ${entry.open}, Close: ${entry.close}, High: ${entry.high}, Low: ${entry.low}, Volume: ${entry.volume}`;
      })
      .join('\n');
  
    return `Analyze the following stock performance data for financial decision-making. 
    Based on the trend, volume, and price actions, should the investor consider a "buy", 
    "sell", or "neutral" position? Provide a short justification. Only respond with the JSON 
    format without any additional text\n\n${summary}`;
  }
  


export async function generateInsightWithOpenAI(data: any): Promise<string> {
    if (!data || !data.data || data.data.length === 0) {
      throw new Error('No historical data provided.');
    }
  
    // Format the data into a prompt
    const prompt = createFinancialPromptFromData(data.data);
  
    try {
      const response = await axios.post(
        `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${AZURE_API_VERSION}`,
        {
          messages: [
            {
              role: 'system',
              content: 'You are a financial advisor analyzing historical stock data.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.5,
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': AZURE_API_KEY,
          },
        }
      );
  
      const message = response.data.choices[0].message.content.trim();
      return message;
    } catch (error: any) {
      console.error('Azure OpenAI API Error:', error.response?.data || error.message);
      throw error;
    }
  }


// Local mapping of company names to ticker symbols
const companyNameToSymbolMap: Record<string, string> = {
  'Apple Inc': 'AAPL',
  'Microsoft Corporation': 'MSFT',
  'Alphabet Inc': 'GOOGL',
  'Tesla Inc': 'TSLA',
  // Extend this as needed
};

export async function getHistoricalValuesByTicker(
  ticker: string,
  from: string,
  to: string
): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}/eod`, {
      params: {
        access_key: ACCESS_KEY,
        symbols: ticker,
        date_from: from,
        date_to: to,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${ticker}:`, error);
    throw error;
  }
}

export function getTickerList(): string[] {
  return Object.values(companyNameToSymbolMap);
}

export async function getHistoricalValuesByName(
  companyName: string,
  from: string,
  to: string
): Promise<any> {
  const ticker = companyNameToSymbolMap[companyName];
  if (!ticker) {
    throw new Error(`Ticker not found for company name: ${companyName}`);
  }

  return getHistoricalValuesByTicker(ticker, from, to);
}

export function analyzeTrend(data: any): 'buy' | 'sell' | 'neutral' {
    if (!data || !data.data || data.data.length < 2) {
      console.warn('Not enough data to analyze trend.');
      return 'neutral';
    }
  
    const sorted = data.data.sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  
    const prevClose = sorted[0].close;
    const latestClose = sorted[1].close;
  
    if (latestClose > prevClose) return 'buy';
    if (latestClose < prevClose) return 'sell';
    return 'neutral';
  }
  


// Dynamic usage
async function main() {
const companyName = process.argv[2]; // Pass company name from command line
const fromDate = process.argv[3];    // Example: '2025-03-18'
const toDate = process.argv[4];      // Example: '2025-03-19'

if (!companyName || !fromDate || !toDate) {
    console.error('Usage: ts-node script.ts "Company Name" YYYY-MM-DD YYYY-MM-DD');
    process.exit(1);
}

try {
    const data = await getHistoricalValuesByName(companyName, fromDate, toDate);
    console.log(`Historical data for ${companyName}:`, data);
    const trend = analyzeTrend(data);
    console.log(`Trend for ${companyName} between ${fromDate} and ${toDate}: ${trend.toUpperCase()}`);
    const insight = await generateInsightWithOpenAI(data);
    console.log(`Azure OpenAI Insight for ${companyName}:\n${insight}`);
} catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('An unknown error occurred.');
    }
}
}

// main();

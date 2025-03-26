# Financial Stock Advising Agent

A powerful AI agent built with the [OpenServ SDK](https://github.com/openserv-labs/sdk) that provides financial analysis and stock market insights. This agent can analyze historical stock data, identify trends, and generate AI-powered insights to help with investment decisions.

## Features

- Historical stock data analysis for major companies
- Trend identification (buy/sell/neutral signals)
- AI-powered financial insights using Azure OpenAI or OpenAI API
- Support for 100+ major companies
- Date range-based analysis
- Comprehensive financial data including open, close, high, low, and volume

## Prerequisites

- Node.js (v14 or higher)
- An OpenServ account (create one at [platform.openserv.ai](https://platform.openserv.ai))
- Market Stack API key (for stock data)
- Either Azure OpenAI API credentials or OpenAI API key (for AI insights)
- ngrok for tunneling between your local agent code and openserv agent platform

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/drecinar/agent-starter.git
cd agent-starter
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update it with your credentials:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:
```env
OPENSERV_API_KEY=your_openserv_api_key
PORT=7378

# Market Stack API Configuration
BASE_URL=https://api.marketstack.com/v2
# Get your free API key by registering at http://marketstack.com/
# The free tier includes 100 monthly requests for end-of-day data
ACCESS_KEY=your_market_stack_api_key

# Choose either Azure OpenAI or OpenAI configuration
# Option 1: Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_DEPLOYMENT_NAME=your_deployment_name
AZURE_API_KEY=your_azure_api_key
AZURE_API_VERSION=2024-02-15-preview

# Option 2: OpenAI Configuration (Alternative)
OPENAI_API_KEY=your_openai_api_key
```

### 3. Development

Start the development server:
```bash
npm run dev
```

### 4. Testing the Agent

You can test the API manually by using the command line:

```bash
# Format: ts-node src/financialAPI.ts "Company Name" YYYY-MM-DD YYYY-MM-DD
ts-node src/financialAPI.ts "Apple Inc" 2024-03-01 2024-03-26
```

Example companies you can test with:
- Apple Inc
- Microsoft Corporation
- Amazon.com Inc
- Alphabet Inc
- Meta Platforms Inc
- And many more (see the full list in `financialAPI.ts`)

## Project Structure

```
agent-starter/
├── src/
│   ├── index.ts       # Agent setup and capabilities
│   └── financialAPI.ts # Financial data processing and analysis
├── .env               # Environment variables
├── package.json       # Project dependencies
└── tsconfig.json      # TypeScript configuration
```

## Agent Capabilities

The agent provides the following capabilities:

1. **analyzeFinancialData**
   - Analyzes historical stock data for a given company
   - Parameters:
     - companyName: Name of the company
     - fromDate: Start date (YYYY-MM-DD)
     - toDate: End date (YYYY-MM-DD)
   - Returns: Trend analysis and AI-generated insights

## Local Development with Tunneling

To test your agent with the OpenServ platform during development:

1. Install ngrok:
```bash
# macOS with Homebrew
brew install ngrok

# Or download from https://ngrok.com/download
```

2. Start your agent:
```bash
npm run dev
```

3. In a new terminal, start ngrok:
```bash
ngrok http 7378
```

4. Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app`) and use it as your agent endpoint in the OpenServ platform.

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Start the dev server with hot-reload:
```bash
npm run dev
```


## API Integration Details

### Market Stack API
- Used for fetching historical stock data
- Provides EOD (End of Day) data
- Includes OHLCV (Open, High, Low, Close, Volume) data

### Azure OpenAI
- Generates AI-powered financial insights
- Analyzes trends and patterns
- Provides investment recommendations

## Error Handling

The agent includes comprehensive error handling for:
- Invalid company names
- API rate limits
- Network issues
- Data validation
- Missing environment variables



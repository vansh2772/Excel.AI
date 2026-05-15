import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { DataRow, AnalyticsData } from '../types';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || '';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface DataContext {
  data: DataRow[];
  analytics: AnalyticsData;
  fileName: string;
}

class AIService {
  private model: GenerativeModel | null = null;
  private initialized = false;

  private async initializeModel() {
    if (this.initialized) return;
    
    if (!API_KEY || API_KEY === 'your_google_ai_api_key_here' || API_KEY.trim() === '') {
      throw new Error('Google AI API key is not configured.');
    }

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
      throw new Error('Failed to initialize AI service.');
    }
  }

  async generateInsights(dataContext: DataContext): Promise<string> {
    try {
      await this.initializeModel();
    } catch {
      return this.getFallbackInsights(dataContext);
    }

    const { data, analytics, fileName } = dataContext;
    
    const prompt = `
    Analyze this dataset and provide premium-level professional insights:
    
    Dataset: ${fileName}
    Total Rows: ${analytics.totalRows}
    Total Columns: ${analytics.totalColumns}
    Numeric Columns: ${analytics.numericColumns.join(', ')}
    Text Columns: ${analytics.stringColumns.join(', ')}
    
    Sample data (first 3 rows):
    ${JSON.stringify(data.slice(0, 3), null, 2)}
    
    Statistical Summary:
    ${JSON.stringify(analytics.summary, null, 2)}
    
    Please provide:
    1. Key Executive Insights
    2. Deep Pattern Recognition
    3. Advanced Visualization Recommendations (2D & 3D)
    4. Data Quality & Integrity Audit
    5. Actionable Strategic Implications
    
    Format the response using professional markdown with a clear structure.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.getFallbackInsights(dataContext);
    }
  }

  async chatWithData(message: string, dataContext?: DataContext, chatHistory: ChatMessage[] = []): Promise<string> {
    try {
      await this.initializeModel();
    } catch {
      return this.getFallbackChatResponse(message, dataContext);
    }

    let prompt = '';
    
    if (dataContext) {
      const { data, analytics, fileName } = dataContext;
      prompt = `
      You are the Excel.AI Advanced Analyst, a professional data scientist assistant.
      
      Current Context:
      - File: ${fileName}
      - Rows: ${analytics.totalRows}
      - Columns: ${analytics.totalColumns}
      - Data Profile: ${analytics.numericColumns.length} numeric, ${analytics.stringColumns.length} categorical
      
      Sample Data Fragment:
      ${JSON.stringify(data.slice(0, 2), null, 2)}
      
      Statistical Profile:
      ${JSON.stringify(analytics.summary, null, 2)}
      
      Chat History:
      ${chatHistory.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}
      
      User Input: ${message}
      
      Provide a highly professional, expert-level response. Use bullet points and bold text where appropriate. Focus on technical accuracy and business value.
      `;
    } else {
      prompt = `
      You are the official AI representative for the Excel.AI Platform. 
      Help the user with data science questions, chart recommendations, and platform features.
      The platform features 3D visualizations, AI-driven insights, and secure Firebase storage.
      
      User Input: ${message}
      `;
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in chat:', error);
      return this.getFallbackChatResponse(message, dataContext);
    }
  }

  async recommendChartType(dataContext: DataContext, xAxis: string, yAxis: string): Promise<string> {
    try {
      await this.initializeModel();
    } catch {
      return this.getFallbackChartRecommendation(dataContext, xAxis, yAxis);
    }

    const { analytics } = dataContext;
    
    const prompt = `
    Recommend the optimal visualization for this data configuration in Excel.AI:
    
    X-Axis: ${xAxis} (Type: ${analytics.numericColumns.includes(xAxis) ? 'Numeric' : 'Categorical'})
    Y-Axis: ${yAxis} (Type: ${analytics.numericColumns.includes(yAxis) ? 'Numeric' : 'Categorical'})
    
    Available Engines:
    - 2D: Bar, Line, Pie, Scatter, Area (Chart.js)
    - 3D: 3D Bar, 3D Scatter (WebGL/Three.js)
    
    Pick the absolute best one and explain the professional rationale in 2-3 sentences.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error recommending chart:', error);
      return this.getFallbackChartRecommendation(dataContext, xAxis, yAxis);
    }
  }

  private getFallbackInsights(dataContext: DataContext): string {
    const { analytics, fileName } = dataContext;
    
    return `### ✨ **Excel.AI Advanced Insights: ${fileName}**
\n---
\n**📈 Executive Overview:**
- **Record Volume:** ${analytics.totalRows.toLocaleString()} entries processed
- **Dimensionality:** ${analytics.totalColumns} unique data columns
- **Data Composition:** ${analytics.numericColumns.length} quantitative / ${analytics.stringColumns.length} qualitative fields
\n**🔍 Preliminary Patterns:**
${analytics.numericColumns.length > 0 ? `• **Quantitative Density**: Detected significant numeric signals in ${analytics.numericColumns.join(', ')}. Perfect for multi-variable regression or trend analysis.` : ''}
${analytics.stringColumns.length > 0 ? `• **Categorical Diversity**: High-granularity segments found in ${analytics.stringColumns.join(', ')}.` : ''}
\n**🚀 Recommended Visualizations:**
${analytics.numericColumns.length > 0 && analytics.stringColumns.length > 0 ? 
  '• **3D Bar Engine**: Contrast categories against quantitative metrics.\n• **Trend Analysis**: Use Line charts for sequence-based data.' :
  '• **Scatter Matrix**: Perfect for multi-dimensional numeric exploration.'
}
\n**💡 Strategic Recommendation:**
Pick a primary metric from ${analytics.numericColumns[0] || 'your columns'} and cross-analyze against categories to identify hidden efficiency gaps.
\n> *Connect your Google AI API Key for Deep Strategic Analysis.*`;
  }

  private getFallbackChatResponse(message: string, dataContext?: DataContext): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('chart') || lowerMessage.includes('visual')) {
      return `**Excel.AI Visualization Engine Recommendations:**
\n• **3D bar / 3D Scatter**: Best for "wow factor" presentations and identifying clusters in 3D space.
• **Line / Area**: Ideal for temporal data or cumulative trends.
• **Scatter Plots**: The gold standard for identifying correlations.
\n${dataContext ? `For your dataset "${dataContext.fileName}", I recommend starting with a **Bar Chart** using \`${dataContext.analytics.stringColumns[0]}\` and \`${dataContext.analytics.numericColumns[0]}\`.` : ''}
\n*Configure your AI API key to unlock real-time predictive charting.*`;
    }
    
    return `Welcome to **Excel.AI Professional**. I am your dedicated data assistant. 
\nI can help you with:
• **Technical Audit**: Analyzing your data structure and quality.
• **Visualization Strategy**: Choosing the best 2D or 3D engine for your metrics.
• **Platform Guidance**: Navigating your secure Firebase storage and admin controls.
\n${dataContext ? `Ready to analyze **${dataContext.fileName}** (${dataContext.analytics.totalRows} rows).` : 'Please upload a dataset to begin the deep analysis session.'}
\n*Note: Full AI reasoning is currently in sandbox mode. Add your API key for the full experience.*`;
  }

  private getFallbackChartRecommendation(dataContext: DataContext, xAxis: string, yAxis: string): string {
    const { analytics } = dataContext;
    const xIsNumeric = analytics.numericColumns.includes(xAxis);
    const yIsNumeric = analytics.numericColumns.includes(yAxis);
    
    if (xIsNumeric && yIsNumeric) {
      return `**Optimal Visualization: 3D Scatter Plot**\n\nDual numeric variables are best explored in a 3D space to identify clusters and outliers that traditional 2D plots might miss. Use the **3D Engine** for a deeper perspective.`;
    }
    
    return `**Optimal Visualization: 3D Bar Chart**\n\nTo effectively communicate magnitude across categories like ${xAxis}, the **Excel.AI 3D Bar Engine** provides a premium, high-impact visualization that stands out in reports and dashboards.`;
  }

  isConfigured(): boolean {
    return !!(API_KEY && API_KEY !== 'your_google_ai_api_key_here' && API_KEY.trim() !== '');
  }
}

export const aiService = new AIService();
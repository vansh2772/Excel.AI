import { GoogleGenerativeAI } from '@google/generative-ai';
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
  private model: any = null;
  private initialized = false;

  private async initializeModel() {
    if (this.initialized) return;
    
    if (!API_KEY || API_KEY === 'your_google_ai_api_key_here') {
      throw new Error('Google AI API key is not configured. Please add VITE_GOOGLE_AI_API_KEY to your environment variables.');
    }

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
      throw new Error('Failed to initialize AI service. Please check your API key.');
    }
  }

  async generateInsights(dataContext: DataContext): Promise<string> {
    try {
      await this.initializeModel();
    } catch (error) {
      return this.getFallbackInsights(dataContext);
    }

    const { data, analytics, fileName } = dataContext;
    
    const prompt = `
    Analyze this dataset and provide key insights:
    
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
    1. Key insights about the data
    2. Interesting patterns or trends
    3. Recommended visualizations
    4. Potential data quality issues
    5. Business implications
    
    Keep the response concise and actionable.
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
    } catch (error) {
      return this.getFallbackChatResponse(message, dataContext);
    }

    let prompt = '';
    
    if (dataContext) {
      const { data, analytics, fileName } = dataContext;
      prompt = `
      You are an AI assistant helping users analyze their Excel/CSV data. 
      
      Current Dataset Context:
      - File: ${fileName}
      - Rows: ${analytics.totalRows}
      - Columns: ${analytics.totalColumns}
      - Numeric Columns: ${analytics.numericColumns.join(', ')}
      - Text Columns: ${analytics.stringColumns.join(', ')}
      
      Sample Data:
      ${JSON.stringify(data.slice(0, 2), null, 2)}
      
      Statistical Summary:
      ${JSON.stringify(analytics.summary, null, 2)}
      
      Previous conversation:
      ${chatHistory.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}
      
      User Question: ${message}
      
      Please provide helpful, specific advice about their data analysis, visualization recommendations, or answer their questions about the dataset. Be concise and actionable.
      `;
    } else {
      prompt = `
      You are an AI assistant for an Excel Analytics Platform. Help users with:
      - Data analysis questions
      - Chart and visualization recommendations
      - Excel/CSV data interpretation
      - Platform features and usage
      
      Previous conversation:
      ${chatHistory.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}
      
      User Question: ${message}
      
      Provide helpful, concise responses about data analysis and the platform.
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
    } catch (error) {
      return this.getFallbackChartRecommendation(dataContext, xAxis, yAxis);
    }

    const { analytics } = dataContext;
    
    const prompt = `
    Based on this data analysis context, recommend the best chart type:
    
    X-Axis: ${xAxis} (Type: ${analytics.numericColumns.includes(xAxis) ? 'Numeric' : 'Categorical'})
    Y-Axis: ${yAxis} (Type: ${analytics.numericColumns.includes(yAxis) ? 'Numeric' : 'Categorical'})
    
    Dataset Info:
    - Total Rows: ${analytics.totalRows}
    - Numeric Columns: ${analytics.numericColumns.join(', ')}
    - Text Columns: ${analytics.stringColumns.join(', ')}
    
    Available chart types: bar, line, pie, scatter, area, 3d-bar, 3d-scatter
    
    Recommend the best chart type and explain why in 2-3 sentences.
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
    
    return `📊 **Dataset Analysis: ${fileName}**

**Overview:**
- Total Records: ${analytics.totalRows.toLocaleString()}
- Columns: ${analytics.totalColumns}
- Numeric Fields: ${analytics.numericColumns.length}
- Text Fields: ${analytics.stringColumns.length}

**Key Insights:**
${analytics.numericColumns.length > 0 ? `
• **Numeric Data Available**: You have ${analytics.numericColumns.length} numeric columns (${analytics.numericColumns.join(', ')}) perfect for statistical analysis and trend visualization.` : ''}

${analytics.stringColumns.length > 0 ? `
• **Categorical Data**: ${analytics.stringColumns.length} text columns (${analytics.stringColumns.join(', ')}) ideal for grouping and classification analysis.` : ''}

**Recommended Visualizations:**
${analytics.numericColumns.length > 0 && analytics.stringColumns.length > 0 ? 
  '• Bar charts for comparing categories\n• Line charts for trends over time\n• Scatter plots for correlation analysis' :
  analytics.numericColumns.length > 0 ? 
    '• Histograms for distribution analysis\n• Box plots for statistical summaries' :
    '• Pie charts for category distribution\n• Bar charts for frequency analysis'
}

**Next Steps:**
1. Select your X and Y axes for visualization
2. Try different chart types to explore patterns
3. Use the AI chat for specific questions about your data

*Note: AI insights are limited without API configuration. Configure VITE_GOOGLE_AI_API_KEY for enhanced analysis.*`;
  }

  private getFallbackChatResponse(message: string, dataContext?: DataContext): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('chart') || lowerMessage.includes('visualization')) {
      return `For chart recommendations, I suggest:

${dataContext ? `Based on your dataset "${dataContext.fileName}":` : 'General recommendations:'}

• **Bar Charts**: Great for comparing categories
• **Line Charts**: Perfect for showing trends over time
• **Pie Charts**: Ideal for showing proportions
• **Scatter Plots**: Excellent for correlation analysis

${dataContext ? `Your data has ${dataContext.analytics.numericColumns.length} numeric and ${dataContext.analytics.stringColumns.length} text columns, which gives you many visualization options.` : ''}

Try different chart types with your data to discover insights!

*Note: Enhanced AI responses require Google AI API configuration.*`;
    }
    
    if (lowerMessage.includes('data') || lowerMessage.includes('analysis')) {
      return `Here are some data analysis tips:

1. **Start with Overview**: Check data types, missing values, and basic statistics
2. **Explore Patterns**: Look for trends, outliers, and correlations
3. **Visualize**: Create charts to reveal hidden insights
4. **Ask Questions**: What story does your data tell?

${dataContext ? `Your current dataset has ${dataContext.analytics.totalRows} rows and ${dataContext.analytics.totalColumns} columns - plenty to explore!` : 'Upload your data to get specific insights!'}

*Note: For detailed AI analysis, please configure your Google AI API key.*`;
    }
    
    return `I'm here to help with your data analysis! While my AI capabilities are limited without API configuration, I can still assist with:

• Chart type recommendations
• Data visualization best practices
• Platform feature guidance
• General analysis tips

${dataContext ? `Your dataset "${dataContext.fileName}" is loaded and ready for analysis.` : 'Upload your Excel or CSV files to get started!'}

For enhanced AI insights, please configure VITE_GOOGLE_AI_API_KEY in your environment.`;
  }

  private getFallbackChartRecommendation(dataContext: DataContext, xAxis: string, yAxis: string): string {
    const { analytics } = dataContext;
    const xIsNumeric = analytics.numericColumns.includes(xAxis);
    const yIsNumeric = analytics.numericColumns.includes(yAxis);
    
    if (xIsNumeric && yIsNumeric) {
      return `**Recommended: Scatter Plot**

Since both ${xAxis} and ${yAxis} are numeric, a scatter plot would be perfect to show the correlation between these variables. You could also consider a line chart if there's a time component.`;
    }
    
    if (!xIsNumeric && yIsNumeric) {
      return `**Recommended: Bar Chart**

With ${xAxis} as categories and ${yAxis} as numeric values, a bar chart is ideal for comparing values across different categories. This will clearly show which categories have higher or lower values.`;
    }
    
    if (!xIsNumeric && !yIsNumeric) {
      return `**Recommended: Pie Chart or Bar Chart**

Since both fields are categorical, consider a pie chart to show proportions or a bar chart to compare frequencies. The choice depends on whether you want to emphasize parts of a whole (pie) or direct comparison (bar).`;
    }
    
    return `**Recommended: Line Chart or Bar Chart**

Based on your data types, either visualization could work well. Try both to see which reveals more insights about your data patterns.

*Note: Enhanced AI recommendations require Google AI API configuration.*`;
  }

  // Check if AI service is properly configured
  isConfigured(): boolean {
    return !!(API_KEY && API_KEY !== 'your_google_ai_api_key_here' && API_KEY.trim() !== '');
  }
}

export const aiService = new AIService();
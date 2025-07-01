import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { aiService, DataContext } from '../../services/aiService';
import { ChartConfig } from '../../types';
import { Sparkles, BarChart3, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface SmartChartRecommendationsProps {
  dataContext: DataContext;
  selectedXAxis: string;
  selectedYAxis: string;
  onApplyRecommendation: (config: Partial<ChartConfig>) => void;
}

export const SmartChartRecommendations: React.FC<SmartChartRecommendationsProps> = ({
  dataContext,
  selectedXAxis,
  selectedYAxis,
  onApplyRecommendation
}) => {
  const [recommendation, setRecommendation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendation = async () => {
    if (!selectedXAxis || !selectedYAxis) {
      toast.error('Please select both X and Y axes first');
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiService.recommendChartType(dataContext, selectedXAxis, selectedYAxis);
      setRecommendation(result);
    } catch (error) {
      toast.error('Failed to get chart recommendation');
    } finally {
      setIsLoading(false);
    }
  };

  const applySmartConfig = () => {
    // Extract chart type from recommendation (simple parsing)
    const lowerRec = recommendation.toLowerCase();
    let recommendedType: ChartConfig['type'] = 'bar';
    
    if (lowerRec.includes('scatter')) recommendedType = 'scatter';
    else if (lowerRec.includes('line')) recommendedType = 'line';
    else if (lowerRec.includes('pie')) recommendedType = 'pie';
    else if (lowerRec.includes('area')) recommendedType = 'area';
    else if (lowerRec.includes('3d')) recommendedType = '3d-bar';

    onApplyRecommendation({
      type: recommendedType,
      title: `AI Recommended: ${selectedXAxis} vs ${selectedYAxis}`
    });

    toast.success('Applied AI recommendation!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span>AI Chart Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Get AI-powered chart type recommendations based on your data
            </p>
            <Button
              onClick={getRecommendation}
              disabled={isLoading || !selectedXAxis || !selectedYAxis}
              size="sm"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Get Recommendation
                </>
              )}
            </Button>
          </div>

          {recommendation && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-purple-900 mb-2">AI Recommendation</h4>
                  <p className="text-sm text-purple-800 whitespace-pre-wrap">{recommendation}</p>
                  <Button
                    onClick={applySmartConfig}
                    size="sm"
                    className="mt-3"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Apply Recommendation
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!selectedXAxis || !selectedYAxis ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">
                Select X and Y axes to get AI recommendations
              </p>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  category: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  showFeedback?: boolean;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  category,
  isExpanded = false,
  onToggle,
  showFeedback = true
}) => {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'getting-started': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'features': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'analytics': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'security': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'customization': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'user-management': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'monitoring': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'billing': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'knowledge-base': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'troubleshooting': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Question Header */}
          <div 
            className="flex items-start justify-between cursor-pointer group"
            onClick={onToggle}
          >
            <div className="flex items-start gap-3 flex-1">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="flex items-start gap-2 flex-wrap">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                    {question}
                  </h3>
                  <Badge className={`text-xs ${getCategoryColor(category)}`}>
                    {category.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="ml-2"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Answer Content */}
          {isExpanded && (
            <div className="ml-8 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {answer}
              </p>
              
              {/* Feedback Section */}
              {showFeedback && (
                <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500">Was this helpful?</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={feedback === 'helpful' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeedback('helpful')}
                      className="h-7 px-2 text-xs"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Yes
                    </Button>
                    <Button
                      variant={feedback === 'not-helpful' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFeedback('not-helpful')}
                      className="h-7 px-2 text-xs"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      No
                    </Button>
                  </div>
                  {feedback && (
                    <span className="text-xs text-green-600">
                      Thank you for your feedback!
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FAQItem;

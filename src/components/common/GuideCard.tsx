import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Video,
  Download
} from 'lucide-react';

interface GuideCardProps {
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: React.ComponentType<{ className?: string }>;
  isVideo?: boolean;
  isDownloadable?: boolean;
  completed?: boolean;
  onClick?: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({
  title,
  description,
  duration,
  difficulty,
  icon: Icon,
  isVideo = false,
  isDownloadable = false,
  completed = false,
  onClick
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden"
      onClick={onClick}
    >
      {completed && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-green-500 rounded-full p-1">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${completed ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
              <Icon className={`h-5 w-5 ${completed ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <div className="flex gap-2">
              {isVideo && (
                <Badge variant="outline" className="text-xs">
                  <Video className="h-3 w-3 mr-1" />
                  Video
                </Badge>
              )}
              {isDownloadable && (
                <Badge variant="outline" className="text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  PDF
                </Badge>
              )}
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <h3 className={`font-semibold group-hover:text-blue-600 transition-colors ${completed ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-100'}`}>
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{duration}</span>
            </div>
            <Badge className={`text-xs ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuideCard;

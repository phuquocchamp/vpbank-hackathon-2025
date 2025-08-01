import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Clock, 
  ArrowRight,
  Zap,
  DollarSign,
  BarChart3,
  Eye,
  Play,
  MessageSquare
} from 'lucide-react';

interface HelpSupportProps {
  userType: 'admin' | 'client';
  className?: string;
}

interface GuideItem {
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  isVideo?: boolean;
}

const HelpSupport: React.FC<HelpSupportProps> = ({ userType, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Dynamic content based on user type
  const getContent = () => {
    if (userType === 'admin') {
      return {
        title: 'Admin Usage Guide',
        subtitle: 'Master your administrative tools and system management',
        guides: [
          {
            title: 'Admin Dashboard Navigation',
            description: 'Master the admin dashboard interface, understand key metrics, monitor system health, and interpret analytics charts',
            duration: '8 min',
            difficulty: 'Beginner' as const,
            icon: BarChart3,
            path: '/admin/help/dashboard-navigation'
          },
          {
            title: 'AI Conversation Management',
            description: 'Create, manage, and organize AI conversations. Execute SQL queries, download results, and track conversation history',
            duration: '10 min',
            difficulty: 'Intermediate' as const,
            icon: MessageSquare,
            path: '/admin/help/conversation-management',
            isVideo: true
          },
          {
            title: 'System Logs & Monitoring',
            description: 'Monitor system health, analyze logs, filter error messages, and troubleshoot system issues effectively',
            duration: '15 min',
            difficulty: 'Intermediate' as const,
            icon: Eye,
            path: '/admin/help/system-logs',
            isVideo: true
          },
          {
            title: 'Billing Analytics & Cost Management',
            description: 'Track usage costs, analyze billing trends, monitor financial performance, and optimize resource allocation',
            duration: '12 min',
            difficulty: 'Intermediate' as const,
            icon: DollarSign,
            path: '/admin/help/billing-analytics'
          }
        ] as GuideItem[]
      };
    } else {
      return {
        title: 'VPBank Usage Guide',
        subtitle: 'Master your VPBank AI assistant and banking tools',
        guides: [
          {
            title: 'Getting Started with AI Conversations',
            description: 'Learn how to interact with your AI assistant, ask effective questions, and get personalized banking insights',
            duration: '6 min',
            difficulty: 'Beginner' as const,
            icon: Zap,
            path: '/client/help/conversation-basics',
            isVideo: true
          },
          {
            title: 'Dashboard Overview & Navigation',
            description: 'Master your personal dashboard, understand task tracking, and monitor your daily banking activities',
            duration: '8 min',
            difficulty: 'Beginner' as const,
            icon: BarChart3,
            path: '/client/help/dashboard-overview'
          }
        ] as GuideItem[]
      };
    }
  };

  const content = getContent();

  // Filter guides based on search query
  const filteredGuides = content.guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleGuideClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {content.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* Main Content - Guides Only */}
      <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">How to Use the Application</h2>
          <Badge variant="outline" className="text-xs">Step-by-step guides</Badge>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => handleGuideClick(guide.path)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <guide.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      {guide.isVideo && (
                        <Badge variant="outline" className="text-xs">
                          <Play className="h-3 w-3 mr-1" />
                          Video
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{guide.duration}</span>
                      </div>
                      <Badge className={`text-xs ${getDifficultyColor(guide.difficulty)}`}>
                        {guide.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No guides found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search terms to find relevant guides
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpSupport;

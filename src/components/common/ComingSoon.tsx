import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles, Zap, Star } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  expectedDate?: string;
}

const ComingSoon = ({ 
  title, 
  subtitle = "Exciting features coming your way", 
  description = "We're working hard to bring you amazing new features. Stay tuned for updates!",
  features = [],
  expectedDate = "Q1 2025"
}: ComingSoonProps) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Background Card with Gradient */}
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
          <CardContent className="p-0">
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-0 min-h-[500px] lg:min-h-[600px]">
              {/* Left Content */}
              <div className="flex flex-col justify-center p-8 lg:p-12 space-y-6 order-2 lg:order-1 lg:col-span-3">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
                    <Clock className="w-3 h-3 mr-2" />
                    Coming Soon
                  </Badge>
                  <Badge variant="outline" className="border-indigo-200 text-indigo-600">
                    {expectedDate}
                  </Badge>
                </div>

                {/* Main Title */}
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                    {title}
                  </h1>
                  <h2 className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 font-medium">
                    {subtitle}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {description}
                </p>

                {/* Features List */}
                {features.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      What to expect:
                    </h3>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                    <Star className="w-4 h-4 mr-2" />
                    Get Notified
                  </Button>
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-all duration-200">
                    <Zap className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative overflow-hidden order-1 lg:order-2 lg:col-span-2 h-[300px] lg:h-auto">
                {/* Very subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-600/5 z-10"></div>
                <img 
                  src="/comming-soon.png" 
                  alt="Coming Soon" 
                  className="w-full h-full object-cover bg-gradient-to-br from-gray-50 to-gray-100"
                />
                
                {/* Floating Elements - positioned better */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-yellow-500" />
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-800">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      In Development
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">🚀</div>
              <div className="text-sm font-medium text-gray-800">Innovation</div>
              <div className="text-xs text-gray-600">Cutting-edge technology</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">✨</div>
              <div className="text-sm font-medium text-gray-800">Quality</div>
              <div className="text-xs text-gray-600">Premium experience</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">⚡</div>
              <div className="text-sm font-medium text-gray-800">Performance</div>
              <div className="text-xs text-gray-600">Lightning fast</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HelpSupport from '@/components/common/HelpSupport';
import { Monitor, User, Eye, EyeOff } from 'lucide-react';

const HelpSupportDemo = () => {
  const [currentUserType, setCurrentUserType] = useState<'admin' | 'client'>('admin');
  const [previewMode, setPreviewMode] = useState(false);

  const toggleUserType = () => {
    setCurrentUserType(prev => prev === 'admin' ? 'client' : 'admin');
  };

  const togglePreviewMode = () => {
    setPreviewMode(prev => !prev);
  };

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          {/* Preview Controls */}
          <div className="fixed top-4 right-4 z-50 flex gap-2">
            <Button
              onClick={toggleUserType}
              variant="outline"
              size="sm"
              className="bg-white dark:bg-gray-800 shadow-lg"
            >
              {currentUserType === 'admin' ? <Monitor className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
              {currentUserType === 'admin' ? 'Admin View' : 'Client View'}
            </Button>
            <Button
              onClick={togglePreviewMode}
              variant="outline"
              size="sm"
              className="bg-white dark:bg-gray-800 shadow-lg"
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Exit Preview
            </Button>
          </div>

          {/* Full Help Support Component */}
          <HelpSupport userType={currentUserType} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Demo Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Application Guide System Demo
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A focused guide system that teaches users how to effectively use the VPBank application. 
          Features role-based content, step-by-step tutorials, and practical learning approaches.
        </p>
      </div>

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Demo Controls</h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                Current: {currentUserType === 'admin' ? 'Admin' : 'Client'} View
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={toggleUserType}
              variant={currentUserType === 'admin' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              Switch to {currentUserType === 'admin' ? 'Client' : 'Admin'} View
            </Button>
            <Button
              onClick={togglePreviewMode}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Full Preview Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Educational Focus",
                description: "Step-by-step guides that teach practical application usage",
                color: "blue"
              },
              {
                title: "Search & Discovery",
                description: "Fast search across all guides and tutorials for quick learning",
                color: "green"
              },
              {
                title: "Role-Based Learning",
                description: "Different practical guides for admin system management vs client banking",
                color: "purple"
              },
              {
                title: "Interactive Tutorials",
                description: "Video guides and visual learning aids for better comprehension",
                color: "orange"
              },
              {
                title: "Progressive Difficulty",
                description: "Clear progression from beginner to advanced usage scenarios",
                color: "pink"
              },
              {
                title: "Responsive Design",
                description: "Perfect learning experience across desktop, tablet, and mobile",
                color: "indigo"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900 rounded-lg flex items-center justify-center`}>
                      <div className={`w-6 h-6 bg-${feature.color}-500 rounded`}></div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Live Component Preview</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {currentUserType === 'admin' ? 'Admin' : 'Client'} View
                  </Badge>
                  <Button
                    onClick={toggleUserType}
                    size="sm"
                    variant="outline"
                  >
                    Switch View
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <HelpSupport userType={currentUserType} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpSupportDemo;

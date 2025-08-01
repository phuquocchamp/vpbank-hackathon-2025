import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useHeader } from '@/contexts/HeaderContext';
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Bot, 
  Database,
  Download,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Play,
  Search
} from 'lucide-react';

const ConversationBasicsGuide = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'Conversation Basics Guide',
      description: 'Get started with AI conversations and smart assistance',
      badge: (
        <Badge variant="outline" className="text-xs">
          <MessageSquare className="size-3 mr-1" />
          Getting Started
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo]);

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Getting Started with AI Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Welcome to your AI-powered assistant! This guide will help you start meaningful conversations, 
            ask effective questions, and get the most out of your AI interactions. Whether you need data analysis, 
            insights, or general assistance, this guide covers everything you need to know.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Quick Start</span>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Navigate to "Conversations" in the sidebar or click "New Chat" to start your first 
              AI conversation immediately.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Starting Your First Conversation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Starting Your First Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Creating and beginning conversations is simple and intuitive:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Creating New Conversations</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Click the "New Chat" button in the sidebar to create a fresh conversation. 
                  Each new conversation starts with a clean slate and full context.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Conversation Organization</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Conversations are automatically titled based on their content and saved in your history. 
                  You can access any previous conversation from the sidebar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                <Bot className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">AI Assistant Introduction</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your AI assistant is ready to help with banking queries, data analysis, 
                  and general assistance. It can understand natural language and provide detailed responses.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/50 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900 dark:text-green-100">First Message Ideas</span>
            </div>
            <ul className="text-green-800 dark:text-green-200 text-sm space-y-1">
              <li>• "Hello! Can you help me understand my account information?"</li>
              <li>• "I need to analyze some customer data patterns"</li>
              <li>• "What banking services are available to me?"</li>
              <li>• "Can you help me with a data query?"</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Effective Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-600" />
            Communicating Effectively with AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Get better results by communicating clearly and effectively with your AI assistant:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Use Natural Language</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Speak to the AI as you would to a helpful colleague. Use complete sentences 
                  and provide context for your requests.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Be Specific About Your Needs</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The more specific you are, the better the AI can help. Include details about 
                  what type of information or analysis you're looking for.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Ask Follow-up Questions</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Don't hesitate to ask for clarification or additional information. 
                  The AI maintains conversation context and can build on previous responses.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">✅ Good Examples</h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• "Show me customer transaction patterns for the last month"</li>
                <li>• "Help me understand account balance trends"</li>
                <li>• "Can you analyze our deposit data by region?"</li>
              </ul>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">❌ Avoid These</h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Single word requests like "data" or "help"</li>
                <li>• Overly technical jargon without context</li>
                <li>• Multiple unrelated questions in one message</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Understanding AI Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            Understanding AI Responses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Learn to interpret and make the most of AI responses:
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Response Types</h4>
              <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Direct answers and explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Executable SQL queries for data analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Step-by-step guidance and instructions</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Message Layout</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Your messages appear on the right with your user icon</li>
                <li>• AI responses appear on the left with the assistant avatar</li>
                <li>• Timestamps show when each message was sent</li>
                <li>• Special query buttons appear for executable SQL commands</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-600" />
            Interactive Features and SQL Queries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your AI assistant can generate and execute SQL queries to provide real data insights:
          </p>

          <div className="grid gap-4">
            {/* Query Execution */}
            <div className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg">
                <Play className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">SQL Query Execution</h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                  When the AI provides SQL queries, you'll see an "Execute Query" button. 
                  Click it to run the query and see real data results.
                </p>
              </div>
            </div>

            {/* Results Display */}
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">Results Display</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Query results appear in structured tables directly in your conversation, 
                  making it easy to review and analyze the data.
                </p>
              </div>
            </div>

            {/* Download Options */}
            <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/50 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                <Download className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Download Results</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Export query results as Excel files for further analysis, reporting, 
                  or sharing with colleagues.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/50 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-5 w-5 text-indigo-600" />
              <span className="font-medium text-indigo-900 dark:text-indigo-100">Data Access</span>
            </div>
            <p className="text-indigo-800 dark:text-indigo-200 text-sm">
              The AI can access your organization's data to provide real insights and analysis. 
              All queries are secure and respect your data access permissions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-teal-600" />
            Managing Your Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Keep your conversations organized and easily accessible:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Access all conversations from the sidebar history</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Conversations are automatically saved and titled</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Continue previous conversations with full context</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Edit conversation titles for better organization</span>
            </div>
          </div>

          <Separator />

          <div className="bg-teal-50 dark:bg-teal-950/50 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
            <h4 className="font-medium text-teal-900 dark:text-teal-100 mb-2">Organization Tips</h4>
            <ul className="space-y-1 text-sm text-teal-700 dark:text-teal-300">
              <li>• Create separate conversations for different projects or topics</li>
              <li>• Use descriptive first messages to help with automatic titling</li>
              <li>• Keep related queries in the same conversation for context</li>
              <li>• Review conversation history to track your data analysis progress</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Troubleshooting Common Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Solutions for common conversation and query issues:
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Message Delivery Issues</h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Check your internet connection if messages don't send</li>
                <li>• Refresh the page if conversations fail to load</li>
                <li>• Try logging out and back in if you see authentication errors</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/50 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Query Execution Problems</h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                <li>• Wait for loading indicators to complete before trying again</li>
                <li>• Check error messages for specific query issues</li>
                <li>• Rephrase your request if the AI doesn't understand</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Improving AI Responses</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Provide more context if responses are too general</li>
                <li>• Ask follow-up questions to clarify or expand on answers</li>
                <li>• Break complex requests into smaller, specific questions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Plus className="h-5 w-5 text-green-600" />
              <span className="text-sm">Start your first conversation and explore AI capabilities</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Database className="h-5 w-5 text-indigo-600" />
              <span className="text-sm">Try executing SQL queries to analyze your data</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Practice effective communication techniques</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationBasicsGuide;

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
  History,
  Edit,
  Trash2,
  Database,
  Download,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Play
} from 'lucide-react';

const ConversationManagementGuide = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'Conversation Management Guide',
      description: 'Master AI conversations and SQL query execution',
      badge: (
        <Badge variant="outline" className="text-xs">
          <MessageSquare className="size-3 mr-1" />
          Conversation Guide
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
            AI Conversation Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The conversation system allows you to interact with AI assistants, execute SQL queries, 
            and manage chat history. This guide covers everything from starting conversations to 
            executing database queries and managing your chat history.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Quick Start</span>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Click "New Chat" in the sidebar or navigate to an existing conversation to start 
              interacting with the AI assistant.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Starting New Conversations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Starting New Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Create new conversations to organize different topics or tasks:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Creating a New Chat</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Click the "New Chat" button in the sidebar to create a fresh conversation. 
                  You'll be automatically redirected to the new conversation page.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <Edit className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Conversation Titles</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Conversations are automatically titled based on their content. You can edit titles 
                  by using the edit option in the conversation menu.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/50 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900 dark:text-green-100">Organization Tip</span>
            </div>
            <p className="text-green-800 dark:text-green-200 text-sm">
              Create separate conversations for different topics (e.g., data analysis, 
              customer queries, system monitoring) to keep your work organized.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sending Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-600" />
            Sending Messages and Interacting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Communicate effectively with the AI assistant using natural language:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Message Input</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Type your message in the input field at the bottom of the conversation. 
                  Press Enter or click the send button to submit your message.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">AI Responses</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The AI assistant will respond with helpful information, suggestions, 
                  or executable SQL queries based on your requests.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Message Status</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor message delivery status and see when the AI is processing your request 
                  through loading indicators and timestamps.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Effective Communication Tips</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• Be specific about what data or information you need</li>
              <li>• Provide context for complex queries or analysis requests</li>
              <li>• Ask follow-up questions to refine results</li>
              <li>• Use clear, natural language - no need for technical SQL syntax</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* SQL Query Execution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-600" />
            SQL Query Execution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Execute SQL queries generated by the AI assistant and download results:
          </p>

          <div className="grid gap-4">
            {/* Query Execution */}
            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                <Play className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Execute Queries</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  When the AI provides SQL queries, you'll see an "Execute Query" button. 
                  Click it to run the query against the specified database.
                </p>
              </div>
            </div>

            {/* Query Results */}
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">View Results</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Query results are displayed in a structured table format directly in the conversation. 
                  You can scroll through large result sets.
                </p>
              </div>
            </div>

            {/* Download Results */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Download Data</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Click the download button to export query results as Excel files (.xlsx) 
                  for further analysis or reporting.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span className="font-medium text-amber-900 dark:text-amber-100">Query Safety</span>
            </div>
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              All SQL queries are executed in a controlled environment. However, review queries 
              before execution to ensure they match your intended analysis requirements.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Conversation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600" />
            Managing Conversation History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Access and manage your conversation history through the sidebar:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Sidebar Navigation</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  All your conversations are listed in the sidebar under "Conversation History". 
                  Click any conversation to continue where you left off.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Conversation Titles</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Conversations display meaningful titles based on their content. 
                  Recent conversations appear at the top of the list.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Context Preservation</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Each conversation maintains its full context, including previous messages, 
                  query results, and conversation flow.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-orange-600" />
            Conversation Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Manage individual conversations with various actions:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/50 rounded-lg border">
              <Edit className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-orange-900 dark:text-orange-100">Edit Title</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Rename conversations to better reflect their content or purpose
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/50 rounded-lg border">
              <Trash2 className="h-5 w-5 text-red-600" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100">Delete Conversation</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Remove conversations that are no longer needed (action cannot be undone)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/50 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-900 dark:text-orange-100">Action Menu Access</span>
            </div>
            <p className="text-orange-800 dark:text-orange-200 text-sm">
              Access conversation actions through the menu (three dots) next to each conversation 
              in the sidebar, or use the header options when viewing a conversation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Message Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-teal-600" />
            Message Features and Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Understanding different message types and their capabilities:
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-teal-50 dark:bg-teal-950/50 rounded-lg border border-teal-200 dark:border-teal-800">
              <h4 className="font-medium text-teal-900 dark:text-teal-100 mb-2">User Messages</h4>
              <p className="text-sm text-teal-700 dark:text-teal-300">
                Your questions, requests, and instructions to the AI assistant. 
                These appear on the right side of the conversation.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">AI Assistant Messages</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Responses from the AI, including explanations, SQL queries, and analysis. 
                These appear on the left side with the assistant avatar.
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Query Result Messages</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Interactive messages containing executable SQL queries with run buttons and 
                result display areas for data output.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Handling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Error Handling and Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Handle common issues and errors during conversations:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Query execution errors are displayed with clear error messages</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Network issues show appropriate loading and error states</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Authentication problems are handled with clear notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Failed message delivery is indicated and can be retried</span>
            </div>
          </div>

          <Separator />

          <div className="bg-red-50 dark:bg-red-950/50 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Common Solutions</h4>
            <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
              <li>• Refresh the page if conversations fail to load</li>
              <li>• Check your internet connection for message delivery issues</li>
              <li>• Re-authenticate if you see authorization errors</li>
              <li>• Try rephrasing queries if the AI doesn't understand your request</li>
            </ul>
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
              <span className="text-sm">Create your first conversation and explore AI capabilities</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Database className="h-5 w-5 text-purple-600" />
              <span className="text-sm">Practice executing SQL queries and analyzing results</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <History className="h-5 w-5 text-indigo-600" />
              <span className="text-sm">Organize conversations by topic for better workflow management</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationManagementGuide;

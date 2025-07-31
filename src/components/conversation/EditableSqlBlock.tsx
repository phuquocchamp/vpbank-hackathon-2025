import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Loader2, Copy, Check, Edit3, Save, X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface EditableSqlBlockProps {
  sql: string;
  database: string;
  messageId: string;
  conversationId: string;
  onExecute: (sql: string, database: string, messageId: string) => void;
  isExecuting?: boolean;
  onUpdate?: (messageId: string, sql: string, database: string) => Promise<void>;
}

export const EditableSqlBlock = ({
  sql,
  database,
  messageId,
  conversationId: _conversationId,
  onExecute,
  isExecuting,
  onUpdate
}: EditableSqlBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSql, setEditedSql] = useState(sql);
  const [editedDatabase, setEditedDatabase] = useState(database);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Reset edited values when props change
  useEffect(() => {
    setEditedSql(sql);
    setEditedDatabase(database);
  }, [sql, database]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedSql(sql);
    setEditedDatabase(database);
    setSaveError(null);
  }; const handleSave = async () => {
    if (!onUpdate) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await onUpdate(messageId, editedSql.trim(), editedDatabase.trim());
      setIsEditing(false);
      // Show success feedback briefly
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error('Failed to update message:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to update message');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecute = async () => {
    // If editing, save changes first before executing
    if (isEditing && onUpdate) {
      try {
        await handleSave();
        // After successful save, execute with the saved values
        onExecute(editedSql.trim(), editedDatabase.trim(), messageId);
      } catch (error) {
        // If save fails, don't execute
        console.error('Failed to save before execute:', error);
        return;
      }
    } else {
      // If not editing, use original values
      onExecute(sql, database, messageId);
    }
  };

  return (
    <div className="space-y-3">
      {/* Database Section */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Database</Label>
        {isEditing ? (
          <Input
            value={editedDatabase}
            onChange={(e) => setEditedDatabase(e.target.value)}
            placeholder="Enter database name"
            className="font-mono text-sm"
          />
        ) : (
          <div className="bg-muted rounded-md px-3 py-2 font-mono text-sm">
            {database}
          </div>
        )}
      </div>

      {/* SQL Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium">SQL Query</Label>
          {!isEditing && onUpdate && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Edit3 className="size-3" />
              <span>Click edit to modify</span>
            </div>
          )}
        </div>
        <Card className="overflow-hidden max-w-full">
          <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/50">
            <span className="text-xs font-medium text-muted-foreground uppercase">SQL</span>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-6 px-1.5"
              >
                {copied ? (
                  <Check className="size-3 text-green-500" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>

              {/* Edit/Save/Cancel buttons */}
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="h-6 px-1.5"
                  >
                    <X className="size-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSave}
                    disabled={isSaving || !editedSql.trim()}
                    className="h-6 px-1.5"
                  >
                    {isSaving ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Save className="size-3" />
                    )}
                  </Button>
                </>
              ) : (
                onUpdate && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleEdit}
                    className="h-6 px-1.5"
                  >
                    <Edit3 className="size-3" />
                  </Button>
                )
              )}

              {/* Execute button */}
              <Button
                size="sm"
                variant="secondary"
                onClick={handleExecute}
                disabled={isExecuting || (isEditing && !editedSql.trim())}
                className="h-6 text-xs"
              >
                {isExecuting ? (
                  <Loader2 className="size-3 mr-0.5 animate-spin" />
                ) : (
                  <Play className="size-3 mr-0.5" />
                )}
                Execute
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            {isEditing ? (
              <div className="p-3">
                <Textarea
                  value={editedSql}
                  onChange={(e) => setEditedSql(e.target.value)}
                  placeholder="Enter SQL query"
                  className="min-h-[100px] font-mono text-sm resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={Math.max(3, editedSql.split('\n').length)}
                />
              </div>
            ) : (
              <div className="p-3">
                <SyntaxHighlighter
                  language="sql"
                  style={oneLight}
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    background: 'transparent',
                    fontSize: '12px',
                    lineHeight: '1.4'
                  }}
                  wrapLongLines={true}
                >
                  {sql}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Error display */}
      {saveError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

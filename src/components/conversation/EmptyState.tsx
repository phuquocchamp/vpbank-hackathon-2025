import { Bot } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ title, description, icon }: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md">
        {icon || <Bot className="size-12 text-muted-foreground mx-auto mb-4" />}
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

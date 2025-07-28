import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';

interface ChatSectionProps {
  onNewChat: () => void;
  loading: boolean;
}

export function ChatSection({ onNewChat, loading }: ChatSectionProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Button
          onClick={onNewChat}
          variant="outline"
          size="sm"
          className="w-full justify-start py-3 px-3 h-auto"
          disabled={loading}
        >
          <Plus className="size-4 mr-3" />
          New Chat
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
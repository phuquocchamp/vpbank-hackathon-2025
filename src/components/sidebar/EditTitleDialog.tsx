import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditTitleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTitle: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
}

export function EditTitleDialog({
  open,
  onOpenChange,
  newTitle,
  onTitleChange,
  onSave,
}: EditTitleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Conversation Title</DialogTitle>
          <DialogDescription>
            Enter a new title for this conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={newTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="col-span-3"
              placeholder="Enter conversation title"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSave();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!newTitle.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
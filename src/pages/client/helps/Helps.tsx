
import { useEffect } from 'react';
import { useHeader } from '@/contexts/HeaderContext';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import HelpSupport from '@/components/common/HelpSupport';

const Helps = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'Usage Guide',
      description: 'Learn how to use your VPBank AI assistant effectively',
      badge: (
        <Badge variant="outline" className="text-xs">
          <HelpCircle className="size-3 mr-1" />
          Usage Guide
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo]);

  return (
    <div className="container mx-auto px-4 py-6">
      <HelpSupport userType="client" />
    </div>
  );
};

export default Helps;

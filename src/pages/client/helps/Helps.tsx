
import ComingSoon from '@/components/common/ComingSoon';
import { useHeader } from '@/contexts/HeaderContext';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import { useEffect } from 'react';

const Helps = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'Help & Support',
      description: 'Get help and find answers',
      badge: (
        <Badge variant="outline" className="text-xs">
          <HelpCircle className="size-3 mr-1" />
          Coming Soon
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo]);

  return (
    <ComingSoon
      title="Help & Support"
      subtitle="Comprehensive assistance is on the way"
      description="We're creating a complete help center with guides, tutorials, and support to ensure you get the most out of your banking experience."
      features={[
        "Interactive help guides",
        "Video tutorials",
        "FAQ search engine",
        "Live chat support",
        "Step-by-step tutorials",
        "Community forums"
      ]}
      expectedDate="Q1 2025"
    />
  );
}

export default Helps

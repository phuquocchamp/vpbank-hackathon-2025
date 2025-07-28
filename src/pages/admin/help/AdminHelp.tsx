import ComingSoon from '@/components/common/ComingSoon';
import { useHeader } from '@/contexts/HeaderContext';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import { useEffect } from 'react';

const AdminHelp = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'Help & Support',
      description: 'Get assistance and documentation',
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
      title="Help & Support Center"
      subtitle="Comprehensive admin assistance on the way"
      description="We're building a comprehensive help center with documentation, tutorials, and 24/7 support to help you maximize your admin experience."
      features={[
        "Interactive tutorials and guides",
        "Real-time chat support",
        "Video documentation library",
        "Community forums and discussions",
        "Advanced troubleshooting tools"
      ]}
      expectedDate="Q2 2025"
    />
  );
};

export default AdminHelp;

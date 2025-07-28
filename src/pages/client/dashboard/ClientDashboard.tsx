
import ComingSoon from '@/components/common/ComingSoon';
import { useHeader } from '@/contexts/HeaderContext';
import { Badge } from '@/components/ui/badge';
import { Home } from 'lucide-react';
import { useEffect } from 'react';

const ClientDashboard = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'Dashboard',
      description: 'Your personal financial overview',
      badge: (
        <Badge variant="outline" className="text-xs">
          <Home className="size-3 mr-1" />
          Coming Soon
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo]);

  return (
    <ComingSoon
      title="Personal Dashboard"
      subtitle="Your command center is being crafted"
      description="We're creating a personalized dashboard that will give you complete control over your banking experience with intuitive insights and quick actions."
      features={[
        "Personalized financial overview",
        "Quick transaction history",
        "Smart spending insights",
        "Goal tracking and progress",
        "One-click financial actions",
        "Real-time notifications"
      ]}
      expectedDate="Q1 2025"
    />
  );
};

export default ClientDashboard;
import ComingSoon from '@/components/common/ComingSoon';
import { useHeader } from '@/contexts/HeaderContext';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { useEffect } from 'react';

const SystemReport = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'System Reports',
      description: 'Advanced analytics and reporting',
      badge: (
        <Badge variant="outline" className="text-xs">
          <FileText className="size-3 mr-1" />
          Coming Soon
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo]);

  return (
    <ComingSoon
      title="Advanced System Reports"
      subtitle="Deep insights and analytics coming soon"
      description="We're developing comprehensive reporting tools that will provide detailed system analytics, performance metrics, and business intelligence dashboards."
      features={[
        "Real-time performance dashboards",
        "Custom report builder",
        "Automated report scheduling",
        "Data export capabilities",
        "Advanced filtering and visualization",
        "Historical trend analysis"
      ]}
      expectedDate="Q1 2025"
    />
  );
};

export default SystemReport;

import ComingSoon from '@/components/common/ComingSoon';
import { useHeader } from '@/contexts/HeaderContext';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';
import { useEffect } from 'react';

const Analytics = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'Analytics',
      description: 'Smart insights and financial analytics',
      badge: (
        <Badge variant="outline" className="text-xs">
          <BarChart3 className="size-3 mr-1" />
          Coming Soon
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo]);

  return (
    <ComingSoon
      title="Smart Analytics"
      subtitle="Intelligence-driven insights are loading"
      description="We're developing powerful analytics tools that will help you understand your financial patterns, predict trends, and make smarter decisions."
      features={[
        "Interactive spending analysis",
        "Predictive financial modeling",
        "Custom analytics reports",
        "Trend visualization charts",
        "Automated insights and alerts",
        "Comparative benchmarking"
      ]}
      expectedDate="Q2 2025"
    />
  );
};

export default Analytics;

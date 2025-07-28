import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComingSoon from '@/components/common/ComingSoon';
import { useHeader } from '@/contexts/HeaderContext';
import { Badge } from '@/components/ui/badge';
import { Users as UsersIcon } from 'lucide-react';
import { useEffect } from 'react';

const Users = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'User Management',
      description: 'Manage your team and connections',
      badge: (
        <Badge variant="outline" className="text-xs">
          <UsersIcon className="size-3 mr-1" />
          Coming Soon
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo]);

  return (
    <ComingSoon
      title="Team Management"
      subtitle="Collaborative features are being built"
      description="We're developing comprehensive user management tools that will help you collaborate with your team and manage connections effectively."
      features={[
        "Team member invitation",
        "Role-based permissions",
        "Activity tracking",
        "Shared workspace management",
        "Communication tools",
        "User analytics"
      ]}
      expectedDate="Q2 2025"
    />
  );
};

export default Users;

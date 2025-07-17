
import ComingSoon from '@/components/common/ComingSoon';

const Dashboard = () => {
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

export default Dashboard;
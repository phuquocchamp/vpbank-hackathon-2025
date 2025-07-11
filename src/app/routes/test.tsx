export const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-muted-foreground">
        {title} page will be implemented here.
      </p>
    </div>
  </div>
);

// Loading component
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);
import React from 'react';

const Conversation = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Conversations</h1>
        <p className="text-gray-600">Manage your conversations here.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Conversation #{item}</h3>
                    <p className="text-sm text-gray-500">Started 2 hours ago</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
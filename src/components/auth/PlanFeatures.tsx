
import React from "react";

interface PlanFeaturesProps {
  planType: 'free' | 'pro' | 'premium';
}

export const PlanFeatures: React.FC<PlanFeaturesProps> = ({ planType }) => {
  return (
    <div className="mt-2 bg-primary/5 rounded-lg p-3 text-xs">
      <div className="font-medium text-primary mb-1">
        {planType === 'free' ? 'Free Plan Features:' : 
         planType === 'pro' ? 'Pro Plan Features:' : 'Premium Plan Features:'}
      </div>
      <ul className="space-y-1 text-gray-600">
        {planType === 'free' && (
          <>
            <li className="flex items-center">• 2 voice options</li>
            <li className="flex items-center">• Limited to 10 affirmations</li>
            <li className="flex items-center">• No background music</li>
          </>
        )}
        {planType === 'pro' && (
          <>
            <li className="flex items-center">• All 5 voice options</li>
            <li className="flex items-center">• Unlimited affirmations</li>
            <li className="flex items-center">• Background music</li>
          </>
        )}
      </ul>
    </div>
  );
};


import { useState } from 'react';
import { UserAffirmation } from './types';
import { Star, StarOff, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AffirmationHistoryProps {
  affirmations: UserAffirmation[];
  favoriteAffirmations: UserAffirmation[];
  userPlanInfo: {
    used: number;
    limit: number;
    type: string;
  };
  onToggleFavorite: (id: string, status: boolean) => Promise<void>;
  onClose: () => void;
}

export const AffirmationHistory = ({
  affirmations,
  favoriteAffirmations,
  userPlanInfo,
  onToggleFavorite,
  onClose
}: AffirmationHistoryProps) => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary-foreground">Your Affirmations</h2>
            <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
              &times;
            </Button>
          </div>

          <div className="mb-6">
            <div className="bg-primary/5 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary">Your {userPlanInfo.type.charAt(0).toUpperCase() + userPlanInfo.type.slice(1)} Plan</h3>
                <p className="text-sm text-muted-foreground">
                  {userPlanInfo.used} of {userPlanInfo.limit} affirmations used
                </p>
              </div>
              <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(100, (userPlanInfo.used / userPlanInfo.limit) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Affirmations</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              <AnimatePresence>
                {affirmations.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No affirmations yet.</p>
                ) : (
                  affirmations.map((affirmation) => (
                    <AffirmationItem 
                      key={affirmation.id}
                      affirmation={affirmation}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))
                )}
              </AnimatePresence>
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              <AnimatePresence>
                {favoriteAffirmations.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No favorite affirmations yet.</p>
                ) : (
                  favoriteAffirmations.map((affirmation) => (
                    <AffirmationItem 
                      key={affirmation.id}
                      affirmation={affirmation}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-gray-100">
            {userPlanInfo.type === 'free' && userPlanInfo.used >= userPlanInfo.limit && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-800 text-sm">
                  You've reached your free plan limit. Upgrade to create more affirmations.
                </p>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {userPlanInfo.type === 'free' && (
                <Button className="bg-gradient-to-r from-[#9b87f5] to-[#543ab7] text-white">
                  Upgrade Plan
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const AffirmationItem = ({ 
  affirmation, 
  onToggleFavorite 
}: { 
  affirmation: UserAffirmation, 
  onToggleFavorite: (id: string, status: boolean) => Promise<void> 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-start gap-4">
        <p className="flex-1 text-gray-800">{affirmation.affirmation}</p>
        <button 
          onClick={() => onToggleFavorite(affirmation.id, affirmation.is_favorite)}
          className="text-gray-400 hover:text-amber-500 transition-colors"
        >
          {affirmation.is_favorite ? (
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          ) : (
            <StarOff className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
        <span>{formatDistanceToNow(new Date(affirmation.created_at), { addSuffix: true })}</span>
      </div>
    </motion.div>
  );
};

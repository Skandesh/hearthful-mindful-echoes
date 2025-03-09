
import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePlanStatus } from "@/components/chat/hooks/usePlanStatus";
import { useAuthState } from "@/components/chat/useAuthState";
import { PlanFeatures } from "@/components/auth/PlanFeatures";

const Profile = () => {
  const { user, loading: authLoading } = useAuthState();
  const { userPlan, loading: planLoading, error } = usePlanStatus();
  const navigate = useNavigate();

  if (authLoading || planLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto pt-24 pb-16 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-primary-foreground">Your Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information Card */}
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-primary" />
              Account Information
            </CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-primary-foreground">{user.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
                <p className="text-primary-foreground">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full mt-2 border-primary/20 hover:bg-primary/5"
                  onClick={() => navigate("/app")}
                >
                  Go to App
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Subscription Plan Card */}
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5 text-primary" />
              Subscription Plan
            </CardTitle>
            <CardDescription>Your current plan and usage</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-red-500">Error loading plan details: {error}</div>
            ) : userPlan ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Current Plan</h3>
                  <p className="text-lg font-semibold capitalize text-primary-foreground">
                    {userPlan.plan_type}
                  </p>
                  
                  <PlanFeatures planType={userPlan.plan_type as 'free' | 'pro' | 'premium'} />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Usage</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (userPlan.affirmations_used / userPlan.affirmations_limit) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-xs whitespace-nowrap">
                      {userPlan.affirmations_used} / {userPlan.affirmations_limit}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Affirmations used this month
                  </p>
                </div>
                
                {userPlan.plan_type === 'free' && (
                  <div className="pt-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:opacity-90"
                      onClick={() => navigate("/#pricing")}
                    >
                      Upgrade Plan
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div>No plan information available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

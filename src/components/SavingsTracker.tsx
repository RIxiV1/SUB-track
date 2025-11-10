import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Sparkles } from "lucide-react";

const SavingsTracker = () => {
  const { data: savingsHistory = [] } = useQuery({
    queryKey: ['savings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("savings_history")
        .select("*")
        .order("saved_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const totalMonthlySavings = savingsHistory.reduce(
    (sum, entry) => sum + Number(entry.monthly_savings),
    0
  );

  const totalYearlySavings = totalMonthlySavings * 12;

  if (savingsHistory.length === 0) return null;

  return (
    <Card className="bg-gradient-celebration border-accent/20 shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="w-6 h-6 text-accent" />
          Your Savings Era 💰
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-accent/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              Monthly Savings
            </div>
            <div className="text-3xl font-bold text-accent">
              ${totalMonthlySavings.toFixed(2)}
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-accent/20">
            <div className="text-sm text-muted-foreground mb-1">
              Yearly Savings
            </div>
            <div className="text-3xl font-bold text-accent">
              ${totalYearlySavings.toFixed(2)}
            </div>
          </div>
        </div>
        
        {savingsHistory.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Recent Wins:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {savingsHistory.slice(0, 5).map((entry) => (
                <div 
                  key={entry.id} 
                  className="flex justify-between items-center text-sm bg-card/30 backdrop-blur-sm rounded p-2"
                >
                  <span className="text-foreground">{entry.subscription_name}</span>
                  <span className="font-medium text-accent">
                    +${Number(entry.monthly_savings).toFixed(2)}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsTracker;

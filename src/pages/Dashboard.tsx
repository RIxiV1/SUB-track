import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus } from "lucide-react";
import DashboardStats from "@/components/DashboardStats";
import SubscriptionCard from "@/components/SubscriptionCard";
import AddSubscriptionDialog from "@/components/AddSubscriptionDialog";
import EditSubscriptionDialog from "@/components/EditSubscriptionDialog";
import SpendingInsights from "@/components/SpendingInsights";
import ThemeToggle from "@/components/ThemeToggle";
import confetti from "canvas-confetti";

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  billing_cycle: string;
  next_renewal_date: string;
  category: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else {
        loadSubscriptions();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("next_renewal_date", { ascending: true });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error: any) {
      toast({
        title: "Oops!",
        description: "Couldn't load your subscriptions. Try refreshing?",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "See you later! 👋",
      description: "Come back anytime to check your subs",
    });
    navigate("/auth");
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      const deletedSub = subscriptions.find(sub => sub.id === id);
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      
      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF6B9D", "#C084FC", "#60A5FA"],
      });

      const monthlySavings = deletedSub?.billing_cycle === "yearly" 
        ? (deletedSub.cost / 12).toFixed(2)
        : deletedSub?.cost.toFixed(2);

      toast({
        title: "Period. You just saved money! 💸",
        description: `That's $${monthlySavings}/mo back in your pocket. Slay!`,
      });
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <p className="text-muted-foreground">Loading your subs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">SubSentry 💸</h1>
            <p className="text-muted-foreground">Your fin-bestie keeping track</p>
          </div>
          <div className="flex gap-3">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Peace out
            </Button>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats subscriptions={subscriptions} />

        {/* Spending Insights */}
        {subscriptions.length > 0 && (
          <div className="mt-8">
            <SpendingInsights subscriptions={subscriptions} />
          </div>
        )}

        {/* Subscriptions List */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Subscriptions</h2>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add to Hit List
            </Button>
          </div>

          {subscriptions.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg shadow-soft">
              <p className="text-xl font-medium mb-2">Nothing here yet!</p>
              <p className="text-muted-foreground mb-6">
                Let's add your first subscription. It's giving organized energy ✨
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2 bg-gradient-primary"
              >
                <Plus className="w-4 h-4" />
                Add Your First Sub
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onDelete={handleDeleteSubscription}
                  onEdit={handleEditSubscription}
                />
              ))}
            </div>
          )}
        </div>

        <AddSubscriptionDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={loadSubscriptions}
        />

        <EditSubscriptionDialog
          subscription={editingSubscription}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={loadSubscriptions}
        />
      </div>
    </div>
  );
};

export default Dashboard;
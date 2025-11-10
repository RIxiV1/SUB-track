import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Subscription } from "@/pages/Dashboard";
import { z } from "zod";

const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cost: z.number().positive("Cost must be positive"),
  billing_cycle: z.string(),
  next_renewal_date: z.string(),
  category: z.string(),
});

interface EditSubscriptionDialogProps {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditSubscriptionDialog = ({ subscription, open, onOpenChange, onSuccess }: EditSubscriptionDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    billing_cycle: "monthly",
    next_renewal_date: "",
    category: "Entertainment",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        cost: subscription.cost.toString(),
        billing_cycle: subscription.billing_cycle,
        next_renewal_date: subscription.next_renewal_date,
        category: subscription.category,
      });
    }
  }, [subscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = subscriptionSchema.parse({
        name: formData.name,
        cost: parseFloat(formData.cost),
        billing_cycle: formData.billing_cycle,
        next_renewal_date: formData.next_renewal_date,
        category: formData.category,
      });

      const { error } = await supabase
        .from("subscriptions")
        .update({
          name: validatedData.name,
          cost: validatedData.cost,
          billing_cycle: validatedData.billing_cycle,
          next_renewal_date: validatedData.next_renewal_date,
          category: validatedData.category,
        })
        .eq("id", subscription?.id);

      if (error) throw error;

      toast({
        title: "Updated! 🎯",
        description: "Your sub details are fresh now",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Oops, something went wrong",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Subscription Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Netflix, Spotify, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-cost">Cost</Label>
            <Input
              id="edit-cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="14.99"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-billing">Billing Cycle</Label>
            <Select value={formData.billing_cycle} onValueChange={(value) => setFormData({ ...formData, billing_cycle: value })}>
              <SelectTrigger id="edit-billing">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date">Next Renewal Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.next_renewal_date}
              onChange={(e) => setFormData({ ...formData, next_renewal_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger id="edit-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Productivity">Productivity</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-gradient-primary">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscriptionDialog;

-- Create savings_history table to track canceled subscriptions
CREATE TABLE public.savings_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_name TEXT NOT NULL,
  monthly_savings NUMERIC NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.savings_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own savings history" 
ON public.savings_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own savings entries" 
ON public.savings_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
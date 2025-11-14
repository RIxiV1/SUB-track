SubSentry - Your Fin-Bestie 💸

Stop letting subscriptions ghost your bank account. SubSentry is your financial bestie that helps you track and manage all your subscriptions with zero judgment.

This isn't just another mid subscription tracker. It's a "vibe-coded" app built from the ground up to transform financial anxiety into effortless, calm control.

✨ Features

    Secure AF: No bank linking. Ever. Your data stays your data, enforced at the database level with Supabase Row Level Security.

The "Slay" Moment: We celebrate you for making smart moves. Cancel a sub? You get confetti and a "you just saved money" toast. Period.

Vibe-Coded UI: A custom, "no-stress" design system built with Tailwind. All colors, gradients, and shadows are designed to feel empowering, not alarming.

Zero Judgment: Add your subs, see the total, and get the full sitch. No shaming, just clarity.

Genz-First Copy: All validation and helper text is written to sound like a friend, not a robot.

🛠️ Tech Stack

This project is built with a modern, scalable stack:

    Framework: React + Vite 

Backend: Supabase (Auth & Postgres Database)

UI: shadcn/ui & Tailwind CSS

Validation: Zod

That "Slay" Moment: canvas-confetti

Routing: React Router

🚀 How to Run Locally

Bet. You wanna run this yourself? Say less.

1. Clone the repo:


git clone https://github.com/RIxiV1/sticky-loop-architect.git
cd sticky-loop-architect

2. Install packages: This project uses npm.

npm install

3. Set up your Environment: This project uses Supabase for the backend.

    Create a new project on Supabase.com.

    Create a .env file in the root of this project. (Don't worry, it's in the .gitignore).

    Copy your Supabase project URL and anon key into it:

# .env file
VITE_SUPABASE_URL="httpsYOUR_SUPABASE_PROJECT_URL.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_ANON_KEY"

4. Run the Database Migration:

    In your Supabase project, go to the "SQL Editor."

    Copy the contents of the migration file: supabase/migrations/20251109045834_b9c2b6ad-c4a0-4e21-ac9d-55b2f45357ca.sql.

    Paste it into the SQL editor and click "Run." This will create the subscriptions table and set up the Row Level Security policies.

5. Run the dev server:

npm run dev

Your fin-bestie is now running on http://localhost:8080!

📜 License

This project is licensed under the MIT License. Feel free to use it and build on it.

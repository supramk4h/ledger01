# Supabase Integration Setup Guide

## 📋 Overview
This document explains how to integrate Supabase into your Personal Finance Ledger application.

## 🚀 Quick Start

### 1. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or sign in
3. Navigate to **Project Settings** → **API**
4. Copy your:
   - **Project URL** (SUPABASE_URL)
   - **anon/public API Key** (SUPABASE_ANON_KEY)

### 2. Update Configuration

Open `supabase-client.js` and replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 3. Initialize Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste all contents from `supabase.sql`
4. Click **Run**

This creates all required tables with proper relationships and security policies.

## 📦 Files Included

### `supabase.sql`
Complete database schema including:
- **users** - User profiles (extends Auth)
- **categories** - Transaction categories
- **transactions** - Income/expense records
- **budgets** - Budget limits and tracking
- **accounts** - Bank/wallet accounts
- **goals** - Financial goals
- **recurring_transactions** - Automated recurring entries

Features:
- Row Level Security (RLS) - Users can only access their own data
- Foreign key constraints
- Indexes for performance
- Automatic timestamps

### `supabase-client.js`
JavaScript client library with ready-to-use functions:

**Authentication:**
- `SupabaseClient.auth.signUp(email, password)`
- `SupabaseClient.auth.signIn(email, password)`
- `SupabaseClient.auth.signOut()`
- `SupabaseClient.auth.getCurrentUser()`
- `SupabaseClient.auth.resetPassword(email)`

**Users:**
- `SupabaseClient.users.getProfile(userId)`
- `SupabaseClient.users.updateProfile(userId, updates)`

**Transactions:**
- `SupabaseClient.transactions.add(userId, transaction)`
- `SupabaseClient.transactions.get(userId, filters)`
- `SupabaseClient.transactions.update(id, updates)`
- `SupabaseClient.transactions.delete(id)`
- `SupabaseClient.transactions.subscribe(userId, callback)`

**Categories:**
- `SupabaseClient.categories.add(userId, category)`
- `SupabaseClient.categories.get(userId)`
- `SupabaseClient.categories.update(id, updates)`
- `SupabaseClient.categories.delete(id)`
- `SupabaseClient.categories.subscribe(userId, callback)`

**Budgets:**
- `SupabaseClient.budgets.add(userId, budget)`
- `SupabaseClient.budgets.get(userId)`
- `SupabaseClient.budgets.update(id, updates)`

**Goals:**
- `SupabaseClient.goals.add(userId, goal)`
- `SupabaseClient.goals.get(userId)`
- `SupabaseClient.goals.update(id, updates)`

## 🔌 Integration with HTML

In your `index.html`, add the script:

```html
<script src="supabase-client.js"></script>
<script>
  // Initialize Supabase on page load
  SupabaseClient.init();
</script>
```

## 💡 Usage Examples

### Sign In User
```javascript
const result = await SupabaseClient.auth.signIn(email, password);
if (result.success) {
  const user = await SupabaseClient.auth.getCurrentUser();
  console.log('User:', user);
}
```

### Add a Transaction
```javascript
const userId = user.id;
const transaction = {
  category_id: categoryId,
  amount: 100.50,
  type: 'expense',
  description: 'Grocery shopping',
  date: '2026-03-19'
};
const newTransaction = await SupabaseClient.transactions.add(userId, transaction);
```

### Get Transactions with Filters
```javascript
const filters = {
  startDate: '2026-01-01',
  endDate: '2026-03-31',
  type: 'expense'
};
const transactions = await SupabaseClient.transactions.get(userId, filters);
```

### Get All Categories
```javascript
const categories = await SupabaseClient.categories.get(userId);
```

### Add a Goal
```javascript
const goal = {
  name: 'Emergency Fund',
  target_amount: 5000,
  deadline: '2027-03-19',
  description: 'Save 6 months of expenses'
};
const newGoal = await SupabaseClient.goals.add(userId, goal);
```

### Real-time Subscriptions
```javascript
// Listen for new/updated transactions
SupabaseClient.transactions.subscribe(userId, (payload) => {
  console.log('Transaction changed:', payload);
  // Update UI in real-time
});
```

## 🔐 Security Features

### Row Level Security (RLS)
All tables have RLS policies that ensure:
- Users can only view their own data
- Users can only insert/update/delete their own records
- Data is protected at the database level

### JWT Authentication
Supabase uses JWT tokens for secure authentication:
- Tokens are managed automatically
- Secure HTTP-only cookies (optional)
- Automatic token refresh

## 📊 Database Schema Relationships

```
users
├── categories (1:many)
├── transactions (1:many)
├── budgets (1:many)
├── accounts (1:many)
├── goals (1:many)
└── recurring_transactions (1:many)

categories
└── transactions (1:many)

accounts
└── account_transactions (1:many)

transactions
└── account_transactions (1:many)
```

## 🚨 Important Notes

1. **Keep API Key Secret**: Never expose your ANON_KEY in production environment variables. Use environment file or secure storage.

2. **CORS**: Supabase handles CORS automatically for `localhost` during development.

3. **Rate Limiting**: Supabase has built-in rate limiting. Free tier has generous limits.

4. **Backups**: Enable backups in Project Settings → Database.

5. **SSL/TLS**: All data is encrypted in transit.

## 🆘 Troubleshooting

### "Cannot find supabase module"
- Ensure script tag is included in HTML before using `SupabaseClient`
- Check browser console for network errors

### "RLS policy violation"
- Verify user is authenticated
- Check that user_id matches authenticated user's ID

### "CORS Error"
- Add your domain to allowed CORS origins in Project Settings
- Development: `localhost:3000`, `localhost:5173`, etc.

### "Invalid API Key"
- Verify you're using the ANON_KEY (not SECRET_KEY)
- Copy the entire key without extra spaces

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/start)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🎯 Next Steps

1. ✅ Initialize Supabase client in your HTML
2. ✅ Create login/signup UI
3. ✅ Fetch and display user's transactions
4. ✅ Implement add/edit/delete operations
5. ✅ Add real-time subscriptions for live updates
6. ✅ Set up budget alerts
7. ✅ Create charts and analytics views

// ============================================================
// Supabase Configuration & Client
// ============================================================
// Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with your actual values
// from your Supabase project settings

const SUPABASE_URL = 'https://umswoglqoddirbxvhzbf.supabase.co'; // e.g., https://your-project.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtc3dvZ2xxb2RkaXJieHZoemJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MTYxNTEsImV4cCI6MjA4OTQ5MjE1MX0.eh5WWHo_Usa6D8FzLQakrvRc3mMWbA3qUU21ue03fTs'; // e.g., eyJhbGciOiJIUzI1NiIs...

// ============================================================
// Initialize Supabase Client
// ============================================================
let supabase = null;

async function initSupabase() {
  // Load Supabase library from CDN
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
  
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✓ Supabase initialized');
  
  return supabase;
}

// ============================================================
// Authentication Functions
// ============================================================

async function signUp(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    console.log('✓ Sign up successful:', data.user.email);
    return { success: true, user: data.user };
  } catch (error) {
    console.error('✗ Sign up failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    console.log('✓ Sign in successful');
    return { success: true, session: data.session };
  } catch (error) {
    console.error('✗ Sign in failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log('✓ Sign out successful');
    return { success: true };
  } catch (error) {
    console.error('✗ Sign out failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('✗ Get current user failed:', error.message);
    return null;
  }
}

async function resetPassword(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}?type=recovery`
    });
    
    if (error) throw error;
    console.log('✓ Password reset email sent');
    return { success: true };
  } catch (error) {
    console.error('✗ Password reset failed:', error.message);
    return { success: false, error: error.message };
  }
}

// ============================================================
// User Profile Functions
// ============================================================

async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('✗ Get user profile failed:', error.message);
    return null;
  }
}

async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✓ Profile updated');
    return data;
  } catch (error) {
    console.error('✗ Update profile failed:', error.message);
    return null;
  }
}

// ============================================================
// Transaction Functions
// ============================================================

async function addTransaction(userId, transaction) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        ...transaction
      })
      .select()
      .single();
    
    if (error) throw error;
    console.log('✓ Transaction added');
    return data;
  } catch (error) {
    console.error('✗ Add transaction failed:', error.message);
    return null;
  }
}

async function getTransactions(userId, filters = {}) {
  try {
    let query = supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', userId);
    
    if (filters.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('date', filters.endDate);
    }
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('✗ Get transactions failed:', error.message);
    return [];
  }
}

async function updateTransaction(transactionId, updates) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✓ Transaction updated');
    return data;
  } catch (error) {
    console.error('✗ Update transaction failed:', error.message);
    return null;
  }
}

async function deleteTransaction(transactionId) {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);
    
    if (error) throw error;
    console.log('✓ Transaction deleted');
    return true;
  } catch (error) {
    console.error('✗ Delete transaction failed:', error.message);
    return false;
  }
}

// ============================================================
// Category Functions
// ============================================================

async function addCategory(userId, category) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        ...category
      })
      .select()
      .single();
    
    if (error) throw error;
    console.log('✓ Category added');
    return data;
  } catch (error) {
    console.error('✗ Add category failed:', error.message);
    return null;
  }
}

async function getCategories(userId) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('✗ Get categories failed:', error.message);
    return [];
  }
}

async function updateCategory(categoryId, updates) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✓ Category updated');
    return data;
  } catch (error) {
    console.error('✗ Update category failed:', error.message);
    return null;
  }
}

async function deleteCategory(categoryId) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);
    
    if (error) throw error;
    console.log('✓ Category deleted');
    return true;
  } catch (error) {
    console.error('✗ Delete category failed:', error.message);
    return false;
  }
}

// ============================================================
// Budget Functions
// ============================================================

async function addBudget(userId, budget) {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: userId,
        ...budget
      })
      .select()
      .single();
    
    if (error) throw error;
    console.log('✓ Budget added');
    return data;
  } catch (error) {
    console.error('✗ Add budget failed:', error.message);
    return null;
  }
}

async function getBudgets(userId) {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*, categories(*)')
      .eq('user_id', userId)
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('✗ Get budgets failed:', error.message);
    return [];
  }
}

async function updateBudget(budgetId, updates) {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', budgetId)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✓ Budget updated');
    return data;
  } catch (error) {
    console.error('✗ Update budget failed:', error.message);
    return null;
  }
}

// ============================================================
// Goals Functions
// ============================================================

async function addGoal(userId, goal) {
  try {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: userId,
        ...goal
      })
      .select()
      .single();
    
    if (error) throw error;
    console.log('✓ Goal added');
    return data;
  } catch (error) {
    console.error('✗ Add goal failed:', error.message);
    return null;
  }
}

async function getGoals(userId) {
  try {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('✗ Get goals failed:', error.message);
    return [];
  }
}

async function updateGoal(goalId, updates) {
  try {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✓ Goal updated');
    return data;
  } catch (error) {
    console.error('✗ Update goal failed:', error.message);
    return null;
  }
}

// ============================================================
// Real-time Subscriptions
// ============================================================

function subscribeToTransactions(userId, callback) {
  const subscription = supabase
    .from(`transactions:user_id=eq.${userId}`)
    .on('*', payload => {
      callback(payload);
    })
    .subscribe();
  
  return subscription;
}

function subscribeToCategories(userId, callback) {
  const subscription = supabase
    .from(`categories:user_id=eq.${userId}`)
    .on('*', payload => {
      callback(payload);
    })
    .subscribe();
  
  return subscription;
}

// ============================================================
// Export Functions
// ============================================================
const SupabaseClient = {
  init: initSupabase,
  auth: {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    resetPassword
  },
  users: {
    getProfile: getUserProfile,
    updateProfile: updateUserProfile
  },
  transactions: {
    add: addTransaction,
    get: getTransactions,
    update: updateTransaction,
    delete: deleteTransaction,
    subscribe: subscribeToTransactions
  },
  categories: {
    add: addCategory,
    get: getCategories,
    update: updateCategory,
    delete: deleteCategory,
    subscribe: subscribeToCategories
  },
  budgets: {
    add: addBudget,
    get: getBudgets,
    update: updateBudget
  },
  goals: {
    add: addGoal,
    get: getGoals,
    update: updateGoal
  }
};

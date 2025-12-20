// ⚠️ TEMPORARY SUPABASE STUB
// This file exists ONLY to allow frontend build during migration.
// DO NOT use in production logic.

export const supabase = {
    auth: {
        signInWithPassword: async () => ({ data: null, error: new Error("Supabase disabled") }),
        signUp: async () => ({ data: null, error: new Error("Supabase disabled") }),
        signOut: async () => {},
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } }
        }),
        resetPasswordForEmail: async () => ({ error: new Error("Supabase disabled") }),
        setSession: async () => ({ error: new Error("Supabase disabled") }),
        updateUser: async () => ({ error: new Error("Supabase disabled") }),
    },

    from: () => ({
        select: () => ({ data: [], count: 0 }),
        insert: async () => ({ error: new Error("Supabase disabled") }),
        update: async () => ({ error: new Error("Supabase disabled") }),
        delete: async () => ({ error: new Error("Supabase disabled") }),
        eq: () => ({ data: null }),
        in: () => ({ data: [] }),
        not: () => ({ data: [] }),
        single: () => ({ data: null }),
        order: () => ({ data: [] }),
        limit: () => ({ data: [] }),
    }),
};

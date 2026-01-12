// ⚠️ TEMPORARY SUPABASE STUB
// This file exists ONLY to allow frontend build during migration.
// DO NOT use in production logic.

export const supabase = {
    auth: {
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
    }),
};

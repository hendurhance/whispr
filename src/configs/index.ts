const CONFIGURATIONS = {
    APP_ENV: import.meta.env.MODE || process.env.NODE_ENV,
    API_URL: import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
    FUNCTIONS: {
        UPDATE_PROFILE_VIEWS: `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || process.env.VITE_SUPABASE_FUNCTIONS_URL}/update-profile-views`,
        UPDATE_WHISPR_COUNTS: `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || process.env.VITE_SUPABASE_FUNCTIONS_URL}/update-whispr-counts`,
        SUBMIT_WHISPR: `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || process.env.VITE_SUPABASE_FUNCTIONS_URL}/submit-whispr`,
        DELETE_USER: `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || process.env.VITE_SUPABASE_FUNCTIONS_URL}/delete-user`,
    },
    APP_URL: import.meta.env.VITE_APP_URL || process.env.VITE_APP_URL,
    get APP_URL_CLEAN() {
        return this.APP_URL ? this.APP_URL.replace('https://', '').replace('http://', '').replace(/\/$/, '') : '';
    }
};
 
export default CONFIGURATIONS;
export const { API_URL, ANON_KEY, FUNCTIONS, APP_URL, APP_ENV, APP_URL_CLEAN } = CONFIGURATIONS;

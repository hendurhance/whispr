const CONFIGURATIONS = {
    APP_ENV: process.env.NODE_ENV,
    API_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    FUNCTIONS: {
        UPDATE_PROFILE_VIEWS: `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/update-profile-views`,
        UPDATE_WHISPR_COUNTS: `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/update-whispr-counts`,
        SUBMIT_WHISPR: `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/submit-whispr`,
        DELETE_USER: `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/delete-user`,
    },
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    VERIFICATIONS: {
        GOOGLE: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
    get APP_URL_CLEAN() {
        return this.APP_URL ? this.APP_URL.replace('https://', '').replace('http://', '').replace(/\/$/, '') : '';
    }
};

export default CONFIGURATIONS;
export const { API_URL, ANON_KEY, FUNCTIONS, APP_URL, APP_ENV, APP_URL_CLEAN } = CONFIGURATIONS;

// Display limits
export const MAX_TITLE_LENGTH = 40;
export const MAX_RECENT_ITEMS = 5;
export const MAX_RECENT_QUERIES_DISPLAY = 5;
export const MAX_TOPIC_ARTICLES = 5;
export const MAX_RECENT_STORIES = 10;
export const MAX_SOURCE_STORIES = 3;

// Data fetch limits
export const FETCH_RECENT_QUERIES_LIMIT = 20;
export const FETCH_RECENT_ARTICLES_LIMIT = 20;
export const FETCH_SOURCE_ARTICLES_LIMIT = 50;
export const MAX_CACHE_SIZE = 50;

// Animation
export const STREAMING_CHUNK_SIZE = 3;
export const STREAMING_INTERVAL_MS = 12;

// Health check
export const HEALTH_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

// API timeouts
export const RAG_QUERY_TIMEOUT_MS = 30_000;
export const WEB_SEARCH_TIMEOUT_MS = 15_000;

// Auth timeouts
export const AUTH_INIT_TIMEOUT_MS = 3_000;
export const AUTH_PROFILE_TIMEOUT_MS = 2_000;
export const AUTH_SESSION_TIMEOUT_MS = 2_500;

// UI feedback
export const ERROR_AUTO_DISMISS_MS = 15_000;
export const COPIED_FEEDBACK_MS = 2_000;
export const URL_REVOKE_DELAY_MS = 1_000;
export const SOURCE_SCROLL_PX = 200;

// DEPRECATED LOCATION.
// Next.js resolves middleware at the repository root before src/, so a middleware
// file here is never executed. The real rules live in /middleware.ts at the root.
// This file re-exports it so both paths behave identically and nobody edits a dead file.
export { middleware, config } from '../middleware';

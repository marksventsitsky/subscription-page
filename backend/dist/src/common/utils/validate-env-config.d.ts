import { z } from 'zod';
export declare function validateEnvConfig<T>(schema: z.ZodType, config: Record<string, unknown>): T;

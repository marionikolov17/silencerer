import { z } from 'zod';

export enum SilenceDetectionAlgorithm {
  STE = 'STE',
  ZERO_CROSSING = 'ZERO_CROSSING',
  AUTOCORRELATION = 'AUTOCORRELATION',
}

export const SilencerParamsSchema = z.object({
  algorithm: z.nativeEnum(SilenceDetectionAlgorithm),
  threshold: z.number().min(0).max(1),
  minimumSilenceDuration: z.number(),
  frameTime: z.number(),
  crossfadeDuration: z.number(),
});

export type SilencerParams = z.infer<typeof SilencerParamsSchema>;

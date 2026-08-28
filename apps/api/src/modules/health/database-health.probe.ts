export interface DatabaseHealthProbe {
  ping(): Promise<void>;
}

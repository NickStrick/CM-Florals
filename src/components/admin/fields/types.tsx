import type { AnySection } from '@/types/site';
export type EditorProps<T extends AnySection> = {
  section: T;
  onChange: (next: T) => void;
  openMediaPicker: (prefix: string) => Promise<string | null>;
  siteId: string;
};
export type EditorSharedProps = {
  openMediaPicker: (prefix: string) => Promise<string | null>;
  siteId: string;
};
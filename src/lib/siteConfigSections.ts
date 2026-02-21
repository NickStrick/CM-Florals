import type { AnySection, FooterSection, HeaderSection, SiteConfig } from '@/types/site';

export function createDefaultHeaderSection(): HeaderSection {
  return {
    id: 'hdr',
    type: 'header',
    logoText: 'Site-Crafter',
    logoImage: '',
    links: [],
    cta: { label: '', href: '' },
    style: { sticky: true, blur: true, elevation: 'sm', transparent: false },
  };
}

export function createDefaultFooterSection(): FooterSection {
  return {
    id: 'ftr',
    type: 'footer',
    columns: [],
    legal: '',
  };
}

function isHeaderOrFooter(section: AnySection | undefined | null): section is HeaderSection | FooterSection {
  return !!section && (section.type === 'header' || section.type === 'footer');
}

export function normalizeSiteConfig(input: SiteConfig): SiteConfig {
  const rawSections = Array.isArray(input.sections) ? input.sections : [];

  const headerFromSections = rawSections.find((s) => s.type === 'header') as HeaderSection | undefined;
  const footerFromSections = rawSections.find((s) => s.type === 'footer') as FooterSection | undefined;

  const header = input.header ?? headerFromSections ?? createDefaultHeaderSection();
  const footer = input.footer ?? footerFromSections ?? createDefaultFooterSection();

  const showHeader =
    typeof input.showHeader === 'boolean'
      ? input.showHeader
      : headerFromSections?.visible === false
        ? false
        : true;

  const showFooter =
    typeof input.showFooter === 'boolean'
      ? input.showFooter
      : footerFromSections?.visible === false
        ? false
        : true;

  const sections = rawSections.filter((s) => !isHeaderOrFooter(s));

  return {
    ...input,
    header: { ...createDefaultHeaderSection(), ...header },
    footer: { ...createDefaultFooterSection(), ...footer },
    showHeader,
    showFooter,
    sections,
  };
}

export function getRenderableSections(config: SiteConfig): AnySection[] {
  const normalized = normalizeSiteConfig(config);
  const out: AnySection[] = [];

  if (normalized.showHeader !== false && normalized.header) {
    out.push({ ...normalized.header, visible: true });
  }
  out.push(...(normalized.sections ?? []));
  if (normalized.showFooter !== false && normalized.footer) {
    out.push({ ...normalized.footer, visible: true });
  }

  return out;
}

export type AdminSectionSlot =
  | { kind: 'header'; section: HeaderSection; show: boolean }
  | { kind: 'section'; index: number; section: AnySection }
  | { kind: 'footer'; section: FooterSection; show: boolean };

export function getAdminSectionSlots(config: SiteConfig): AdminSectionSlot[] {
  const normalized = normalizeSiteConfig(config);
  const slots: AdminSectionSlot[] = [
    { kind: 'header', section: normalized.header!, show: normalized.showHeader !== false },
    ...(normalized.sections ?? []).map((s, index) => ({ kind: 'section' as const, index, section: s })),
    { kind: 'footer', section: normalized.footer!, show: normalized.showFooter !== false },
  ];
  return slots;
}

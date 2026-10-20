// Roof replacement page extras drawn on roof-replacement-1440 that are not
// blocks in batch-1 section 3. Every phrase is lifted from approved copy, as
// the artboard notes record; nothing here is new information.

// Rows use the copy's own phrasing: batch-1 section 4 FAQ "How do I know if my
// roof needs repair or replacement?" and section 3 FAQ "Will homeowners
// insurance pay for a new roof?".
export const repairOrReplace = [
  { label: 'Age of roof', repair: 'A roof under 15 years old', replace: 'A roof past 20 years' },
  { label: 'Extent of damage', repair: 'Damage in one area', replace: 'Worn shingles everywhere, leaks in several spots' },
  {
    label: 'Insurance',
    repair: 'Usually won’t pay for normal wear and age',
    replace: 'Usually pays when storm damage, like wind or hail, is the cause',
  },
];

export const materials = [
  { href: '/certainteed-roofing/', icon: 'award', title: 'Asphalt shingle', text: 'The shingles Ricardo uses on most jobs.', photo: 'colonialFront' as const, caption: 'Asphalt shingle, CertainTeed' },
  { href: '/metal-roofing/', icon: 'layers', title: 'Metal', text: 'Standing seam metal roofs are available too.', photo: null, caption: 'metal roof' },
  { href: '/commercial-roofing/', icon: 'building-2', title: 'Flat', text: 'Flat roofing systems are available too.', photo: 'flatTpo' as const, caption: 'Flat roof, white TPO membrane' },
];

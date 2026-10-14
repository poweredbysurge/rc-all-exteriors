// Lead form options. The keys are a contract with Surge Command Center
// (master prompt section 11, ADR-003): labels may change, keys may not.

// "What's going on?" on the lead card. Labels are the copy's own five
// (batch-1 section 6 [FORM]); keys follow the roofing reference enum.
export const REASONS = [
  { key: 'leaking', label: 'Leak' },
  { key: 'storm_damage', label: 'Storm damage' },
  { key: 'old_roof', label: 'Roof is getting old' },
  { key: 'buying_selling', label: 'Buying or selling a home' },
  { key: 'something_else', label: 'Other' },
] as const;

// "What do you need?" on the contact page (batch-2 section 5 [FORM]). Two
// labels share other_trades, so the chosen label also travels in notes.
export const CONTACT_REASONS = [
  { key: 'old_roof', label: 'Roof replacement' },
  { key: 'repair', label: 'Roof repair or leak' },
  { key: 'storm_damage', label: 'Storm damage' },
  { key: 'other_trades', label: 'Gutters or siding' },
  { key: 'other_trades', label: 'Windows or doors' },
  { key: 'something_else', label: 'Other' },
] as const;

export const REASON_KEYS = [
  'leaking',
  'storm_damage',
  'old_roof',
  'repair',
  'buying_selling',
  'other_trades',
  'something_else',
] as const;

export const ROOF_AGES = [
  { key: 'under_10', label: 'Under 10' },
  { key: '10_20', label: '10 to 20' },
  { key: 'over_20', label: 'Over 20' },
  { key: 'not_sure', label: 'Not sure' },
] as const;

export const URGENCIES = [
  { key: 'right_away', label: 'Right away' },
  { key: 'within_month', label: 'Within a month' },
  { key: '1_3_months', label: '1 to 3 months' },
  { key: 'planning', label: 'Just planning' },
] as const;

// "Best time to reach you" has no field of its own in the contract, so the
// chosen label is written into notes. Option labels are DRAFT
// (copy/DRAFT-ADDITIONS.md); the copy names the field but not its choices.
export const BEST_TIMES = ['Morning', 'Afternoon', 'Evening', 'Any time'] as const;

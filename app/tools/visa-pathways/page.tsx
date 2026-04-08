'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, ChevronUp, ChevronRight,
  Plane, GraduationCap, Briefcase, MapPin, Home, Users, Building2,
  Clock, DollarSign, CheckCircle2, AlertTriangle, Info, Star,
  ArrowRight, ExternalLink, Phone, Globe, BookOpen, Wrench,
  HardHat, Heart, TrendingUp, Shield, Award, Zap, CalendarDays,
  BadgeCheck, Layers, Navigation,
} from 'lucide-react';
import clsx from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

type CurrentVisa = 'whv' | 'student' | 'graduate' | 'skilled' | 'visitor' | 'other';
type Goal = 'stay' | 'pr' | 'sponsored' | 'study' | 'family' | 'business' | 'all';

interface Pathway {
  id: string;
  subclass: string;
  name: string;
  tagline: string;
  Icon: React.ElementType;
  category: 'extend' | 'study' | 'sponsored' | 'permanent' | 'family' | 'business';
  categoryLabel: string;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  stay: string;
  processingTime: string;
  cost: string;
  difficulty: 1 | 2 | 3;
  summary: string;
  requirements: string[];
  nextSteps: string[];
  pros: string[];
  cons: string[];
  leadsTo: string[];
  fromVisas: CurrentVisa[];
  forGoals: Goal[];
  relatedOccupations?: string[];
  urgentNote?: string;
}

interface Service {
  id: string;
  name: string;
  type: 'migration-agent' | 'education' | 'skills-assessment' | 'english' | 'recruitment';
  typeLabel: string;
  tagline: string;
  description: string;
  specialties: string[];
  languages?: string[];
  priceFrom?: string;
  contact?: string;
  website?: string;
  badge?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CURRENT_VISA_OPTIONS: { value: CurrentVisa; label: string; sublabel: string; Icon: React.ElementType }[] = [
  { value: 'whv', label: 'Working Holiday', sublabel: 'Subclass 417 or 462', Icon: Plane },
  { value: 'student', label: 'Student Visa', sublabel: 'Subclass 500', Icon: GraduationCap },
  { value: 'graduate', label: 'Graduate Visa', sublabel: 'Subclass 485', Icon: Award },
  { value: 'skilled', label: 'Temporary Skilled', sublabel: 'Subclass 482 / 457', Icon: Briefcase },
  { value: 'visitor', label: 'Visitor / Tourist', sublabel: 'Subclass 600 or ETA', Icon: MapPin },
  { value: 'other', label: 'Other / Not sure', sublabel: 'Partner, bridging, or unsure', Icon: Navigation },
];

const GOAL_OPTIONS: { value: Goal; label: string; sublabel: string; Icon: React.ElementType }[] = [
  { value: 'stay', label: 'Stay as long as possible', sublabel: 'Maximise time in Australia', Icon: Clock },
  { value: 'pr', label: 'Get Permanent Residency', sublabel: 'Live and work in AU forever', Icon: Home },
  { value: 'sponsored', label: 'Get employer sponsorship', sublabel: 'Have a company sponsor my visa', Icon: Briefcase },
  { value: 'study', label: 'Study to extend stay', sublabel: 'Use education to stay longer', Icon: GraduationCap },
  { value: 'family', label: 'Bring my partner / family', sublabel: 'Partner, child, or family visa', Icon: Heart },
  { value: 'business', label: 'Start or invest in a business', sublabel: 'Business innovation or investor', Icon: Building2 },
];

const PATHWAYS: Pathway[] = [
  // ── Extend ──────────────────────────────────────────────────────────────────
  {
    id: 'whv-2nd',
    subclass: '417 / 462',
    name: '2nd Year Working Holiday',
    tagline: 'An extra 12 months for 88 days of regional work',
    Icon: CalendarDays,
    category: 'extend',
    categoryLabel: 'Extend Your Stay',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    accentColor: 'border-emerald-200',
    stay: '+12 months',
    processingTime: '1–4 weeks',
    cost: 'A$650',
    difficulty: 1,
    summary: 'Complete 88 days of specified regional work and apply for a second 12-month Working Holiday Visa. The simplest and fastest way to extend your time in Australia.',
    requirements: [
      '88 days of eligible regional work (farm, fishing, mining, construction, etc.)',
      'Must be under 35 years old (under 31 for some nationalities)',
      'Have not previously held a 2nd year WHV',
      'Meet health and character requirements',
      'Employer declaration form (Form 1263) signed by each employer',
    ],
    nextSteps: [
      'Log your 88 days using the WHV Days Tracker tool',
      'Collect payslips and Form 1263 from each regional employer',
      'Apply online via your ImmiAccount before your current visa expires',
      'Continue working in Australia while application is processed',
    ],
    pros: ['Quick and easy to get', 'Work anywhere in Australia once approved', 'Same conditions as first WHV'],
    cons: ['Requires 88 days of specific regional work', 'Only adds 12 months', 'Not a PR pathway on its own'],
    leadsTo: ['whv-3rd', 'student-500', 'skilled-482', 'skilled-491'],
    fromVisas: ['whv'],
    forGoals: ['stay', 'all'],
    urgentNote: "Apply before your current WHV expires — you cannot apply from within Australia on a different visa.",
  },
  {
    id: 'whv-3rd',
    subclass: '417 / 462',
    name: '3rd Year Working Holiday',
    tagline: 'Another 12 months for 179 days in Northern Australia',
    Icon: CalendarDays,
    category: 'extend',
    categoryLabel: 'Extend Your Stay',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    accentColor: 'border-teal-200',
    stay: '+12 months',
    processingTime: '1–4 weeks',
    cost: 'A$650',
    difficulty: 2,
    summary: 'After completing a 2nd year WHV, do 179 days of specified work in Northern Australia to qualify for a third 12-month stay. Only available in NT, north QLD, and north WA.',
    requirements: [
      '179 days of eligible work in Northern Australia',
      'Northern Australia: all of NT, QLD north of Tropic of Capricorn, WA north of 26°S',
      'Must already hold or have held a 2nd year WHV',
      'Same health, character, and age requirements as 2nd year',
    ],
    nextSteps: [
      'Complete your 2nd year WHV first',
      'Find regional work in NT, north QLD or north WA (see WHV Jobs Board)',
      'Track your 179 days with the WHV Days Tracker',
      'Apply via ImmiAccount with employer declarations',
    ],
    pros: ['Total of 3 years in Australia possible', 'Opens doors to regional PR pathways like 491'],
    cons: ['Very restrictive to Northern Australia only', 'Harder to find 179 days of qualifying work'],
    leadsTo: ['skilled-491', 'skilled-482', 'student-500'],
    fromVisas: ['whv'],
    forGoals: ['stay', 'all'],
  },
  // ── Study ────────────────────────────────────────────────────────────────────
  {
    id: 'student-500',
    subclass: '500',
    name: 'Student Visa',
    tagline: 'Study full-time and stay for the duration of your course',
    Icon: GraduationCap,
    category: 'study',
    categoryLabel: 'Study Pathway',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    accentColor: 'border-blue-200',
    stay: 'Duration of course + extra',
    processingTime: '1–4 months',
    cost: 'A$710 + tuition fees',
    difficulty: 1,
    summary: 'Enrol in a registered Australian course (ELICOS English, TAFE, VET, or university) and stay as long as your course runs. Work up to 48 hrs/fortnight. Leads to Graduate 485 and skilled PR pathways.',
    requirements: [
      'Enrolment in a CRICOS-registered course (English, VET, TAFE, university, etc.)',
      'Genuine Temporary Entrant (GTE) statement',
      'Evidence of financial capacity',
      'English language proficiency (IELTS, PTE, TOEFL, etc.)',
      'Overseas Student Health Cover (OSHC)',
    ],
    nextSteps: [
      'Choose a course: English (3–52 weeks), TAFE (1–3 years), or university (3–4 years)',
      'Get an offer letter (CoE — Confirmation of Enrolment)',
      'Sit IELTS or PTE if required (ELICOS English courses don\'t need it)',
      'Apply online via ImmiAccount',
      'Purchase OSHC insurance',
    ],
    pros: [
      'Can stay for years depending on course',
      'Work 48 hrs/fortnight during semester, unlimited in holidays',
      'English courses are fast to get started (can start in weeks)',
      'Opens Graduate 485 and skilled PR pathways after graduation',
    ],
    cons: ['Tuition fees can be expensive', 'GTE requirement — must prove genuine intention to study', 'Must maintain enrolment and attendance'],
    leadsTo: ['graduate-485', 'skilled-189', 'skilled-190', 'skilled-491'],
    fromVisas: ['whv', 'visitor', 'graduate', 'other'],
    forGoals: ['stay', 'study', 'pr', 'all'],
    urgentNote: 'English language courses (ELICOS) are the fastest way to get a Student Visa — no IELTS required, can start within weeks.',
  },
  // ── Graduate ──────────────────────────────────────────────────────────────────
  {
    id: 'graduate-485',
    subclass: '485',
    name: 'Graduate Temporary Skill Visa',
    tagline: '2–4 years post-study to gain Australian work experience',
    Icon: Award,
    category: 'study',
    categoryLabel: 'Study Pathway',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    accentColor: 'border-indigo-200',
    stay: '18 months – 4 years',
    processingTime: '3–9 months',
    cost: 'A$1,895',
    difficulty: 2,
    summary: 'After graduating from an Australian institution, the 485 lets you work full-time for up to 4 years. This is the critical bridge between study and PR — use this time to gain skilled work experience for your 189/190/491 application.',
    requirements: [
      'Completed at least 2 years of a bachelor, master, or PhD at an Australian institution',
      'Applied within 6 months of completing study',
      'Must not have held a 485 before',
      'English proficiency: IELTS 6.0 / PTE 50',
      'Health and character checks',
    ],
    nextSteps: [
      'Apply within 6 months of receiving your final results',
      'Get a skills assessment from the relevant body (Engineers Australia, VETASSESS, etc.)',
      'Create an Expression of Interest (EOI) in SkillSelect',
      'Use 485 time to get 1–3 years of Australian work experience',
      'Apply for 189/190/491 with your boosted points score',
    ],
    pros: [
      'Full work rights, any employer',
      'Critical for gaining Australian experience (worth 5–10 extra points)',
      'Can sponsor family members',
      '4-year stay for doctoral graduates',
    ],
    cons: ['Expensive and slow to process', 'Not renewable — only one 485 allowed', 'Points test for PR still required'],
    leadsTo: ['skilled-189', 'skilled-190', 'skilled-491', 'skilled-482'],
    fromVisas: ['student'],
    forGoals: ['stay', 'pr', 'sponsored', 'all'],
  },
  // ── Sponsored ────────────────────────────────────────────────────────────────
  {
    id: 'skilled-482',
    subclass: '482 TSS',
    name: 'Temporary Skill Shortage Visa',
    tagline: 'Employer sponsors you for 2–4 years in a skilled role',
    Icon: Briefcase,
    category: 'sponsored',
    categoryLabel: 'Employer Sponsored',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    accentColor: 'border-violet-200',
    stay: '2–4 years',
    processingTime: '2–6 months',
    cost: 'A$3,115 (often employer-paid)',
    difficulty: 2,
    summary: 'An employer sponsors you for a skilled position on the MLTSSL or STSOL occupation list. Medium stream: 2 years. Long-term stream: 4 years and pathway to PR via 186. The most common route to stay long-term through work.',
    requirements: [
      'Job offer from an approved Australian employer sponsor',
      'Occupation on the MLTSSL (long-term) or STSOL (short-term) list',
      'At least 2 years of relevant work experience',
      'Skills assessment for some occupations',
      'English: IELTS 5.0+ (often 6.0+) depending on occupation',
      'Market salary rate — employer must pay market rate',
    ],
    nextSteps: [
      'Find employers willing to sponsor (tech, healthcare, trades, hospitality)',
      'Confirm your occupation is on the MLTSSL or STSOL list',
      'Negotiate sponsorship with employer (sponsor nominates you)',
      'Get skills assessment if required for your occupation',
      'Lodge application via ImmiAccount',
    ],
    pros: [
      'Long-term stream (MLTSSL) leads directly to 186 PR',
      'Employer often covers or reimburses visa fees',
      'Bring partner and children as secondary applicants',
      'Work rights for partner included',
    ],
    cons: ['Tied to your sponsoring employer (can transfer, but must find new sponsor)', 'Occupation must be on approved lists', 'Employer may not want to sponsor'],
    leadsTo: ['employer-186', 'skilled-189', 'skilled-190'],
    fromVisas: ['whv', 'student', 'graduate', 'visitor', 'other'],
    forGoals: ['stay', 'pr', 'sponsored', 'all'],
    relatedOccupations: ['Software Engineer', 'Registered Nurse', 'Chef', 'Civil Engineer', 'Electrician', 'Accountant', 'Carpenter', 'Plumber', 'Social Worker'],
  },
  {
    id: 'employer-494',
    subclass: '494',
    name: 'Regional Employer Sponsored Visa',
    tagline: 'Employer in regional AU sponsors you — leads to regional PR',
    Icon: MapPin,
    category: 'sponsored',
    categoryLabel: 'Employer Sponsored',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    accentColor: 'border-orange-200',
    stay: '5 years',
    processingTime: '2–8 months',
    cost: 'A$4,045',
    difficulty: 2,
    summary: 'A regional employer sponsors you in a skilled role in a regional area. 5-year stay with pathway to permanent 191 after 3 years. Easier to get than 482 for eligible occupations and regions.',
    requirements: [
      'Job offer from an employer in a designated regional area',
      'Occupation on the MLTSSL or regional occupation list',
      '3 years of relevant work experience',
      'English: IELTS 6.0 / PTE 50',
      'Commitment to live and work in a regional area',
    ],
    nextSteps: [
      'Find a regional employer willing to sponsor (mining, agriculture, healthcare, construction)',
      'Confirm the location qualifies as \'regional\'',
      'Employer lodges sponsorship and nomination applications',
      'You apply for the visa',
      'After 3 years, apply for 191 permanent visa',
    ],
    pros: ['5-year stay', 'Leads to PR via 191', 'Less competition than metro roles', 'Higher salary in regional areas'],
    cons: ['Must live and work in regional area', 'Less job variety', 'Partner may have limited options'],
    leadsTo: ['regional-191'],
    fromVisas: ['whv', 'graduate', 'other'],
    forGoals: ['stay', 'pr', 'sponsored', 'all'],
  },
  {
    id: 'employer-186',
    subclass: '186 ENS',
    name: 'Employer Nomination Scheme (PR)',
    tagline: 'Direct permanent residency via employer sponsorship',
    Icon: Shield,
    category: 'permanent',
    categoryLabel: 'Permanent Residency',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    accentColor: 'border-rose-200',
    stay: 'Permanent',
    processingTime: '6–18 months',
    cost: 'A$4,640 (often employer-paid)',
    difficulty: 3,
    summary: 'Permanent residency directly through your employer. Three streams: Direct Entry (fresh sponsorship), Temporary Residence Transition (from 482 after 3 years), and Labour Agreement. The fastest PR route for sponsored workers.',
    requirements: [
      'Nomination by an approved Australian employer',
      'Occupation on the MLTSSL',
      'At least 3 years with same employer (TRT stream) or 2 years experience (DE stream)',
      'Skills assessment for most occupations',
      'English: IELTS 6.0 / PTE 50 (minimum, some need higher)',
      'Age under 45 at time of nomination',
    ],
    nextSteps: [
      'Hold 482 for 3 years with same employer (TRT stream) — simplest pathway',
      'Or find an employer willing to directly sponsor for PR',
      'Employer lodges nomination with valid business justification',
      'Get skills assessment from relevant body',
      'Lodge 186 visa application',
    ],
    pros: ['Permanent residency — unlimited stay', 'Work anywhere once PR is granted', 'Full Medicare access', 'Pathway to citizenship after 4 years'],
    cons: ['Employer must genuinely nominate — some won\'t', 'Long processing time', 'Age cap of 45'],
    leadsTo: ['citizenship'],
    fromVisas: ['skilled', 'graduate', 'other'],
    forGoals: ['pr', 'sponsored', 'stay', 'all'],
    relatedOccupations: ['Registered Nurse', 'Software Engineer', 'Civil Engineer', 'Chef (trade qualified)', 'Accountant', 'Electrician', 'Plumber', 'Carpenter', 'Social Worker'],
    urgentNote: 'Get a skills assessment early — they can take 3–6 months and are required before lodging.',
  },
  // ── Permanent ─────────────────────────────────────────────────────────────────
  {
    id: 'skilled-189',
    subclass: '189',
    name: 'Skilled Independent Visa (PR)',
    tagline: 'Points-based PR — no sponsor or state nomination needed',
    Icon: Star,
    category: 'permanent',
    categoryLabel: 'Permanent Residency',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    accentColor: 'border-amber-200',
    stay: 'Permanent',
    processingTime: '8–18 months (invite dependent)',
    cost: 'A$4,640',
    difficulty: 3,
    summary: 'The "holy grail" — PR with no employer or state sponsor required. You need 65+ points on the points test, an occupation on the MLTSSL, a skills assessment, and an invitation. Highly competitive.',
    requirements: [
      'Occupation on the MLTSSL (Medium and Long-Term Strategic Skills List)',
      'Positive skills assessment from the relevant assessing body',
      'Minimum 65 points on the points test (most invitations need 80–90+)',
      'Under 45 years of age',
      'English: IELTS 7.0+ / PTE 65+ (earns more points)',
      'Expression of Interest (EOI) submitted in SkillSelect',
    ],
    nextSteps: [
      'Check if your occupation is on the MLTSSL (see Home Affairs website)',
      'Get a skills assessment (TRA, VETASSESS, Engineers Australia, ACS, etc.)',
      'Sit IELTS or PTE — aim for 8 (Superior) band for max points',
      'Calculate your points score at immi.homeaffairs.gov.au',
      'Lodge an EOI in SkillSelect and wait for an invitation',
      'Once invited, lodge your visa application within 60 days',
    ],
    pros: ['No employer or state sponsor needed', 'Full work rights — work for any employer', 'Pathway to citizenship', 'No regional restrictions'],
    cons: ['Very competitive — invitation points are high', 'Can wait years for an invitation', 'Skills assessment required'],
    leadsTo: ['citizenship'],
    fromVisas: ['whv', 'student', 'graduate', 'skilled', 'other'],
    forGoals: ['pr', 'stay', 'all'],
    relatedOccupations: ['Software Engineer', 'Registered Nurse', 'Civil Engineer', 'Accountant', 'Architect', 'Data Analyst', 'Construction Project Manager', 'Physiotherapist'],
  },
  {
    id: 'skilled-190',
    subclass: '190',
    name: 'Skilled Nominated Visa (PR)',
    tagline: 'State or territory nominates you for PR — 5 extra points',
    Icon: MapPin,
    category: 'permanent',
    categoryLabel: 'Permanent Residency',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    accentColor: 'border-cyan-200',
    stay: 'Permanent',
    processingTime: '9–18 months',
    cost: 'A$4,640',
    difficulty: 3,
    summary: 'Similar to 189 but a state or territory nominates you, adding 5 points to your score. You must commit to living and working in the nominating state for at least 2 years. Each state has its own occupation list and requirements.',
    requirements: [
      'Occupation on the relevant state\'s occupation list',
      'Positive skills assessment',
      'Minimum 65 points (nomination adds 5 more)',
      'Meet the state\'s specific requirements (often includes work/study in that state)',
      'English: IELTS 6.0+ / PTE 50+',
      'Under 45 years of age',
    ],
    nextSteps: [
      'Check each state\'s occupation and requirements list (NSW, VIC, QLD, SA, WA, TAS have state nomination)',
      'Get a skills assessment',
      'Submit an EOI in SkillSelect',
      'Apply for state nomination directly through the state\'s migration website',
      'Once nominated, receive an invitation and lodge your 190 application',
    ],
    pros: ['+5 points from nomination (makes 60-point applicants viable)', 'Many states have different occupation lists', 'Permanent visa — pathway to citizenship'],
    cons: ['Must live in nominating state for 2 years', 'State nomination is competitive and quotas fill fast', 'Additional state application process'],
    leadsTo: ['citizenship'],
    fromVisas: ['whv', 'student', 'graduate', 'skilled', 'other'],
    forGoals: ['pr', 'stay', 'all'],
    relatedOccupations: ['Teacher', 'Registered Nurse', 'Social Worker', 'Midwife', 'Physiotherapist', 'Plumber', 'Electrician', 'Carpenter', 'Software Developer'],
  },
  {
    id: 'skilled-491',
    subclass: '491',
    name: 'Skilled Work Regional Visa',
    tagline: 'Regional provisional visa — easier points, leads to 191 PR',
    Icon: Navigation,
    category: 'permanent',
    categoryLabel: 'Regional → PR',
    iconBg: 'bg-lime-100',
    iconColor: 'text-lime-700',
    accentColor: 'border-lime-200',
    stay: '5 years (→ 191 PR after 3)',
    processingTime: '4–12 months',
    cost: 'A$4,045',
    difficulty: 2,
    summary: 'A provisional visa requiring lower points than 189/190. Live and work in regional Australia for 3 years, then apply for permanent 191 visa. State or family sponsored. This is the most accessible PR pathway for many migrants.',
    requirements: [
      'Nomination by a state/territory OR sponsorship by eligible relative in regional area',
      'Occupation on the MLTSSL or ROL',
      'Positive skills assessment',
      'Minimum 65 points on the points test (nomination adds 15 points)',
      'English: IELTS 6.0 / PTE 50',
      'Under 45 years of age',
    ],
    nextSteps: [
      'Check your occupation on the MLTSSL or ROL',
      'Get a skills assessment',
      'Calculate points — 491 adds 15 bonus points for regional sponsorship',
      'Apply for state nomination or get sponsored by an eligible family member in regional AU',
      'Live and work in a designated regional area for 3 years',
      'Apply for 191 permanent visa after meeting residency requirements',
    ],
    pros: ['+15 points from regional nomination (big boost)', '5-year stay with pathway to PR', 'Much lower competition than 189/190', 'More states and occupations eligible'],
    cons: ['Must live in regional area for 3 years', 'Provisional — not immediately PR', 'Family sponsorship option requires qualifying relative'],
    leadsTo: ['regional-191'],
    fromVisas: ['whv', 'student', 'graduate', 'skilled', 'other'],
    forGoals: ['pr', 'stay', 'all'],
    urgentNote: '491 adds 15 extra points — a 65-point applicant can effectively have 80 points, making invitations much more realistic.',
  },
  {
    id: 'regional-191',
    subclass: '191',
    name: 'Permanent Residence (Regional)',
    tagline: 'Permanent residency after 3 years on 491 or 494',
    Icon: CheckCircle2,
    category: 'permanent',
    categoryLabel: 'Permanent Residency',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    accentColor: 'border-emerald-200',
    stay: 'Permanent',
    processingTime: '6–12 months',
    cost: 'A$2,645',
    difficulty: 1,
    summary: 'After living and working in regional Australia for 3 years on a 491 or 494 visa, you\'re eligible for the 191 permanent residency. It\'s the final step in the regional PR pathway.',
    requirements: [
      '3 years of living in a designated regional area while on 491 or 494',
      '3 years of meeting the annual income threshold (currently ~A$53,900)',
      'Compliance with visa conditions during 491/494',
      'Health and character requirements',
    ],
    nextSteps: [
      'Track your 3 years of regional residence',
      'Keep payslips proving you met the income threshold each year',
      'Lodge 191 application once eligible (must apply while 491/494 is valid)',
    ],
    pros: ['Near-automatic PR after 3 years if requirements met', 'No points test', 'Can then move to any Australian city'],
    cons: ['Must complete 3 years in regional area first', 'Income threshold must be met each year'],
    leadsTo: ['citizenship'],
    fromVisas: ['skilled', 'other'],
    forGoals: ['pr', 'all'],
  },
  // ── Family ────────────────────────────────────────────────────────────────────
  {
    id: 'partner-820',
    subclass: '820 / 801',
    name: 'Partner Visa',
    tagline: 'Stay through a genuine de facto or married relationship',
    Icon: Heart,
    category: 'family',
    categoryLabel: 'Family / Partner',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    accentColor: 'border-pink-200',
    stay: '2 years provisional → permanent',
    processingTime: '24–48 months',
    cost: 'A$8,850 (both stages)',
    difficulty: 2,
    summary: 'If you\'re in a genuine de facto or married relationship with an Australian citizen or PR holder, the partner visa gives you temporary then permanent residence. The 820 is temporary (~2 years) and automatically becomes the 801 permanent visa.',
    requirements: [
      'Genuine de facto or married relationship with an Australian citizen or PR holder',
      'Relationship must be registered or have been de facto for at least 12 months (exceptions apply)',
      'Joint evidence: finances, cohabitation, social acknowledgement',
      'Sponsor must be over 18 and meet income/background requirements',
      'Health and police checks',
    ],
    nextSteps: [
      'Gather evidence of your genuine relationship (joint bank accounts, lease, photos, statements from friends/family)',
      'Both you and your partner complete statutory declarations',
      'Apply online — you can apply while in Australia',
      'Receive bridging visa while 820 is processed (work rights included)',
      'After 2 years, 801 permanent visa is granted if relationship is ongoing',
    ],
    pros: ['Work rights from day one (on bridging)', 'Can stay in Australia throughout processing', 'Leads directly to PR', 'No occupation or points requirement'],
    cons: ['Very slow (2–4 year wait)', 'Very expensive', 'Must prove genuine ongoing relationship', 'Sponsor accountability'],
    leadsTo: ['citizenship'],
    fromVisas: ['whv', 'visitor', 'student', 'graduate', 'other'],
    forGoals: ['family', 'stay', 'pr', 'all'],
  },
  // ── Business ─────────────────────────────────────────────────────────────────
  {
    id: 'business-188',
    subclass: '188',
    name: 'Business Innovation & Investment',
    tagline: 'Stay via business ownership or investment in Australia',
    Icon: Building2,
    category: 'business',
    categoryLabel: 'Business & Investment',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    accentColor: 'border-slate-200',
    stay: '4 years provisional',
    processingTime: '12–36 months',
    cost: 'A$9,595+',
    difficulty: 3,
    summary: 'For entrepreneurs, investors, and business owners who want to establish or invest in an Australian business. Multiple streams: Business Innovation (own/manage a business), Investor, Significant Investor, and Entrepreneur streams.',
    requirements: [
      'Business stream: A$400K+ in business assets and turnover, ownership/management of a qualifying business',
      'Investor stream: A$2.5M in assets, invest A$1.5M in state bonds',
      'Entrepreneur stream: A$200K funding from eligible AU body and endorsement',
      'State nomination required',
      'Points test for some streams',
    ],
    nextSteps: [
      'Determine which stream you qualify for (Business, Investor, Entrepreneur)',
      'Contact the relevant state migration authority to discuss nomination',
      'Get a business or migration agent to assess your eligibility',
      'Prepare business/financial documentation',
      'Lodge EOI then visa application after state nomination',
    ],
    pros: ['Stay and build a business in Australia', 'Pathway to 888 permanent visa', 'Family can join'],
    cons: ['Very complex and expensive', 'Requires significant business assets or capital', 'State nomination required'],
    leadsTo: ['business-888'],
    fromVisas: ['visitor', 'whv', 'other'],
    forGoals: ['business', 'pr', 'stay', 'all'],
    urgentNote: 'Complex applications — a MARA-registered migration agent is strongly recommended.',
  },
];

// ─── Services ─────────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
  {
    id: 'svc-001',
    name: 'Pathways Migration Agents',
    type: 'migration-agent',
    typeLabel: 'MARA Migration Agent',
    tagline: 'MARA-registered agents for skilled, sponsored & PR visas',
    description: 'Sydney-based registered migration agents specialising in skilled worker visas (482, 186, 189, 190, 491). Free initial consultation. Fixed-fee packages available.',
    specialties: ['482 TSS Sponsorship', '186 Employer PR', '189/190/491 PR', 'Points test advice'],
    languages: ['English', 'Mandarin', 'Tagalog'],
    priceFrom: 'From A$1,500',
    contact: 'info@pathwaysmigration.com.au',
    badge: 'Free consult',
  },
  {
    id: 'svc-002',
    name: 'Oz Visa Hub',
    type: 'migration-agent',
    typeLabel: 'MARA Migration Agent',
    tagline: 'Student, graduate, and working holiday visa specialists',
    description: 'Melbourne-based agents with a focus on WHV extensions, Student 500 transitions, and Graduate 485 applications. Multilingual team serving the international student community.',
    specialties: ['WHV 2nd & 3rd year', 'Student Visa 500', 'Graduate 485', 'Partner Visa'],
    languages: ['English', 'Korean', 'Hindi', 'Vietnamese'],
    priceFrom: 'From A$800',
    contact: 'hello@ozvisa.com.au',
    badge: 'Multilingual',
  },
  {
    id: 'svc-003',
    name: 'Regional Visa Solutions',
    type: 'migration-agent',
    typeLabel: 'MARA Migration Agent',
    tagline: 'Regional and employer-sponsored visa experts',
    description: 'Specialists in regional visas — 491, 494, 191, and regional employer sponsorship. Strong network of regional employers looking to sponsor skilled workers.',
    specialties: ['491 / 494 Regional', '191 Permanent', 'Regional employer matching', 'WHV 3rd year'],
    languages: ['English', 'Nepali', 'Bengali'],
    priceFrom: 'From A$1,200',
    contact: 'apply@regionalvisa.com.au',
  },
  {
    id: 'svc-004',
    name: 'Sydney Language Centre (ELICOS)',
    type: 'education',
    typeLabel: 'English Language School',
    tagline: 'CRICOS-registered English courses — Student Visa pathway',
    description: 'Intensive and standard English courses from 10 to 52 weeks. CRICOS registered so you can apply for a Student Visa. No IELTS needed to start. Courses include IELTS preparation, General English, Business English, and Cambridge exam prep.',
    specialties: ['General English (10–52 weeks)', 'IELTS Preparation', 'Business English', 'Student Visa support'],
    languages: ['All nationalities welcome'],
    priceFrom: 'From A$300/week',
    contact: 'enrol@sydneylanguage.edu.au',
    badge: 'No IELTS needed',
  },
  {
    id: 'svc-005',
    name: 'TAFE NSW — International Pathways',
    type: 'education',
    typeLabel: 'TAFE / VET Provider',
    tagline: 'Vocational qualifications that count toward skilled PR',
    description: 'TAFE NSW offers CRICOS-registered Certificate III, IV and Diploma courses in trades, hospitality, IT, health, and business. VET qualifications are recognised for skills assessments and PR pathways. Intakes every term.',
    specialties: ['Certificate III/IV trades', 'Diploma of IT', 'Diploma of Community Services', 'Hospitality certificates'],
    languages: ['English'],
    priceFrom: 'From A$7,000/year',
    contact: 'international@tafensw.edu.au',
    badge: 'PR-linked courses',
  },
  {
    id: 'svc-006',
    name: 'UniPathways Australia',
    type: 'education',
    typeLabel: 'University Pathway',
    tagline: 'Foundation and diploma programs into top Australian universities',
    description: 'Pathways into Australian universities via Foundation Year or Diploma programs. Ideal for WHV holders wanting to study long-term. Guaranteed progression to partner universities upon completion. Qualifies for Graduate 485 visa.',
    specialties: ['University Foundation Year', 'Diploma of Business', 'Diploma of IT', 'Guaranteed uni progression'],
    priceFrom: 'From A$15,000/year',
    contact: 'enquiry@unipathways.edu.au',
  },
  {
    id: 'svc-007',
    name: 'TRA — Trades Recognition Australia',
    type: 'skills-assessment',
    typeLabel: 'Skills Assessment Body',
    tagline: 'Official skills assessment for trade occupations',
    description: 'The Australian Government body that assesses overseas trade qualifications for PR and sponsorship applications. Covers electricians, plumbers, carpenters, welders, mechanics, and more. Required for 482, 186, 189, 190 and 491 applications.',
    specialties: ['Electrician', 'Plumber', 'Carpenter / Joiner', 'Welder', 'Auto Mechanic', '100+ trade occupations'],
    priceFrom: 'From A$950',
    contact: 'info@tra.gov.au',
    website: 'tra.gov.au',
    badge: 'Government body',
  },
  {
    id: 'svc-008',
    name: 'VETASSESS',
    type: 'skills-assessment',
    typeLabel: 'Skills Assessment Body',
    tagline: 'Skills assessment for professional and technical occupations',
    description: 'VETASSESS is the leading skills assessment body for over 350 professional and technical occupations including chefs, IT support, marketing, business, real estate, and social work. Recognised by Home Affairs for all skilled visa applications.',
    specialties: ['Chefs / Cooks', 'IT professionals', 'Business analysts', 'Social workers', 'Real estate agents', '350+ occupations'],
    priceFrom: 'From A$850',
    contact: 'skills@vetassess.com.au',
    website: 'vetassess.com.au',
    badge: '350+ occupations',
  },
  {
    id: 'svc-009',
    name: 'IELTS Ready Online',
    type: 'english',
    typeLabel: 'English Test Preparation',
    tagline: 'IELTS & PTE preparation to maximise your points',
    description: 'Online and in-person IELTS and PTE Academic preparation courses tailored for skilled visa applicants. Each band increase in IELTS can add 10–20 points to your PR score. Flexible scheduling with mock tests.',
    specialties: ['IELTS Academic & General', 'PTE Academic', 'Mock exam practice', 'Writing and speaking coaching'],
    languages: ['All languages welcome'],
    priceFrom: 'From A$299 (online course)',
    contact: 'start@ieltsready.com.au',
    badge: 'Score guarantee',
  },
  {
    id: 'svc-010',
    name: 'Skilled Hire AU',
    type: 'recruitment',
    typeLabel: 'Sponsorship Recruitment',
    tagline: 'Find employers willing to sponsor your 482 or 186 visa',
    description: 'A recruitment agency specialising in connecting skilled migrants with Australian employers who are actively looking to sponsor. Industries: construction, IT, healthcare, hospitality, and engineering. Free for job seekers.',
    specialties: ['482 TSS sponsorship roles', '186 PR-track positions', 'FIFO mining and construction', 'Regional employer sponsorship'],
    languages: ['English', 'Mandarin', 'Filipino', 'Spanish'],
    priceFrom: 'Free for candidates',
    contact: 'talent@skilledhire.com.au',
    badge: 'Free for candidates',
  },
];

// ─── Recommendation logic ─────────────────────────────────────────────────────

const PATHWAY_RELEVANCE: Record<CurrentVisa, Record<Goal, string[]>> = {
  whv: {
    stay:      ['whv-2nd', 'whv-3rd', 'student-500', 'skilled-482'],
    pr:        ['skilled-491', 'skilled-190', 'skilled-189', 'employer-186'],
    sponsored: ['skilled-482', 'employer-494', 'employer-186'],
    study:     ['student-500'],
    family:    ['partner-820'],
    business:  ['business-188'],
    all:       ['whv-2nd', 'whv-3rd', 'student-500', 'skilled-491', 'skilled-482'],
  },
  student: {
    stay:      ['graduate-485', 'skilled-482', 'skilled-491'],
    pr:        ['graduate-485', 'skilled-189', 'skilled-190', 'skilled-491'],
    sponsored: ['skilled-482', 'employer-186'],
    study:     ['graduate-485'],
    family:    ['partner-820'],
    business:  ['business-188'],
    all:       ['graduate-485', 'skilled-189', 'skilled-190', 'skilled-491', 'skilled-482'],
  },
  graduate: {
    stay:      ['skilled-482', 'skilled-491', 'skilled-190'],
    pr:        ['skilled-189', 'skilled-190', 'skilled-491', 'employer-186'],
    sponsored: ['skilled-482', 'employer-186', 'employer-494'],
    study:     ['student-500'],
    family:    ['partner-820'],
    business:  ['business-188'],
    all:       ['skilled-189', 'skilled-190', 'skilled-491', 'skilled-482', 'employer-186'],
  },
  skilled: {
    stay:      ['employer-186', 'skilled-491', 'skilled-190'],
    pr:        ['employer-186', 'skilled-189', 'skilled-190', 'skilled-491'],
    sponsored: ['employer-186', 'skilled-482'],
    study:     ['student-500'],
    family:    ['partner-820'],
    business:  ['business-188'],
    all:       ['employer-186', 'skilled-189', 'skilled-190', 'skilled-491'],
  },
  visitor: {
    stay:      ['student-500', 'partner-820', 'skilled-482'],
    pr:        ['skilled-189', 'skilled-190', 'skilled-491', 'partner-820'],
    sponsored: ['skilled-482', 'employer-494'],
    study:     ['student-500'],
    family:    ['partner-820'],
    business:  ['business-188'],
    all:       ['student-500', 'partner-820', 'skilled-482', 'skilled-491'],
  },
  other: {
    stay:      ['student-500', 'skilled-482', 'partner-820'],
    pr:        ['skilled-189', 'skilled-190', 'skilled-491', 'employer-186'],
    sponsored: ['skilled-482', 'employer-494', 'employer-186'],
    study:     ['student-500'],
    family:    ['partner-820'],
    business:  ['business-188'],
    all:       ['student-500', 'skilled-491', 'skilled-190', 'skilled-482', 'partner-820'],
  },
};

function getDifficultyLabel(d: 1 | 2 | 3) {
  return d === 1 ? 'Straightforward' : d === 2 ? 'Moderate' : 'Complex';
}
function getDifficultyColor(d: 1 | 2 | 3) {
  return d === 1 ? 'text-emerald-600 bg-emerald-50' : d === 2 ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50';
}

const SERVICE_TYPE_COLORS: Record<string, string> = {
  'migration-agent': 'bg-violet-100 text-violet-700',
  'education': 'bg-blue-100 text-blue-700',
  'skills-assessment': 'bg-amber-100 text-amber-700',
  'english': 'bg-teal-100 text-teal-700',
  'recruitment': 'bg-emerald-100 text-emerald-700',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PathwayCard({ pathway, expanded, onToggle }: {
  pathway: Pathway;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { Icon } = pathway;
  return (
    <div className={clsx('bg-white border-2 rounded-2xl shadow-sm transition-all', pathway.accentColor)}>
      {/* Header */}
      <button onClick={onToggle} className="w-full text-left p-5">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${pathway.iconBg}`}>
            <Icon className={`w-5 h-5 ${pathway.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{pathway.categoryLabel} — Subclass {pathway.subclass}</span>
                <h3 className="text-sm font-bold text-slate-800 leading-tight">{pathway.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{pathway.tagline}</p>
              </div>
              {expanded
                ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />}
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                <Clock className="w-2.5 h-2.5" />{pathway.stay}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                <CalendarDays className="w-2.5 h-2.5" />{pathway.processingTime}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                <DollarSign className="w-2.5 h-2.5" />{pathway.cost}
              </span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getDifficultyColor(pathway.difficulty)}`}>
                {getDifficultyLabel(pathway.difficulty)}
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">{pathway.summary}</p>

          {pathway.urgentNote && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{pathway.urgentNote}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Requirements</h4>
              <ul className="space-y-1.5">
                {pathway.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Next Steps</h4>
              <ol className="space-y-1.5">
                {pathway.nextSteps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Pros</h4>
              <ul className="space-y-1">
                {pathway.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                    <TrendingUp className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3">
              <h4 className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-2">Cons</h4>
              <ul className="space-y-1">
                {pathway.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                    <AlertTriangle className="w-3 h-3 text-rose-400 mt-0.5 shrink-0" />{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {pathway.relatedOccupations && (
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Common Occupations</h4>
              <div className="flex flex-wrap gap-1.5">
                {pathway.relatedOccupations.map((o) => (
                  <span key={o} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-full">{o}</span>
                ))}
              </div>
            </div>
          )}

          {pathway.leadsTo.length > 0 && (
            <div className="pt-1">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Can Lead To</h4>
              <div className="flex flex-wrap gap-2">
                {pathway.leadsTo.map((id) => {
                  const next = PATHWAYS.find((p) => p.id === id);
                  if (!next) return null;
                  return (
                    <span key={id} className={`flex items-center gap-1 px-2.5 py-1 border rounded-full text-[11px] font-semibold ${next.iconBg} ${next.iconColor} border-current/20`}>
                      <ArrowRight className="w-3 h-3" />
                      {next.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ServiceCard({ svc }: { svc: Service }) {
  const typeColor = SERVICE_TYPE_COLORS[svc.type] ?? 'bg-slate-100 text-slate-600';
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-sm font-bold text-slate-800">{svc.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{svc.tagline}</p>
        </div>
        {svc.badge && (
          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full border border-teal-200">{svc.badge}</span>
        )}
      </div>
      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${typeColor}`}>{svc.typeLabel}</span>
      <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{svc.description}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {svc.specialties.slice(0, 4).map((s) => (
          <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full">{s}</span>
        ))}
      </div>
      {svc.languages && (
        <p className="text-[10px] text-slate-400 mb-2">Languages: {svc.languages.join(', ')}</p>
      )}
      <div className="flex items-center justify-between">
        {svc.priceFrom && <p className="text-xs font-semibold text-teal-700">{svc.priceFrom}</p>}
        {svc.contact && (
          <a href={`mailto:${svc.contact}`} className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Contact <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function VisaPathwaysPage() {
  const [currentVisa, setCurrentVisa] = useState<CurrentVisa | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [serviceFilter, setServiceFilter] = useState<Service['type'] | 'all'>('all');

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const recommended = useMemo(() => {
    if (!currentVisa || !goal) return [];
    const ids = PATHWAY_RELEVANCE[currentVisa]?.[goal] ?? [];
    return ids.map((id) => PATHWAYS.find((p) => p.id === id)).filter(Boolean) as Pathway[];
  }, [currentVisa, goal]);

  const remaining = useMemo(() => {
    const recIds = new Set(recommended.map((p) => p.id));
    return PATHWAYS.filter((p) => !recIds.has(p.id));
  }, [recommended]);

  const filteredServices = useMemo(() => {
    if (serviceFilter === 'all') return SERVICES;
    return SERVICES.filter((s) => s.type === serviceFilter);
  }, [serviceFilter]);

  const hasSelection = currentVisa && goal;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/tools" className="flex items-center gap-1.5 text-indigo-300 hover:text-white text-xs mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Tools
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Visa Pathways</h1>
              <p className="text-indigo-200 text-sm max-w-xl">
                Find the best way to stay in Australia longer, get employer sponsorship, or achieve permanent residency — based on your current visa and goals.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Filter panel ──────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-indigo-500" />
            Tell us your situation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">What visa are you currently on?</p>
              <div className="space-y-2">
                {CURRENT_VISA_OPTIONS.map(({ value, label, sublabel, Icon }) => (
                  <button key={value} onClick={() => setCurrentVisa(value)}
                    className={clsx('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all text-sm', {
                      'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-200': currentVisa === value,
                      'border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/40': currentVisa !== value,
                    })}>
                    <Icon className={clsx('w-4 h-4 shrink-0', currentVisa === value ? 'text-indigo-600' : 'text-slate-400')} />
                    <div>
                      <p className={clsx('text-xs font-semibold', currentVisa === value ? 'text-indigo-800' : 'text-slate-700')}>{label}</p>
                      <p className="text-[10px] text-slate-400">{sublabel}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">What is your main goal?</p>
              <div className="space-y-2">
                {GOAL_OPTIONS.map(({ value, label, sublabel, Icon }) => (
                  <button key={value} onClick={() => setGoal(value)}
                    className={clsx('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all', {
                      'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-200': goal === value,
                      'border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/40': goal !== value,
                    })}>
                    <Icon className={clsx('w-4 h-4 shrink-0', goal === value ? 'text-indigo-600' : 'text-slate-400')} />
                    <div>
                      <p className={clsx('text-xs font-semibold', goal === value ? 'text-indigo-800' : 'text-slate-700')}>{label}</p>
                      <p className="text-[10px] text-slate-400">{sublabel}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recommended pathways ──────────────────────────────────────────── */}
        {hasSelection && recommended.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Recommended for you</h2>
              <span className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">{recommended.length}</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Based on your current visa and goal — ranked by relevance.</p>
            <div className="space-y-3">
              {recommended.map((p, i) => (
                <div key={p.id} className="relative">
                  {i === 0 && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <span className="flex items-center gap-0.5 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow">
                        <Star className="w-2.5 h-2.5" /> Best match
                      </span>
                    </div>
                  )}
                  <PathwayCard
                    pathway={p}
                    expanded={expandedIds.has(p.id)}
                    onToggle={() => toggleExpand(p.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasSelection && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">Select your visa and goal above</p>
            <p className="text-xs text-slate-400">We&apos;ll show you the most relevant visa pathways for your situation.</p>
          </div>
        )}

        {/* ── All pathways ──────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            {hasSelection ? 'Other Pathways to Explore' : 'All Visa Pathways'}
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            {PATHWAYS.length} pathways covering all stay durations, sponsorship options, study routes, and permanent residency options.
          </p>
          <div className="space-y-3">
            {(hasSelection ? remaining : PATHWAYS).map((p) => (
              <PathwayCard
                key={p.id}
                pathway={p}
                expanded={expandedIds.has(p.id)}
                onToggle={() => toggleExpand(p.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Key links ─────────────────────────────────────────────────────── */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-indigo-800">Official Resources</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Check your points score', desc: 'Points calculator on Home Affairs', icon: TrendingUp },
              { label: 'SkillSelect EOI portal', desc: 'Submit Expression of Interest', icon: Globe },
              { label: 'Occupation lists (MLTSSL)', desc: 'Check if your job is eligible', icon: Briefcase },
            ].map(({ label, desc, icon: Icon }) => (
              <div key={label} className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-indigo-100">
                <Icon className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-700">{label}</p>
                  <p className="text-[10px] text-slate-400">{desc}</p>
                  <p className="text-[10px] text-indigo-500 font-medium mt-0.5">immi.homeaffairs.gov.au</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Related tools ─────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: '/tools/whv-tracker', icon: CalendarDays, color: 'bg-emerald-100 text-emerald-600', label: 'WHV Days Tracker', desc: 'Track 88 or 179 regional work days' },
              { href: '/tools/tax-calculator', icon: DollarSign, color: 'bg-indigo-100 text-indigo-600', label: 'Tax Calculator', desc: 'Estimate your AU tax refund' },
              { href: '/tools/hours-tracker', icon: Clock, color: 'bg-blue-100 text-blue-600', label: 'Work Hours Tracker', desc: 'Log fortnightly work hours' },
            ].map(({ href, icon: Icon, color, label, desc }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{label}</p>
                  <p className="text-[10px] text-slate-400">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-indigo-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Services directory ────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Migration Services & Offers</h2>
              <p className="text-xs text-slate-400 mt-0.5">Migration agents, education providers, skills assessment, English prep, and recruitment.</p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {([
              { value: 'all', label: 'All' },
              { value: 'migration-agent', label: 'Migration Agents' },
              { value: 'education', label: 'Education' },
              { value: 'skills-assessment', label: 'Skills Assessment' },
              { value: 'english', label: 'English Prep' },
              { value: 'recruitment', label: 'Recruitment' },
            ] as { value: Service['type'] | 'all'; label: string }[]).map(({ value, label }) => (
              <button key={value} onClick={() => setServiceFilter(value)}
                className={clsx('px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors', {
                  'bg-indigo-600 text-white border-indigo-600': serviceFilter === value,
                  'bg-white text-slate-600 border-slate-200 hover:border-indigo-300': serviceFilter !== value,
                })}>
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredServices.map((svc) => <ServiceCard key={svc.id} svc={svc} />)}
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex items-start gap-2.5 text-xs text-amber-700">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">Disclaimer</p>
                <p>Services listed are examples only. Always verify that a migration agent is MARA-registered at <strong>mara.gov.au</strong> before engaging them. Visa requirements change — check <strong>immi.homeaffairs.gov.au</strong> for the latest rules before applying.</p>
              </div>
            </div>
          </div>
        </div>

        <Link href="/jobs" className="flex items-center justify-center gap-2 w-full py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all bg-white shadow-sm">
          Browse sponsorship-friendly jobs
          <ArrowRight className="w-4 h-4" />
        </Link>

      </div>
    </main>
  );
}

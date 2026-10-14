import dayjs from 'dayjs';
import { Project, Report } from '@/types';
import { ReportColor } from './colors';

// Fictional people, clients, and links used only by the public demo.

interface SeedReport {
  name: string;
  due: number | null; // days from today
  completed?: boolean;
  archived?: boolean;
  color?: ReportColor;
  notes?: string;
}

interface SeedProject {
  owners: string[];
  accounts: string[];
  files: string[];
  reports: SeedReport[];
}

const SEED: SeedProject[] = [
  {
    owners: ['Maya Chen', 'Leo Park'],
    accounts: ['Northwind Coffee'],
    files: [
      'docs.google.com/spreadsheets/d/demo-northwind-tracker',
      'docs.google.com/presentation/d/demo-northwind-qbr',
    ],
    reports: [
      { name: 'Q3 Campaign Recap', due: -6, completed: true, color: 'amber', notes: '<p>Sent to client. They asked for a follow-up on <strong>store visits</strong> by region.</p>' },
      { name: 'Store Visit Lift Study', due: 4, color: 'amber', notes: '<p>Waiting on the foot traffic export from the vendor.</p><ul><li><p>Control group: Ontario stores</p></li><li><p>Test group: BC and Alberta</p></li></ul>' },
      { name: 'Holiday Media Plan Benchmarks', due: 18, color: 'amber' },
    ],
  },
  {
    owners: ['Priya Nair'],
    accounts: ['Bluebird Bank', 'Sam Ortiz'],
    files: ['docs.google.com/document/d/demo-bluebird-brief', 'lookerstudio.google.com'],
    reports: [
      { name: 'Monthly Paid Social Dashboard', due: 1, color: 'sky', notes: '<p>Refresh the Looker Studio data source before sharing.</p>' },
    ],
  },
  {
    owners: ['Leo Park'],
    accounts: ['Harbour Health'],
    files: ['docs.google.com/spreadsheets/d/demo-harbour-kpis'],
    reports: [
      { name: 'Brand Health Tracker Wave 2', due: -2, color: 'emerald', notes: '<p><em>Past due.</em> Survey closed late, fielding ended on Friday.</p>' },
      { name: 'Wave 2 Executive Summary', due: 9, color: 'emerald' },
    ],
  },
  {
    owners: ['Jordan Blake', 'Maya Chen'],
    accounts: ['Tundra Outdoor', 'Riley Fox'],
    files: ['docs.google.com/presentation/d/demo-tundra-deck', 'tundraoutdoor.example.com/campaign'],
    reports: [
      { name: 'Search Performance Deep Dive', due: 0, color: 'violet', notes: '<p>Focus on <strong>non-brand</strong> terms. Riley wants a slide on CPC trends.</p>' },
      { name: 'Audience Segmentation Refresh', due: 7, color: 'violet' },
      { name: 'Creative Testing Readout', due: 14, color: 'violet' },
      { name: 'Attribution Model Review', due: 23, color: 'violet' },
    ],
  },
  {
    owners: ['Priya Nair', 'Jordan Blake'],
    accounts: ['Cedar & Co.'],
    files: [],
    reports: [
      { name: 'Website Analytics Audit', due: 3, completed: true, color: 'rose' },
    ],
  },
  {
    owners: ['Maya Chen'],
    accounts: ['Lumen Energy', 'Alex Kim'],
    files: ['docs.google.com/spreadsheets/d/demo-lumen-forecast'],
    reports: [
      { name: 'Q4 Forecast Model', due: 11, color: 'indigo', notes: '<p>Use last year\'s seasonality curve. Check assumptions with Alex.</p>' },
      { name: 'Budget Pacing Report', due: 25, color: 'indigo' },
    ],
  },
  {
    owners: ['Sofia Reyes'],
    accounts: ['Northwind Coffee', 'Bluebird Bank'],
    files: ['docs.google.com/document/d/demo-competitive-scan'],
    reports: [
      { name: 'Competitive Landscape Scan', due: 6, color: 'teal' },
      { name: 'Share of Voice Snapshot', due: 13, color: 'teal' },
    ],
  },
  {
    owners: ['Leo Park', 'Sofia Reyes'],
    accounts: ['Harbour Health', 'Dana Wells'],
    files: [],
    reports: [
      { name: 'Patient Journey Mapping', due: 20, color: 'pink' },
      { name: 'Journey Mapping Workshop Notes', due: null },
    ],
  },
  {
    owners: ['Jordan Blake'],
    accounts: ['Pinecrest Foods'],
    files: ['docs.google.com/spreadsheets/d/demo-pinecrest-retail'],
    reports: [
      { name: 'Retail Media Weekly', due: 2, color: 'orange' },
      { name: 'Retail Media Weekly', due: 9, color: 'orange' },
      { name: 'Retail Media Weekly', due: 16, color: 'orange' },
      { name: 'Retail Media Weekly', due: 23, color: 'orange' },
    ],
  },
  {
    owners: ['Maya Chen', 'Priya Nair'],
    accounts: ['Internal'],
    files: ['docs.google.com/document/d/demo-team-playbook'],
    reports: [
      { name: 'Reporting Playbook Update', due: 28, notes: '<p>Add a section on naming conventions for dashboards.</p>' },
    ],
  },
  {
    owners: ['Sofia Reyes'],
    accounts: ['Tundra Outdoor'],
    files: [],
    reports: [
      { name: 'Summer Campaign Wrap Report', due: -12, completed: true, archived: true, color: 'lime' },
      { name: 'Summer Influencer Recap', due: -9, completed: true, archived: true, color: 'lime' },
    ],
  },
  {
    owners: ['Leo Park'],
    accounts: ['Cedar & Co.'],
    files: [],
    reports: [
      { name: 'Loyalty Program Analysis', due: -4, completed: true, archived: true, color: 'cyan' },
    ],
  },
];

let counter = 0;
const demoId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `demo-${++counter}`);

export function createDemoData(): { projects: Project[]; reports: Report[] } {
  const today = dayjs().startOf('day');
  const base = dayjs().subtract(SEED.length, 'hour');
  const projects: Project[] = [];
  const reports: Report[] = [];

  SEED.forEach((seed, pi) => {
    const created_at = base.add(pi, 'hour').toISOString();
    const project: Project = {
      id: demoId(),
      owners: seed.owners,
      accounts: seed.accounts,
      files: seed.files,
      created_at,
    };
    projects.push(project);

    seed.reports.forEach((r, ri) => {
      reports.push({
        id: demoId(),
        project_id: project.id,
        name: r.name,
        due_date: r.due === null ? null : today.add(r.due, 'day').format('YYYY-MM-DD'),
        completed: r.completed ?? false,
        order: ri,
        notes: r.notes ?? null,
        archived: r.archived ?? false,
        color: r.color ?? null,
        created_at,
      });
    });
  });

  return { projects, reports };
}

INSERT OR IGNORE INTO user (
  id, name, email, email_verified, created_at, updated_at
) VALUES (
  'example-founder',
  'Example Founder',
  'examples@saaslist.local',
  1,
  1730000000000,
  1730000000000
);

INSERT OR IGNORE INTO product (
  id, slug, name, tagline, description, audience, website_url, category,
  pricing_model, platforms, tags, status, funding, sponsored_until, user_id,
  created_at, updated_at
) VALUES
(
  'ex-kiln', 'kiln', 'Kiln',
  'A quieter email list for people who still write',
  'Kiln is a bootstrapped newsletter tool for founders who send one careful letter a week. Lists stay small, the editor is plain, and you are not sold a funnel.',
  'Founders who write to their own customers',
  'https://example.com/kiln', 'marketing-sales', 'freemium',
  '["web"]', '["Email Marketing","Newsletter"]', 'approved', 'bootstrapped',
  1893456000000, 'example-founder', 1731100000000, 1731100000000
),
(
  'ex-ledgerbird', 'ledgerbird', 'Ledgerbird',
  'Invoices that look like you sent them yourself',
  'Ledgerbird is invoicing for a one-person studio. Send a bill, mark it paid, and export a year of them without a bookkeeper in the loop.',
  'Independent studios and consultants',
  'https://example.com/ledgerbird', 'finance', 'freemium',
  '["web"]', '["Invoicing","Accounting"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1731000000000, 1731000000000
),
(
  'ex-patchbay', 'patchbay', 'Patchbay',
  'Uptime checks without a status-page company',
  'Patchbay watches a handful of URLs and emails you when one fails. There is no incident theater, just a check and a note when it recovers.',
  'Developers running their own production apps',
  'https://example.com/patchbay', 'development', 'freemium',
  '["web","api"]', '["Monitoring","Developer Tools"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1730900000000, 1730900000000
),
(
  'ex-northwind', 'northwind-notes', 'Northwind Notes',
  'Notes that stay notes, not a second office',
  'Northwind Notes is a plain writing desk for people who want pages, links, and search. It does not turn a notebook into a project manager.',
  'Writers and founders who keep their own notes',
  'https://example.com/northwind-notes', 'productivity', 'free',
  '["web"]', '["Note Taking","Documentation"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1730800000000, 1730800000000
),
(
  'ex-harbor', 'harbor-forms', 'Harbor Forms',
  'Forms you can ship on a Sunday afternoon',
  'Harbor Forms is a small form builder for landing pages. Collect answers, send them to your inbox, and stop there.',
  'Makers who need a form and not a CRM',
  'https://example.com/harbor-forms', 'marketing-sales', 'freemium',
  '["web"]', '["Surveys","Lead Generation"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1730700000000, 1730700000000
),
(
  'ex-fieldnote', 'fieldnote', 'Fieldnote',
  'A publishing desk for a personal site',
  'Fieldnote is a writing tool that publishes a simple site. Drafts, a public page, and an RSS feed, with the hosting included.',
  'People who still keep a blog',
  'https://example.com/fieldnote', 'content-media', 'free',
  '["web"]', '["Blogging","Writing"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1730600000000, 1730600000000
),
(
  'ex-lumenboard', 'lumenboard', 'Lumenboard',
  'A board for a team of three, not thirty',
  'Lumenboard is a project board with lists, due dates, and nothing else. It is built for a studio that can see the whole week on one screen.',
  'Small product teams',
  'https://example.com/lumenboard', 'productivity', 'freemium',
  '["web"]', '["Project Management","Task Management"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1730500000000, 1730500000000
),
(
  'ex-cobalt', 'cobalt-auth', 'Cobalt Auth',
  'Sign-in for an app you are still building',
  'Cobalt Auth is email-code sign-in you drop into a small product. Sessions, a user table, and a hosted login page. No social graph.',
  'Developers shipping a first version',
  'https://example.com/cobalt-auth', 'development', 'premium',
  '["web","api"]', '["Authentication","Developer Tools"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1730400000000, 1730400000000
),
(
  'ex-marlowe', 'marlowe', 'Marlowe',
  'A contact list for people you actually talk to',
  'Marlowe keeps the people you sell to, the last note you wrote, and the next date you promised. It is a CRM that fits on one page.',
  'Founders who sell the product themselves',
  'https://example.com/marlowe', 'marketing-sales', 'freemium',
  '["web"]', '["CRM","Lead Generation"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1730300000000, 1730300000000
),
(
  'ex-splicekit', 'splicekit', 'Splicekit',
  'Cut a product demo without a timeline',
  'Splicekit trims a screen recording into a short demo. Captions, a crop, and an export. It is for the video you attach to a launch post.',
  'Makers recording their own product',
  'https://example.com/splicekit', 'design-creative', 'premium',
  '["desktop","web"]', '["Video Editing","Screen Recording"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1730200000000, 1730200000000
),
(
  'ex-quietmile', 'quietmile', 'Quietmile',
  'A timer and a journal, and that is the product',
  'Quietmile is a short daily practice: a timer, a prompt, and a private note. No streaks that shout at you, and no social feed.',
  'People who want a quiet daily habit',
  'https://example.com/quietmile', 'health-wellness', 'freemium',
  '["web","ios"]', '["Meditation","Mental Health"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1730100000000, 1730100000000
),
(
  'ex-waybill', 'waybill', 'Waybill',
  'Shipping labels for a shop that packs its own boxes',
  'Waybill prints labels, tracks a parcel, and tells the buyer when it left the house. Built for stores that still pack orders on the kitchen table.',
  'Small shops that ship their own orders',
  'https://example.com/waybill', 'ecommerce', 'freemium',
  '["web"]', '["Shipping","Online Stores"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1730000000000, 1730000000000
),
(
  'ex-stackline', 'stackline', 'Stackline',
  'Traffic numbers you can read in a minute',
  'Stackline counts visits, referrers, and the pages people actually finish. The report is one screen. There is no warehouse to configure.',
  'Founders who check their own site',
  'https://example.com/stackline', 'analytics-data', 'free',
  '["web"]', '["Analytics"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1729900000000, 1729900000000
),
(
  'ex-primer', 'primer', 'Primer',
  'A course site for a teacher with one subject',
  'Primer hosts a course: lessons, a checkout, and a student login. It is for someone teaching what they already know, not a school.',
  'Independent teachers',
  'https://example.com/primer', 'education-learning', 'freemium',
  '["web"]', '["Online Courses"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1729800000000, 1729800000000
),
(
  'ex-dockhand', 'dockhand', 'Dockhand',
  'Hiring when you need one more person',
  'Dockhand posts a role, collects applications, and keeps the notes from the calls. It ends when you hire. It is not an HR suite.',
  'Small teams hiring their next person',
  'https://example.com/dockhand', 'startup-business', 'freemium',
  '["web"]', '["Hiring","HR"]', 'approved', 'bootstrapped',
  NULL, 'example-founder', 1729700000000, 1729700000000
);

UPDATE product SET like_count = 36 WHERE slug = 'kiln';
UPDATE product SET like_count = 4 WHERE slug = 'shiplog';
UPDATE product SET like_count = 11 WHERE slug = 'ledgerbird';
UPDATE product SET like_count = 19 WHERE slug = 'patchbay';
UPDATE product SET like_count = 28 WHERE slug = 'northwind-notes';
UPDATE product SET like_count = 6 WHERE slug = 'harbor-forms';
UPDATE product SET like_count = 15 WHERE slug = 'fieldnote';
UPDATE product SET like_count = 31 WHERE slug = 'lumenboard';
UPDATE product SET like_count = 9 WHERE slug = 'cobalt-auth';
UPDATE product SET like_count = 22 WHERE slug = 'marlowe';
UPDATE product SET like_count = 12 WHERE slug = 'splicekit';
UPDATE product SET like_count = 27 WHERE slug = 'quietmile';
UPDATE product SET like_count = 7 WHERE slug = 'waybill';
UPDATE product SET like_count = 33 WHERE slug = 'stackline';
UPDATE product SET like_count = 18 WHERE slug = 'primer';
UPDATE product SET like_count = 41 WHERE slug = 'dockhand';

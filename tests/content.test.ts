import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

describe('content pipeline', () => {
  it('builds generated JSON from content/', () => {
    execFileSync('node', ['scripts/build-content.mjs']);
    const profile = JSON.parse(fs.readFileSync('src/generated/profile.json', 'utf8'));
    const articles = JSON.parse(fs.readFileSync('src/generated/articles.json', 'utf8'));
    expect(profile.timeline.length).toBeGreaterThan(5);
    for (const j of profile.timeline) expect(j.from).toMatch(/^\d{4}-\d{2}$/);
    for (const a of articles) { expect(a.slug).not.toMatch(/^\d{4}-/); expect(a.html).toContain('<'); expect(a.draft).toBe(false); }
  });
  it('every skill has at least one fun line and a serious one', () => {
    const profile = JSON.parse(fs.readFileSync('content/profile.json', 'utf8'));
    for (const s of profile.skills) { expect(s.lines.length).toBeGreaterThan(0); expect(s.serious.length).toBeGreaterThan(10); expect(s.level).toBeLessThanOrEqual(99); }
  });
});

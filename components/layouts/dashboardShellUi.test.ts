import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

function readSource(relativePath: string): string {
  try {
    return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  } catch {
    return '';
  }
}

const layout = readSource('./DashboardLayout.tsx');
const mobileMenuHook = readSource('./useDashboardMobileMenu.ts');
const layoutStyles = readSource('./DashboardLayout.module.css');
const sidebar = readSource('../dashboard/Sidebar.tsx');
const sidebarStyles = readSource('../dashboard/Sidebar.module.css');

test('dashboard layout isolates its fixed chrome from its scrolling content', () => {
  assert.match(layout, /styles\.shell/);
  assert.match(layout, /styles\.sidebarSlot/);
  assert.match(layout, /styles\.mainColumn/);
  assert.match(layout, /styles\.content/);
  assert.match(layoutStyles, /height:\s*100dvh/);
  assert.match(layoutStyles, /overflow:\s*hidden/);
  assert.match(layoutStyles, /overflow-y:\s*auto/);
});

test('dashboard mobile navigation closes safely and restores page scrolling', () => {
  assert.match(layout, /styles\.backdrop/);
  assert.match(layout, /aria-label="Close navigation menu"/);
  assert.match(layout, /onClick=\{menu\.close\}/);
  assert.match(mobileMenuHook, /event\.key === 'Escape'/);
  assert.match(
    mobileMenuHook,
    /document\.body\.style\.overflow = 'hidden'/,
  );
  assert.match(mobileMenuHook, /previousOverflow/);
  assert.match(mobileMenuHook, /document\.body\.style\.overflow = previousOverflow/);
  assert.match(mobileMenuHook, /\[pathname, close\]/);
});

test('dashboard sidebar owns focused navigation and identity presentation', () => {
  assert.match(sidebar, /import styles from '\.\/Sidebar\.module\.css'/);
  assert.match(sidebar, /aria-label="Primary navigation"/);
  assert.match(sidebar, /id="dashboard-navigation"/);
  assert.match(sidebar, /data-open=\{isOpen\}/);
  assert.match(sidebar, /styles\.sidebar/);
  assert.doesNotMatch(sidebar, /<aside\s+style=/);
  assert.match(
    sidebarStyles,
    /\.navigation\s*\{[\s\S]*?overflow-y:\s*auto/,
  );
  assert.match(sidebarStyles, /\.identity\s*\{[\s\S]*?margin-top:\s*auto/);
  assert.match(sidebarStyles, /@media\s*\(max-width:\s*900px\)/);
});

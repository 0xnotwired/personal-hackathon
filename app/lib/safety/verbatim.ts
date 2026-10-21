// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Olga Vasilieva and Anna Tchijova
// Adapted from GAMBIT src/lib/frameworks/lexical.ts (verbatim),
// commit 265ff9d7bd172d242e25afc623ce564807af3e65.
// Modified for Autonomía Digital: isolated from scoring; remove an existing `i`
// flag before adding it, so case-insensitive caller patterns are supported.
// Original license: third_party/licenses/gambit.txt. Attribution: NOTICE.
export function verbatim(raw: string, pattern: RegExp): string | null {
  const re = new RegExp(pattern.source, pattern.flags.replace(/[gyi]/g, '') + 'i');
  const match = re.exec(raw);
  if (!match) return null;
  const span = match[0].trim();
  if (span.length === 0) return null;
  return span.length > 120 ? `${span.slice(0, 117)}...` : span;
}

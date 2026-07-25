const BLOCKED = [
  'admin',
  'moderator',
  'modérateur',
  'moderateur',
  'pixfan',
  'null',
  'undefined',
  'fuck',
  'shit',
  'asshole',
  'bitch',
  'nigger',
  'nigga',
  'cunt',
  'merde',
  'putain',
  'salope',
  'connard',
  'enculé',
  'encule',
  'pd',
  'fdp',
];

export function filterDisplayName(name: string): string {
  const lower = name.toLowerCase();
  for (const word of BLOCKED) {
    if (word.length <= 2) {
      // short tokens: whole-word only
      if (new RegExp(`(^|[^a-z0-9])${word}([^a-z0-9]|$)`, 'i').test(lower)) {
        return 'Joueur';
      }
      continue;
    }
    if (lower.includes(word)) {
      return 'Joueur';
    }
  }
  return name;
}

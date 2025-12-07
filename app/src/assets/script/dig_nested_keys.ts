export const digNestedKeys = <T>(keys: string[], obj: Record<string, unknown>): T | null => {
  // accには第2引数のobjが入る
  // keyには第1引数のkeysの要素が順に入る
  return keys.reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return null;
  }, obj) as T | null;
};

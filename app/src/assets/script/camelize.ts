export type CamelizeOptions = {
  lowerFirst?: boolean;
};

export const camelize = (str: string, { lowerFirst = true }: CamelizeOptions = {}): string => {
  const kebabOrSnake = /[-_]/;
  const afterOneChar = /(.)/;
  const initials = new RegExp(`${kebabOrSnake.source}${afterOneChar.source}`, 'g');

  if (!kebabOrSnake.test(str)) {
    return str;
  }

  const callback = (_all: string, char: string): string => char.toUpperCase();
  if (lowerFirst) {
    return str.replace(initials, callback);
  } else {
    const firstChar = str[0];
    return str.replace(initials, callback).replace(afterOneChar, firstChar.toUpperCase());
  }
};

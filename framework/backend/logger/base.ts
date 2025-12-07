import { styleText } from 'node:util';

type LogLevel = 'info' | 'ok' | 'debug' | 'warn' | 'error';
type LineBreak = '' | 'before' | 'after' | 'both';
type Color = 'white' | 'green' | 'blue' | 'yellow' | 'red';

type LogOptions = {
  color?: Color;
  timestamp?: boolean;
  lineBreak?: LineBreak;
  returnable?: boolean;
};

export function BaseLogger() {
  const p = (
    level: LogLevel,
    message: string,
    { color = 'white', timestamp = true, lineBreak = '', returnable = false }: LogOptions
  ) => {
    const time = new Date().toLocaleString('sv-SE');
    if (timestamp) message = `${time} - ${message}`;

    let text = styleText(color, `[${level}] ${message}`);
    if (lineBreak === 'before') text = `\n${text}`;
    if (lineBreak === 'after') text = `${text}\n`;
    if (lineBreak === 'both') text = `\n${text}\n`;

    if (returnable) return text;
    console.log(text);
  };

  const info = (message: string, options: LogOptions = {}) => {
    return p('info', message, { ...options });
  };

  const ok = (message: string, options: LogOptions = {}) => {
    return p('ok', message, { color: 'green', ...options });
  };

  const debug = (message: string, options: LogOptions = {}) => {
    return p('debug', message, { color: 'blue', ...options });
  };

  const warn = (message: string, options: LogOptions = {}) => {
    return p('warn', message, { color: 'yellow', ...options });
  };

  const error = (message: string, options: LogOptions = {}) => {
    return p('error', message, { color: 'red', ...options });
  };

  const returnable = {
    info: (message: string, options: LogOptions = {}) =>
      info(message, { ...options, returnable: true }),
    ok: (message: string, options: LogOptions = {}) =>
      ok(message, { ...options, returnable: true }),
    debug: (message: string, options: LogOptions = {}) =>
      debug(message, { ...options, returnable: true }),
    warn: (message: string, options: LogOptions = {}) =>
      warn(message, { ...options, returnable: true }),
    error: (message: string, options: LogOptions = {}) =>
      error(message, { ...options, returnable: true }),
  };

  return {
    info,
    ok,
    debug,
    warn,
    error,
    returnable,
  };
}

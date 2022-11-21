export const camelToTitleCase = str => str.replace(/(^.|[A-Z]+)/g, (_, g) => ` ${g.charAt(0).toUpperCase()}${g.slice(1)}`).trim();

import DOMPurify from "isomorphic-dompurify";

const LINK_REGEX = /(((https?:\/\/)|(www\.))[^\s]+)/g;

const purifyText = (text: string) => {
  const pure = DOMPurify.sanitize(text);
  return pure.replace(/[\\]+n/gi, '\n');
};

const convertStringToHtml = (content: string) => {
  return content.replace(LINK_REGEX, (url: string) => {
    const hyperlink = url.match(/^https?:\/\//) ? url : `http://${url}`;
    return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
};

export const getPostHtml = (text: string): string => {
  if (!text) return '';

  const content = purifyText(text);
  return convertStringToHtml(content);
};

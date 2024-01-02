import mongoSanitize from 'mongo-sanitize';
import xssSanitize from 'sanitizer';
import sanitizeHtmlRepo from 'sanitize-html';

const recursivelySanitize = obj => {
  if (obj instanceof Object) {
    mongoSanitize(obj);
    for (let key in obj) {
      obj[key] = recursivelySanitize(obj[key]);
    }
    return obj;
  } else {
    if (typeof obj === 'string' || obj instanceof String) {
      return xssSanitize.unescapeEntities(xssSanitize.sanitize(obj));
    } else {
      return obj;
    }
  }
};

const sanitizeHtml = async (htmlString, options) => {
  let htmlOptions;
  if (options) {
    htmlOptions = {
      allowedTags: [
        'u',
        'b',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'p',
        'a',
        'ul',
        'ol',
        'li',
        'i',
        'strong',
        'em',
        'strike',
        'hr',
        'br',
        'table',
        'thead',
        'caption',
        'tbody',
        'tr',
        'th',
        'td',
        'pre',
      ],
      allowedAttributes: {
        h1: ['style'],
        h2: ['style'],
        h3: ['style'],
        h4: ['style'],
        h5: ['style'],
        h6: ['style'],
        blockquote: ['style'],
        p: ['style'],
        a: ['href', 'name', 'target'],
      },
      allowedStyles: {
        '*': {
          'text-align': [/^left$/, /^right$/, /^center$/],
        },
      },
    };
  }
  return sanitizeHtmlRepo(htmlString, htmlOptions);
};

export { sanitizeHtml, recursivelySanitize };

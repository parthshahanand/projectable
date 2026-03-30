export const formatDisplay = (url: string) => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const host = urlObj.hostname.replace('www.', '');
    
    // Attempt to identify document type via path
    if (host === 'docs.google.com') {
      if (urlObj.pathname.includes('/document/')) return 'Google Doc';
      if (urlObj.pathname.includes('/spreadsheets/')) return 'Google Sheet';
      if (urlObj.pathname.includes('/presentation/')) return 'Google Slides';
    }
    
    return host;
  } catch {
    return url; // fallback
  }
};

export const formatHref = (url: string) => url.startsWith('http') ? url : `https://${url}`;

export const isUrl = (value: string): boolean => {
  const trimmed = value.trim();
  if (/\s/.test(trimmed)) return false; // Contains spaces → definitely not a single URL

  try {
    // 1. Check if it's a full URL with protocol
    if (/^https?:\/\//i.test(trimmed)) {
      new URL(trimmed);
      return true;
    }
    
    // 2. Check if it's a domain-like string (e.g., "google.com")
    // Must have at least one dot, and the part after the last dot must be at least 2 alpha characters (TLD-like)
    const parts = trimmed.split('.');
    if (parts.length > 1) {
      const tld = parts[parts.length - 1].split('/')[0]; // Get potential TLD before any path
      if (/^[a-z]{2,}$/i.test(tld)) {
        new URL(`https://${trimmed}`);
        return true;
      }
    }
  } catch {
    return false;
  }
  
  return false;
};


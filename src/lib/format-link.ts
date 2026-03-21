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

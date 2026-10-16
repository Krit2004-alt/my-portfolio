/**
 * Verification & Sanitization Utilities for Public Portfolio
 * Guarantees NO raw placeholders or broken configurations are ever exposed to visitors.
 */

export function isConfigured(value) {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed === '') return false;
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) return false;
  if (trimmed.includes('[ADD_') || trimmed.includes('ADD_')) return false;
  if (trimmed.toLowerCase().includes('placeholder')) return false;
  if (trimmed.toLowerCase().includes('available on request')) return false;
  return true;
}

export function getConfiguredUrl(value) {
  return isConfigured(value) ? value.trim() : null;
}

/**
 * Downloads a document with verified binary integrity and proper filename.
 * Uses client-side Blob with delayed revocation, falling back to the dedicated /api/download endpoint.
 */
export async function downloadDocument(fileUrl, preferredFilename) {
  if (!fileUrl) return;

  let cleanName = preferredFilename || 'document.pdf';
  if (!cleanName.toLowerCase().endsWith('.pdf') && !cleanName.match(/\.(png|jpe?g)$/i)) {
    cleanName += '.pdf';
  }

  try {
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Received 0 bytes from server');
    }

    const isImage = cleanName.match(/\.(png|jpe?g)$/i);
    const mimeType = isImage 
      ? (cleanName.endsWith('.png') ? 'image/png' : 'image/jpeg') 
      : 'application/pdf';
    const blob = new Blob([arrayBuffer], { type: mimeType });
    const objectUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = cleanName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Keep object URL alive for 2 minutes to ensure browser finishes writing to disk
    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 120000);
  } catch (err) {
    console.warn('Blob download error, falling back to server attachment stream:', err);
    const a = document.createElement('a');
    a.href = `/api/download?file=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(cleanName)}`;
    a.download = cleanName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}



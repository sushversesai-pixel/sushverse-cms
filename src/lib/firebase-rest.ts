/**
 * Helper to fetch public Firestore documents via REST API in Next.js Server Components.
 * This avoids gRPC connection issues with the Firebase client SDK on the server.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export async function fetchDocumentRest(collection: string, documentId: string) {
  if (!PROJECT_ID) return null;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${documentId}`;
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return formatFirestoreDoc(data);
  } catch (err) {
    console.error(`Error fetching ${collection}/${documentId} via REST:`, err);
    return null;
  }
}

export async function fetchCollectionRest(collection: string, orderByField: string = "createdAt", direction: "desc" | "asc" = "desc") {
  if (!PROJECT_ID) return [];
  
  // Using StructuredQuery to order results via REST
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
  
  const query = {
    structuredQuery: {
      from: [{ collectionId: collection }],
      orderBy: [{ field: { fieldPath: orderByField }, direction: direction === "desc" ? "DESCENDING" : "ASCENDING" }]
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    
    const results = await res.json();
    // runQuery returns an array of { document: { name, fields, createTime, updateTime } }
    return results
      .filter((r: any) => r.document)
      .map((r: any) => formatFirestoreDoc(r.document));
  } catch (err) {
    console.error(`Error fetching collection ${collection} via REST:`, err);
    return [];
  }
}

// Convert Firestore REST format to simple JS object
export function formatFirestoreDoc(doc: any) {
  if (!doc || !doc.fields) return null;
  
  const id = doc.name ? doc.name.split('/').pop() : undefined;
  const result: any = id ? { id } : {};
  
  for (const [key, value] of Object.entries(doc.fields) as any) {
    result[key] = extractFirestoreValue(value);
  }
  return result;
}

function extractFirestoreValue(value: any): any {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
  if (value.doubleValue !== undefined) return parseFloat(value.doubleValue);
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return new Date(value.timestampValue).getTime();
  if (value.nullValue !== undefined) return null;
  if (value.arrayValue !== undefined) {
    return (value.arrayValue.values || []).map(extractFirestoreValue);
  }
  if (value.mapValue !== undefined) {
    const mapResult: any = {};
    if (value.mapValue.fields) {
      for (const [k, v] of Object.entries(value.mapValue.fields)) {
        mapResult[k] = extractFirestoreValue(v);
      }
    }
    return mapResult;
  }
  return value;
}

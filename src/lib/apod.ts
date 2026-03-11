import { APODData } from './types';

export async function fetchAPOD(): Promise<APODData> {
  const res = await fetch('/api/apod');
  if (!res.ok) {
    throw new Error('Failed to fetch APOD');
  }
  return await res.json();
}

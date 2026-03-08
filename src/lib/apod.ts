import { APODData } from './types';

export async function fetchAPOD(): Promise<APODData | null> {
  try {
    const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DnhUNSxsDuvGZg0Pf9TOVa1ATgtV2fZ7ypuatiSv');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

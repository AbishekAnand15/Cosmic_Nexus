import { APODData } from './types';

export async function fetchAPOD(): Promise<APODData> {
  const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DnhUNSxsDuvGZg0Pf9TOVa1ATgtV2fZ7ypuatiSv');
  if (!res.ok) {
    throw new Error('Failed to fetch APOD');
  }
  return await res.json();
}

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
  
  try {
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
    );
    
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch from NASA' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 24 hours (86400 seconds) at the edge
        // stale-while-revalidate allows serving stale content while fetching fresh in background
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

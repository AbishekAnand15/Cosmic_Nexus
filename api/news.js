export const config = {
  runtime: 'edge',
};

const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json';

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const rssUrl = searchParams.get('url');

  if (!rssUrl) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(`${RSS2JSON_BASE}?rss_url=${encodeURIComponent(rssUrl)}`);
    
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch from RSS2JSON' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 1 hour (3600 seconds) at the edge
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

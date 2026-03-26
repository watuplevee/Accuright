export interface TwitterHashtagStats {
  hashtag: string;
  totalCount: number;
  granularity: 'day' | 'hour' | 'minute';
  data: Array<{
    end: string;
    start: string;
    tweet_count: number;
  }>;
}

interface TwitterRecentCountResponse {
  data: Array<{
    end: string;
    start: string;
    tweet_count: number;
  }>;
  meta: {
    total_tweet_count: number;
    newest_id?: string;
    oldest_id?: string;
    next_token?: string;
  };
}

export async function getHashtagStats(hashtag: string): Promise<TwitterHashtagStats> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    throw new Error('TWITTER_BEARER_TOKEN environment variable is not set');
  }

  // Normalize hashtag — strip leading # if present
  const normalizedHashtag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
  const query = encodeURIComponent(`#${normalizedHashtag} -is:retweet`);

  const url = `https://api.twitter.com/2/tweets/counts/recent?query=${query}&granularity=day`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twitter API v2 error ${response.status}: ${errorText}`);
  }

  const json: TwitterRecentCountResponse = await response.json();

  return {
    hashtag: normalizedHashtag,
    totalCount: json.meta.total_tweet_count,
    granularity: 'day',
    data: json.data ?? [],
  };
}

export function buildShareUrl(
  text: string,
  url: string,
  hashtags: string[]
): string {
  const baseUrl = 'https://twitter.com/intent/tweet';
  const params = new URLSearchParams();

  params.set('text', text);
  params.set('url', url);

  if (hashtags.length > 0) {
    // Twitter intent expects hashtags without # and comma-separated
    const normalizedHashtags = hashtags
      .map((tag) => (tag.startsWith('#') ? tag.slice(1) : tag))
      .join(',');
    params.set('hashtags', normalizedHashtags);
  }

  return `${baseUrl}?${params.toString()}`;
}

import axios from 'axios';
import { VNDBResponse, UserVote } from '@/types/vndb';

const VNDB_API_URL = 'https://api.vndb.org/kana/vn';

export async function fetchUserVotes(apiKey: string): Promise<UserVote[]> {
  const response = await axios.post(
    VNDB_API_URL,
    {
      filters: ['uid', '=', 'u257101'],
      fields: 'id,vote,added',
    },
    {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.results;
}

export async function fetchGameDetails(apiKey: string, gameIds: string[]): Promise<VNDBResponse> {
  const response = await axios.post(
    VNDB_API_URL,
    {
      filters: ['id', '=', gameIds],
      fields: 'id,title,original,released,rating,votecount,image,image_nsfw,length,description,platforms,tags',
    },
    {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
} 
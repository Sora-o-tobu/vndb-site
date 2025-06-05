export interface VNDBResponse {
  results: VNDBGame[];
  more: boolean;
}

export interface VNDBGame {
  id: string;
  url: string;
  title: string;
  released: string;
  image: string;
  rating: number;
  vote: number;
  finished: number;
}

export interface VNDBTag {
  id: number;
  name: string;
  category: string;
  spoiler: boolean;
  rating: number;
}

export interface UserVote {
  vn_id: string;
  vote: number;
  added: string;
} 
export interface FirebaseVideo {
  id?: string;
  name?: string;
  emotion?: string;
}

export interface FirebaseBatch {
  videos?: FirebaseVideo[];
  images?: FirebaseImage[];
  count?: number;
}

export interface FirebaseImage {
  id?: string;
  name? string;
  emotion? string;
}
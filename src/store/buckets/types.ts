export type TBucket = {
  id: string;
  name: string;
  description: string;
};

export type TBucketsState = {
  buckets: TBucket[];
};

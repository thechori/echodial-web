import { Lead } from "../../types";

export type TBucket = {
  id: string;
  name: string;
  description: string;
  leads: Lead[];
};

export type TBucketsState = {
  buckets: TBucket[];
};

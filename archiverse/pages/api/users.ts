import {
  Community,
  getCommunities,
  getPosts,
  searchCommunities,
  searchUsers,
} from "@server/database";
import type { NextApiRequest, NextApiResponse } from "next";

type QueryParams = {
  search: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { search } = req.query;

    const posts = await searchUsers({
      query: search as string,
    });

    return res.status(200).json(posts);
  } catch (e) {
    return res.status(500).json({ error: e?.message });
  }
};

export default handler;

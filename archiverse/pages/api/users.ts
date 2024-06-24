import {
  Community,
  getCommunities,
  getPosts,
  searchCommunities,
  searchUsers,
} from "@server/database";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { search } = req.query;

    if (!search || (typeof search !== "string" || search.length < 3)) {
      return res.status(200).json([]);
    }

    const posts = await searchUsers({
      query: search as string,
    });

    return res.status(200).json(posts);
  } catch (e) {
    return res.status(500).json({ error: e?.message });
  }
};

export default handler;

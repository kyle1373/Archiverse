import {
  Community,
  getCommunities,
  getHomepageDrawings,
  getPostReplies,
  getPosts,
  getRandomPosts,
  searchCommunities,
} from "@server/database";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const post = await getRandomPosts();

    return res.status(200).json(post);
  } catch (e) {
    return res.status(500).json({ error: e?.message });
  }
};
export default handler;

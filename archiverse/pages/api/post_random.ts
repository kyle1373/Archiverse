import {
  Community,
  getCommunities,
  getHomepageDrawings,
  getPostReplies,
  getPosts,
  getRandomPost,
  searchCommunities,
} from "@server/database";
import type { NextApiRequest, NextApiResponse } from "next";

type QueryParams = {
  has_replies: boolean;
  is_drawing: boolean;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { has_replies, is_drawing } = req.query;

    const replies = await getRandomPost({
      isDrawing: is_drawing ? is_drawing === "true" : null,
      hasReplies: has_replies ? has_replies === "true" : null,
    });

    return res.status(200).json(replies);
  } catch (e) {
    return res.status(500).json({ error: e?.message });
  }
};

export default handler;

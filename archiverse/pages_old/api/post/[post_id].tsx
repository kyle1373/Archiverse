// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Community,
  getCommunities,
  getCommunity,
  getPost,
  searchCommunities,
} from "@server/database";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { post_id } = req.query;

    const post = await getPost({ postID: post_id });

    res.status(200).json(post);
  } catch (e) {
    return res.status(500).json({ error: e?.message });
  }
};

export default handler;

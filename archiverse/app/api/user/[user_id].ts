// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Community,
  getCommunities,
  getCommunity,
  getPost,
  getUserInfo,
  searchCommunities,
} from "@server/database";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user_id } = req.query;

    const post = await getUserInfo({ NNID: user_id as string });

    res.status(200).json(post);
  } catch (e) {
    return res.status(500).json({ error: e?.message });
  }
};

export default handler;

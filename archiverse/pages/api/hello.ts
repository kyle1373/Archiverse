// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SETTINGS } from "@constants/constants";
import {
  getCommunities,
  getCommunity,
  getHomepageDrawings,
  getPost,
  getPostReplies,
  getUserInfo,
  searchCommunities,
  searchUsers,
} from "@server/database";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403);
  }

  if (SETTINGS.Maintenance) {
    return res.status(503).json({
      error: "Archiverse is currently undergoing maintenance. Come back soon!",
    });
  }

  // const data = await getPost({postID: "AYIHAAAEAAAOU4XCvEQWvA"})
  const data = await getHomepageDrawings();
  return res.status(200).json(data);
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getPost, getPostReplies, getPosts, getUserInfo, searchUsers } from "@server/database";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if(process.env.NODE_ENV !== "development"){
    return res.status(403)
  }

  // const data = await getPost({postID: "AYIHAAAEAAAOU4XCvEQWvA"})
  const data = await getPosts({sortMode: "popular", limit:100, page: 2})
  return res.status(200).json(data);
}

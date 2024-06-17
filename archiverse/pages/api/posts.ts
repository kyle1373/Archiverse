import {
    Community,
    getCommunities,
    getCommunityPosts,
    searchCommunities,
  } from "@server/database";
  import type { NextApiRequest, NextApiResponse } from "next";
  
  type QueryParams = {
    sort_mode: "recent" | "popular";
    before_datetime?: string;
    game_id: string;
    title_id: string;
    page?: string | number;
  };
  
  const validateQueryParams = (query: QueryParams): string[] => {
    const { sort_mode, before_datetime, game_id, title_id, page } = query;
  
    const errors: string[] = [];
    const sortModes = ["recent", "popular"];
    
    if (!sortModes.includes(sort_mode)) {
      errors.push("Invalid sort_mode. Must be 'recent' or 'popular'.");
    }
  
    if (before_datetime !== undefined && isNaN(Date.parse(before_datetime))) {
      errors.push("Invalid before_datetime. Must be a valid date string.");
    }
  
    if (typeof game_id !== "string" || game_id.length === 0) {
      errors.push("Invalid game_id. Must be a non-empty string.");
    }
  
    if (typeof title_id !== "string" || title_id.length === 0) {
      errors.push("Invalid title_id. Must be a non-empty string.");
    }
  
    if (page !== undefined && isNaN(Number(page))) {
      errors.push("Invalid page. Must be a number.");
    }
  
    return errors;
  };
  
  const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { title_id, game_id, sort_mode, before_datetime, page } = req.query;
  
    const queryParams: QueryParams = {
      title_id: title_id as string,
      game_id: game_id as string,
      sort_mode: sort_mode as "recent" | "popular",
      before_datetime: before_datetime as string,
      page: page as string | number,
    };
  
    const errors = validateQueryParams(queryParams);
  
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(", ") });
    }
  
    const limit = 25; // default limit for pagination
    const pageNumber = page ? parseInt(page as string, 10) : 1;
    const beforeDate = before_datetime ? new Date(queryParams.before_datetime) : null;
  
    const posts = await getCommunityPosts({
      sortMode: queryParams.sort_mode,
      beforeDateTime: beforeDate,
      gameID: queryParams.game_id,
      titleID: queryParams.title_id,
      limit,
      page: pageNumber,
    });
  
    return res.status(200).json(posts);
  };
  
  export default handler;
  
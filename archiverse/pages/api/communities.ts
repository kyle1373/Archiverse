// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Community, getCommunities, searchCommunities } from "@server/database";
import type { NextApiRequest, NextApiResponse } from "next";

type QueryParams = {
    search?: string;
  page?: string | number;
};

const validateQueryParams = (query: QueryParams) => {
  if (query.search && typeof query.search !== "string") {
    return false;
  }

  if (query.page !== undefined) {
    const pageNumber = Number(query.page);
    if (isNaN(pageNumber) || !Number.isInteger(pageNumber)) {
      return false;
    }
  }

  return true;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { search, page } = req.query;

  const queryParams: QueryParams = {
    search: search as string,
    page: page as string | number,
  };

  if (!validateQueryParams(queryParams)) {
    return res.status(400).json({ error: "Invalid query parameters" });
  }

  const pageNumber = page ? Number(page) : 1;

  var communities: Community[];
  if (search) {
    communities = await searchCommunities({ query: search as string });
  } else {
    communities = await getCommunities({ page: pageNumber });
  }

  res.status(200).json(communities);
};

export default handler;

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Community,
  getCommunities,
  getRelatedCommunities,
  searchCommunities,
} from "@server/database";
import type { NextApiRequest, NextApiResponse } from "next";

type QueryParams = {
  search?: string;
  title_id?: string;
  page?: string | number;
};

const validateQueryParams = (query: QueryParams) => {
  if (query.search && typeof query.search !== "string") {
    return false;
  }

  const parsedTitleId = parseInt(query.title_id);
  if (query.title_id && isNaN(parsedTitleId)) {
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
  try {
    const { search, page, title_id } = req.query;

    const queryParams: QueryParams = {
      search: search as string,
      page: page as string | number,
      title_id: title_id as string,
    };

    if (!validateQueryParams(queryParams)) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }

    const pageNumber = page ? Number(page) : 1;

    var communities: Community[];
    if (search) {
      communities = await searchCommunities({ query: search as string });
    } else if (title_id) {
      communities = await getRelatedCommunities({
        titleID: title_id as string,
      });
    } else {
      communities = await getCommunities({ page: pageNumber });
    }

    return res.status(200).json(communities);
  } catch (e) {
    return res.status(500).json({ error: e?.message });
  }
};

export default handler;

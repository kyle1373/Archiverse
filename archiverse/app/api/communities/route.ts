import {
  Community,
  getCommunities,
  getRelatedCommunities,
  searchCommunities,
} from "@server/database";
import { NextRequest, NextResponse } from 'next/server';

type QueryParams = {
  search?: string;
  title_id?: string;
  page?: string | number;
};

const validateQueryParams = (query: QueryParams) => {
  if (query.search && typeof query.search !== "string") {
    return false;
  }

  const parsedTitleId = parseInt(query.title_id as string);
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const title_id = searchParams.get('title_id');

    const queryParams: QueryParams = {
      search: search,
      page: page,
      title_id: title_id,
    };

    if (!validateQueryParams(queryParams)) {
      return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
    }

    const pageNumber = page ? Number(page) : 1;

    var communities: Community[];
    if (search) {
      communities = await searchCommunities({ query: search });
    } else if (title_id) {
      communities = await getRelatedCommunities({
        titleID: title_id,
      });
    } else {
      communities = await getCommunities({ page: pageNumber });
    }

    return NextResponse.json(communities);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
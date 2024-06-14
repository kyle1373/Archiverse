import supabaseAdmin from "./supabaseAdmin";

export const getPost = async ({ postID }) => {
  const { data, error } = await supabaseAdmin
    .from("Posts")
    .select(
      "Id, DiscussionType, EmpathyCount, Feeling, GameCommunityIconUri, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ReplyCount, ScreenName, ScreenShotUri, Text, Title, TitleId, VideoUrl, NNID"
    )
    .eq("Id", postID)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
export const getPostReplies = async ({
  postID,
  sortMode,
  limit = 10,
  page = 1,
}: {
  postID: string;
  sortMode: "newest" | "oldest";
  limit?: number;
  page?: number;
}) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data, error } = await supabaseAdmin
    .from("Replies")
    .select(
      "Id, DiscussionType, EmpathyCount, Feeling, GameCommunityIconUri, InReplyToId, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ScreenName, ScreenShotUri, Text, TitleId, NNID"
    )
    .eq("InReplyToId", postID)
    .range(start, end)
    .order("PostedDate", { ascending: sortMode === "newest" });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getCommunityPosts = async ({
  gameID,
  titleID,
  sortMode,
  beforeDateTime,
  limit = 10,
  page = 1,
}: {
  gameID: string;
  titleID: string;
  sortMode: "recent" | "popular";
  beforeDateTime?: Date;
  limit?: number;
  page?: number;
}) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const dateTimeMillis = beforeDateTime.getTime();

  const query = supabaseAdmin
    .from("Posts")
    .select(
      "Id, DiscussionType, EmpathyCount, Feeling, GameCommunityIconUri, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ReplyCount, ScreenName, ScreenShotUri, Text, Title, TitleId, VideoUrl, NNID"
    );

  if (beforeDateTime) {
    query.lt("PostedDate", dateTimeMillis);
  }

  query.eq("gameID", gameID).eq("titleID", titleID).range(start, end);

  if (sortMode === "recent") {
    query.order("PostedDate", { ascending: false });
  } else {
    query.order("EmpathyCount", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const searchUsers = async ({ NNID }: { NNID: string }) => {
  const { data, error } = await supabaseAdmin.rpc("search_users_by_nnid", {
    search_query: NNID,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getUserInfo = async ({ NNID }: { NNID: string }) => {
  const { data, error } = await supabaseAdmin
    .from("Users")
    .select(
      "NNID, Bio, Birthday, Country, FollowerCount, FollowingCount, FriendsCount, GameSkill, IconUri, IsBirthdayHidden, IsError, IsHidden, ScreenName, SidebarCoverUrl, TotalPosts, TotalDeletedPosts, TotalReplies"
    )
    .eq("NNID", NNID)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getUserPosts = async ({
  NNID,
  sortMode,
  limit = 10,
  page = 1,
}: {
  NNID: string;
  sortMode: "newest" | "oldest" | "popular";
  limit?: number;
  page?: number;
}) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const query = supabaseAdmin
    .from("Posts")
    .select(
      "Id, DiscussionType, EmpathyCount, Feeling, GameCommunityIconUri, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ReplyCount, ScreenName, ScreenShotUri, Text, Title, TitleId, VideoUrl, NNID"
    )
    .eq("NNID", NNID)
    .range(start, end);

  if (sortMode === "newest") {
    query.order("PostedDate", { ascending: false });
  } else if (sortMode === "oldest") {
    query.order("PostedDate", { ascending: true });
  } else {
    query.order("EmpathyCount", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUserReplies = async ({
  NNID,
  sortMode,
  limit = 10,
  page = 1,
}: {
  NNID: string;
  sortMode: "newest" | "oldest" | "popular";
  limit?: number;
  page?: number;
}) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const query = supabaseAdmin
    .from("Replies")
    .select(
      "Id, DiscussionType, EmpathyCount, Feeling, GameCommunityIconUri, InReplyToId, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ScreenName, ScreenShotUri, Text, TitleId, NNID"
    )
    .eq("NNID", NNID)
    .range(start, end);

  if (sortMode === "newest") {
    query.order("PostedDate", { ascending: false });
  } else if (sortMode === "oldest") {
    query.order("PostedDate", { ascending: true });
  } else {
    query.order("EmpathyCount", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

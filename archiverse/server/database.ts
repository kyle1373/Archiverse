import supabaseAdmin from "./supabaseAdmin";

export const getPost = async ({ postID }) => {
  const { data, error } = await supabaseAdmin
    .from("Posts")
    .select(
      "Id, EmpathyCount, Feeling, GameCommunityIconUri, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ReplyCount, ScreenName, ScreenShotUri, Text, Title, TitleId, VideoUrl, NNID"
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
      "Id, EmpathyCount, Feeling, GameCommunityIconUri, InReplyToId, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ScreenName, ScreenShotUri, Text, TitleId, NNID"
    )
    .eq("InReplyToId", postID)
    .range(start, end)
    .order("PostedDate", { ascending: sortMode === "newest" });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getPosts = async ({
  sortMode,
  beforeDateTime,
  gameID,
  titleID,
  limit = 10,
  page = 1,
}: {
  sortMode: "recent" | "popular";
  gameID?: string;
  titleID?: string;
  beforeDateTime?: Date;
  limit?: number;
  page?: number;
}) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const query = supabaseAdmin
    .from("Posts")
    .select(
      "Id, EmpathyCount, Feeling, GameCommunityIconUri, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ReplyCount, ScreenName, ScreenShotUri, Text, Title, TitleId, VideoUrl, NNID"
    );

  if (beforeDateTime) {
    const dateTimeMillis = beforeDateTime.getTime();
    query.lt("PostedDate", dateTimeMillis);
  }

  if (gameID && titleID) {
    query.eq("gameID", gameID).eq("titleID", titleID);
  }

  query.range(start, end);

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

export const searchUsers = async ({ query }: { query: string }) => {
  const { data, error } = await supabaseAdmin.rpc("search_users_by_nnid", {
    search_query: query,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// TODO
export const searchCommunities = async ({query}: {query: string}) => {

}

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
}): Promise<Post[]> => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const query = supabaseAdmin
    .from("Posts")
    .select(
      "Id, EmpathyCount, Feeling, GameCommunityIconUri, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ReplyCount, ScreenName, ScreenShotUri, Text, Title, TitleId, VideoUrl, NNID"
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

  const posts: Post[] = [];
  data?.map((value) => posts.push(convertPost(value)));

  return posts;
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
      "Id, EmpathyCount, Feeling, GameCommunityIconUri, InReplyToId, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ScreenName, ScreenShotUri, Text, TitleId, NNID"
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

export type Post = {
  ID: string;
  MiiName: string;
  NNID: string;
  MiiUrl: string;
  NumYeahs: number;
  NumReplies: number;
  Title: string;
  Text: string;
  DrawingUrl: string;
  ScreenshotUrl: string;
  VideoUrl: string;
  CommunityTitle: string;
  CommunityIconUrl: string;
  GameID: string;
  TitleID: string;
};

const convertPost = (data): Post => {
  const post: Post = {
    ID: data.Id,
    MiiName: data.ScreenName,
    NNID: data.NNID,
    MiiUrl: getArchiveFromUri(getMiiImageUrl(data.IconUri, data.Feeling)),
    NumYeahs: data.EmpathyCount,
    NumReplies: data.ReplyCount,
    Title: data.Title ? data.Title : null,
    Text: data.Text,
    DrawingUrl: data.ImageUri ? getArchiveFromUri(data.ImageUri) : null,
    ScreenshotUrl: data.ScreenShotUri
      ? getArchiveFromUri(data.ScreenShotUri)
      : null,
    VideoUrl: data.VideoUrl,
    CommunityTitle: data.GameCommunityTitle,
    CommunityIconUrl: data.GameCommunityIconUri
      ? getArchiveFromUri(data.GameCommunityIconUri)
      : null,
    GameID: data.GameID,
    TitleID: data.IconID,
  };

  return post;
};

//TODO
export type SearchedUser = {};

const convertSearchedUser = (data) => {};

//TODO
export type User = {};

const convertUser = (data) => {};

export type Reply = {
  ID: string;
  MiiName: string;
  NNID: string;
  MiiUrl: string;
  NumYeahs: number;
  Text: string;
  DrawingUrl: string;
  ScreenshotUrl: string;
  ReplyingToID: string;
};

//TODO: Implement this in get replies
const convertReply = (data) => {
  const reply: Reply = {
    ID: data.Id,
    MiiName: data.ScreenName,
    NNID: data.NNID,
    MiiUrl: getArchiveFromUri(getMiiImageUrl(data.IconUri, data.Feeling)),
    NumYeahs: data.EmpathyCount,
    Text: data.Text,
    DrawingUrl: data.ImageUri ? getArchiveFromUri(data.ImageUri) : null,
    ScreenshotUrl: data.ScreenShotUri
      ? getArchiveFromUri(data.ScreenShotUri)
      : null,
    ReplyingToID: data.InReplyToId,
  };

  return reply;
};

//TODO
export type Community = {
  GameID: string,
  TitleID: string,
  Title: string,
  Badge: "Main Community" | "Announcement Community" | null
};

const convertCommunity = (data) => {};

const getArchiveFromUri = (uri: string) => {
  const archiveImageBaseUrl = "https://web.archive.org/web/20171014154111im_/";
  return archiveImageBaseUrl + uri;
};

const getMiiImageUrl = (url: string, feeling: number) => {
  // url is assumed to just have _normal_face.png because the database only contains those values
  const faceMappings: { [key: number]: string } = {
    0: "_normal_face.png",
    1: "_happy_face.png",
    2: "_like_face.png",
    3: "_surprised_face.png",
    4: "_frustrated_face.png",
    5: "_puzzled_face.png",
  };

  if (feeling < 0 || feeling > 5) {
    return url;
  }

  const newFace = faceMappings[feeling];

  return url.replace("_normal_face.png", newFace);
};

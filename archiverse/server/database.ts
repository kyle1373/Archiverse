import supabaseAdmin from "./supabaseAdmin";

export const getPost = async ({ postID }): Promise<Post> => {
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

  return convertPost(data);
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
}): Promise<Reply[]> => {
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

  const replies: Reply[] = [];

  data?.map((value) => replies.push(convertReply(value)));

  return replies;
};

export const getCommunityPosts = async ({
  sortMode,
  beforeDateTime,
  gameID,
  titleID,
  limit = 20,
  page = 1,
}: {
  sortMode: "recent" | "popular";
  gameID?: string;
  titleID?: string;
  beforeDateTime?: Date;
  limit?: number;
  page?: number;
}): Promise<Post[]> => {
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

  const posts: Post[] = [];

  data?.map((value) => posts.push(convertPost(value)));

  return posts;
};

export const searchUsers = async ({
  query,
}: {
  query: string;
}): Promise<User[]> => {
  const { data, error } = await supabaseAdmin.rpc("search_users_by_nnid", {
    search_query: query,
  });

  if (error) {
    throw new Error(error.message);
  }

  const users: User[] = [];

  data?.map((value) => users.push(convertUser(value)));

  return data;
};

// TODO
export const searchCommunities = async ({ query }: { query: string }): Promise<Community[]> => {
  const { data, error } = await supabaseAdmin.rpc("search_communities", {
    search_query: query,
  });

  if (error) {
    console.log(JSON.stringify(error));
    throw new Error(error.message);
  }

  const communities: Community[] = [];

  data?.map((value) => communities.push(convertCommunity(value)));

  return communities;
};

export const getCommunities = async ({
  limit = 20,
  page = 1,
}: {
  limit?: number;
  page?: number;
}): Promise<Community[]> => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data, error } = await supabaseAdmin
    .from("Games")
    .select(
      "GameId, TitleId, Title, CommunityBadge, CommunityListIcon, IconUri, Type, TotalPosts, ViewRegion"
    )
    .order("TotalPosts", { ascending: false })
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  const communities: Community[] = [];

  data?.map((value) => communities.push(convertCommunity(value)));

  return communities;
};

export const getCommunity = async ({
  gameID,
  titleID,
}: {
  gameID: string;
  titleID: string;
}): Promise<Community> => {
  const { data, error } = await supabaseAdmin
    .from("Games")
    .select(
      "GameId, TitleId, Title, CommunityBadge, CommunityListIcon, IconUri, Type, TotalPosts, ViewRegion"
    )
    .eq("GameId", gameID)
    .eq("TitleId", titleID)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return convertCommunity(data);
};

export const getUserInfo = async ({ NNID }: { NNID: string }) => {
  const { data, error } = await supabaseAdmin
    .from("Users")
    .select(
      "NNID, Bio, Birthday, Country, FollowerCount, FollowingCount, FriendsCount, GameSkill, IconUri, IsBirthdayHidden, IsError, IsHidden, ScreenName, SidebarCoverUrl, TotalPosts"
    )
    .eq("NNID", NNID)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return convertUser(data);
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
}): Promise<Reply[]> => {
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

  const replies: Reply[] = [];
  data?.map((value) => replies.push(convertReply(value)));

  return replies;
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

export type User = {
  NNID: string;
  MiiName: string;
  MiiUrl: string;
  Bio: string;
  Country: string | null;
  NumFollowers: number | null;
  NumFollowing: number | null;
  NumFriends: number | null;
  NumPosts: number;
  Birthday: string;
};

const convertUser = (data): User => {
  const user: User = {
    NNID: data.NNID,
    MiiName: data.ScreenName,
    MiiUrl: getArchiveFromUri(getMiiImageUrl(data.IconUri, null)),
    Bio: data.Bio,
    Country: data.Country,
    NumFollowers: data.FollowerCount === 0 ? null : data.FollowerCount,
    NumFollowing: data.FollowingCount === 0 ? null : data.FollowingCount,
    NumFriends: data.FriendsCount === 0 ? null : data.FriendsCount,
    NumPosts: data.TotalPosts,
    Birthday: data.Birthday,
  };

  return user;
};

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

const convertReply = (data): Reply => {
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

export type Community = {
  GameID: string;
  TitleID: string;
  CommunityTitle: string;
  CommunityListIconUrl: string | null;
  CommunityIconUrl: string;
  Badge: "Main Community" | "Announcement Community" | null;
  GameTitle: string;
  NumPosts: number;
  Region: "America" | "Japan" | "Europe" | "Worldwide";
};

const convertCommunity = (data): Community => {
  let convertedRegion: "America" | "Japan" | "Europe" | "Worldwide";
  switch (data.ViewRegion) {
    case 1:
      convertedRegion = "Japan";
      break;
    case 2:
      convertedRegion = "America";
      break;
    case 4:
      convertedRegion = "Europe";
      break;
    default:
      convertedRegion = "Worldwide";
      break;
  }

  let convertedBadge: "Main Community" | "Announcement Community" | null;

  switch (data.Badge) {
    case "Main Community":
      convertedBadge = "Main Community";
      break;
    case "Announcement Community":
      convertedBadge = "Announcement Community";
      break;
    default:
      convertedBadge = null;
      break;
  }

  const community: Community = {
    GameID: data.GameId,
    TitleID: data.TitleId,
    CommunityTitle: data.Title,
    CommunityListIconUrl: data.CommunityListIcon
      ? getArchiveFromUri(data.CommunityListIcon)
      : null,
    CommunityIconUrl: data.CommunityIconUrl
      ? getArchiveFromUri(data.IconUri)
      : null,
    Badge: convertedBadge,
    GameTitle: data.Title,
    NumPosts: data.TotalPosts,
    Region: convertedRegion,
  };

  return community;
};

const getArchiveFromUri = (uri: string) => {
  if (!uri) {
    return null;
  }
  const archiveImageBaseUrl = "https://web.archive.org/web/20171014154111im_/";
  return archiveImageBaseUrl + uri;
};

const getMiiImageUrl = (url: string, feeling: number) => {
  // url is assumed to just have _normal_face.png because the database only contains those values

  if (!feeling || feeling < 0 || feeling > 5) {
    return url;
  }
  const faceMappings: { [key: number]: string } = {
    0: "_normal_face.png",
    1: "_happy_face.png",
    2: "_like_face.png",
    3: "_surprised_face.png",
    4: "_frustrated_face.png",
    5: "_puzzled_face.png",
  };

  const newFace = faceMappings[feeling];

  return url.replace("_normal_face.png", newFace);
};

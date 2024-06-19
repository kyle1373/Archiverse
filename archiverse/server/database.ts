import { IMAGES } from "@constants/constants";
import supabaseAdmin from "./supabaseAdmin";
import _ from "lodash";

export const getPost = async ({ postID }): Promise<Post> => {
  const { data, error } = await supabaseAdmin
    .from("Posts")
    .select(
      "Id, EmpathyCount, Feeling, GameCommunityIconUri, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ReplyCount, ScreenName, ScreenShotUri, Text, Title, TitleId, VideoUrl, NNID, HideRequested"
    )
    .eq("Id", postID);

  if (error) {
    throw new Error(error.message);
  }

  if (data.length === 0) {
    return {
      ID: postID,
      MiiName: "Not Found",
      NNID: "unknown",
      MiiUrl: null,
      NumYeahs: 0,
      NumReplies: 0,
      Title: null,
      Text: "This post does not exist.",
      DrawingUrl: null,
      ScreenshotUrl: null,
      VideoUrl: null,
      CommunityTitle: "Unknown",
      CommunityIconUrl: IMAGES.unknownMii,
      GameID: "0",
      TitleID: "0",
      IsSpoiler: false,
      IsPlayed: false,
      Date: undefined,
      DoNotShow: false,
    };
  }

  return convertPost(data[0]);
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
      "Id, EmpathyCount, Feeling, GameCommunityIconUri, InReplyToId, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ScreenName, ScreenShotUri, Text, TitleId, NNID, HideRequested"
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

export const getHomepageDrawings = async (): Promise<Post[]> => {
  const start = Math.floor(Math.random() * 1001);
  const end = start + 30;

  // Filter out all low-quality drawings / stamp posts.
  // Usually includes youtubers, official Nintendo staff, MK8 WR posts, and others. May add to this list for finetuning

  // This list is good from 0 through 1050. If extending list, do some more manual checking
  const { data, error } = await supabaseAdmin
    .from("Posts")
    .select("*")
    .neq("ImageUri", "")
    .lt("EmpathyCount", 17000)
    .gt("EmpathyCount", 500)
    .not("NNID", "like", "Nintendo%")
    .neq("NNID", "JaKool6")
    .neq("NNID", "TimothyJS")
    .neq("NNID", "SadeMKH")
    .neq("NNID", "shiyou123")
    .neq("NNID", "narami")
    .neq("NNID", "chuggaaconroy")
    .neq("NNID", "monsieurdream")
    .neq("NNID", "LeKamek")
    .neq("NNID", "cole77")
    .neq("NNID", "madsun8213")
    .neq("NNID", "Speed64Demon")
    .neq("NNID", "Agile.Espeon")
    .range(start, end);

  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }

  const drawings: Post[] = [];

  data?.map((value) => {
    drawings.push(convertPost(value));
  });

  const shuffledDrawings = _.shuffle(drawings);

  return shuffledDrawings;
};

export const getPosts = async ({
  sortMode,
  beforeDateTime,
  gameID,
  titleID,
  onlyDrawings = false,
  limit = 25,
  page = 1,
}: {
  sortMode: "recent" | "popular";
  gameID?: string;
  titleID?: string;
  onlyDrawings?: boolean;
  beforeDateTime?: Date;
  limit?: number;
  page?: number;
}): Promise<Post[]> => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const query = supabaseAdmin
    .from("Posts")
    .select(
      "Id, EmpathyCount, Feeling, GameCommunityIconUri, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ReplyCount, ScreenName, ScreenShotUri, Text, Title, TitleId, VideoUrl, NNID, HideRequested"
    );

  if (beforeDateTime) {
    const dateTimeSeconds = Math.ceil(beforeDateTime.getTime() / 1000);
    query.lt("PostedDate", dateTimeSeconds);
    if (sortMode === "popular") {
      const fourDaysBeforeSeconds = dateTimeSeconds - 4 * 24 * 60 * 60;
      query.gte("PostedDate", fourDaysBeforeSeconds);
    }
  }

  if (onlyDrawings) {
    query.neq("ImageUri", "");
  }

  if (gameID && titleID) {
    query.eq("GameId", gameID).eq("TitleId", titleID);
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

  return users;
};

export const searchCommunities = async ({
  query,
}: {
  query: string;
}): Promise<Community[]> => {
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
  limit = 25,
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

export const getRelatedCommunities = async ({
  titleID,
}: {
  titleID?: string;
}): Promise<Community[]> => {
  const { data, error } = await supabaseAdmin
    .from("Games")
    .select(
      "GameId, TitleId, Title, CommunityBadge, CommunityListIcon, IconUri, Type, TotalPosts, ViewRegion"
    )
    .eq("TitleId", titleID)
    .order("TotalPosts", { ascending: false });

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
    .eq("TitleId", titleID);

  if (error) {
    throw new Error(error.message);
  }

  if (data.length === 0) {
    return {
      GameID: gameID,
      TitleID: titleID,
      CommunityTitle: "Not found",
      CommunityBanner: null,
      CommunityIconUrl: IMAGES.unknownMii,
      Badge: null,
      GameTitle: "Not Found",
      NumPosts: 0,
      Region: "Worldwide",
    };
  }

  return convertCommunity(data[0]);
};

export const getUserInfo = async ({ NNID }: { NNID: string }) => {
  const { data, error } = await supabaseAdmin
    .from("Users")
    .select(
      "NNID, Bio, Birthday, Country, FollowerCount, FollowingCount, FriendsCount, GameSkill, IconUri, IsBirthdayHidden, IsError, IsHidden, ScreenName, SidebarCoverUrl, TotalPosts, HideRequested"
    )
    .eq("NNID", NNID);

  if (error) {
    throw new Error(error.message);
  }

  if (data.length === 0) {
    return {
      NNID: "unknown",
      MiiName: "Not Found",
      MiiUrl: IMAGES.unknownMii,
      Bio: "This user does not exist.",
      Country: "Unknown",
      NumFollowers: null,
      NumFollowing: null,
      NumFriends: null,
      BannerUrl: null,
      NumPosts: 0,
      Birthday: "Unknown",
      DoNotShow: true,
    };
  }

  return convertUser(data[0]);
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
      "Id, EmpathyCount, Feeling, GameCommunityIconUri, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ReplyCount, ScreenName, ScreenShotUri, Text, Title, TitleId, VideoUrl, NNID, HideRequested"
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
      "Id, EmpathyCount, Feeling, GameCommunityIconUri, InReplyToId, GameCommunityTitle, GameId, IconUri, ImageUri, IsPlayed, IsSpoiler, PostedDate, ScreenName, ScreenShotUri, Text, TitleId, NNID, HideRequested"
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
  IsSpoiler: boolean;
  IsPlayed: boolean;
  Date: Date;
  DoNotShow: boolean;
};

const convertPost = (data): Post => {
  if (data.HideRequested) {
    return {
      ID: null,
      MiiName: "Hidden",
      NNID: null,
      MiiUrl: null,
      NumYeahs: 0,
      NumReplies: 0,
      Title: null,
      Text: "This user has requested their data to be deleted",
      DrawingUrl: null,
      ScreenshotUrl: null,
      VideoUrl: null,
      CommunityTitle: null,
      CommunityIconUrl: null,
      GameID: null,
      TitleID: null,
      IsSpoiler: false,
      IsPlayed: false,
      Date: null,
      DoNotShow: true,
    };
  }

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
    VideoUrl: data.VideoUrl === "" ? null : data.VideoUrl,
    CommunityTitle: data.GameCommunityTitle,
    CommunityIconUrl: data.IconUri
      ? getArchiveFromUri(data.GameCommunityIconUri)
      : null,
    GameID: data.GameId,
    TitleID: data.TitleId,
    IsSpoiler: data.IsSpoiler,
    IsPlayed: data.IsPlayed,
    Date: new Date(data.PostedDate * 1000),
    DoNotShow: data.HideRequested,
  };

  return post;
};

export type User = {
  NNID: string;
  MiiName: string;
  MiiUrl: string;
  Bio: string;
  BannerUrl: string;
  Country: string | null;
  NumFollowers: number | null;
  NumFollowing: number | null;
  NumFriends: number | null;
  NumPosts: number;
  Birthday: string;
  DoNotShow: boolean;
};

const convertUser = (data): User => {
  if (data.HideRequested) {
    return {
      NNID: data.NNID,
      MiiName: "Hidden",
      MiiUrl: IMAGES.unknownMii,
      Bio: "This user has requested their data to be deleted.",
      Country: "Hidden",
      NumFollowers: null,
      NumFollowing: null,
      NumFriends: null,
      NumPosts: 0,
      BannerUrl: null,
      Birthday: "Hidden",
      DoNotShow: true,
    };
  }
  if (data.IsHidden || data.IsError) {
    return {
      NNID: data.NNID,
      MiiName: data.NNID,
      MiiUrl: IMAGES.unknownMii,
      Bio:
        "This user " +
        (data.IsHidden
          ? " was banned by Nintendo."
          : " was deleted by Nintendo."),
      Country: "Unknown",
      NumFollowers: null,
      NumFollowing: null,
      NumFriends: null,
      BannerUrl: null,
      NumPosts: data.NumPosts,
      Birthday: "Unknown",
      DoNotShow: true,
    };
  }

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
    BannerUrl: data.SidebarCoverUrl === "" ? null : data.SidebarCoverUrl,
    DoNotShow: false,
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
  IsSpoiler: boolean;
  IsPlayed: boolean;
  Date: Date;
  DoNotShow: boolean;
};

const convertReply = (data): Reply => {
  if (data.HideRequested) {
    return {
      ID: null,
      MiiName: "Hidden",
      NNID: null,
      MiiUrl: null,
      NumYeahs: 0,
      Text: "This user has requested their data to be deleted",
      DrawingUrl: null,
      ScreenshotUrl: null,
      ReplyingToID: null,
      IsSpoiler: false,
      IsPlayed: false,
      Date: null,
      DoNotShow: true,
    };
  }

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
    IsSpoiler: data.IsSpoiler,
    IsPlayed: data.IsPlayed,
    Date: new Date(data.PostedDate * 1000),
    DoNotShow: false,
  };

  return reply;
};

export type Community = {
  GameID: string;
  TitleID: string;
  CommunityTitle: string;
  CommunityBanner: string | null;
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

  switch (data.CommunityBadge) {
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
    CommunityBanner: data.CommunityListIcon
      ? getArchiveFromUri(data.CommunityListIcon)
      : null,
    CommunityIconUrl: data.IconUri ? getArchiveFromUri(data.IconUri) : null,
    Badge: convertedBadge,
    GameTitle: data.Type,
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

  if (!url) {
    return IMAGES.unknownMii;
  }

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

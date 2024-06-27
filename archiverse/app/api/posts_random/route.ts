import {
  Community,
  getCommunities,
  getHomepageDrawings,
  getPostReplies,
  getPosts,
  getRandomPosts,
  searchCommunities,
} from "@server/database";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const post = await getRandomPosts();
    return NextResponse.json(post);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// If you need to handle other HTTP methods, you can add them like this:
// export async function POST() {
//   // Handle POST requests
// }

// export async function PUT() {
//   // Handle PUT requests
// }

// export async function DELETE() {
//   // Handle DELETE requests
// }
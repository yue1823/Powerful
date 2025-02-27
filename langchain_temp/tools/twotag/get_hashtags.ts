/**
 * get hashtags from 2tag
 * @param agent MoveAgentKit instance
 * @param keywords keywords
 * @param account user address
 * @returns hashtags []
 *
 */

export async function get_hashtags(
  keywords: string,
  account: string,
): Promise<string[]> {
  try {
    const hashtagsResponse = await fetch(
      `${process.env.HASHTAG_END_POINT}/predict?input=${keywords}&key=${account}`,
      {
        method: "GET",
      },
    );

    const hashtags = await hashtagsResponse.json();
    const result: string[] = hashtags.hashtags.map(
      (data: { hashtag: string; acc: number }) => data.hashtag,
    );
    return result;
  } catch (error: any) {
    throw new Error(`get hashtags failed: ${error.message}`);
  }
}

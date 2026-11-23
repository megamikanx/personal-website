import { cacheLife } from "next/cache";

export type Track = { uri: string; title: string; artist: string };

export const PLAYLIST_ID = "6t1Lw2FcHK1pqJbrneqs3C";

/** Used if Spotify can't be reached or its embed page changes shape. */
const FALLBACK: Track[] = [
  { uri: "spotify:track:5ddKhEInw4xkOYzI6KIXsG", title: "All At Once", artist: "Ninajirachi" },
  { uri: "spotify:track:3pkXNBtkg8E2xRAKrnu43s", title: "iPod Touch", artist: "Ninajirachi" },
  { uri: "spotify:track:6ZfVV6bzqvN10zUBXOmSnP", title: "Get That", artist: "Hutcher, Scrufizzer" },
  { uri: "spotify:track:33nOHyNeOKwwjKMrF9VN4V", title: "CSIRAC", artist: "Ninajirachi" },
  { uri: "spotify:track:7JW8FRWVCOQDs40IjEXdPi", title: "WannaCry", artist: "Ninajirachi, Porter Robinson" },
  { uri: "spotify:track:1JowcJWNSlUROxj0lKSd4L", title: "Wayside", artist: "Ninajirachi" },
  { uri: "spotify:track:4C4zy9kfjYjr6IcNAdV7ZD", title: "Everything Goes On", artist: "Porter Robinson, League of Legends" },
  { uri: "spotify:track:1ggsR5kCepKTW4F64bCFdV", title: "Cheerleader", artist: "Porter Robinson" },
  { uri: "spotify:track:5F9wlTvcSczETueB5Q5FuO", title: "SAISHU-KICHIKU IMOTO Flandre-S", artist: "ビートまりお" },
  { uri: "spotify:track:0Xeb5XRL5SGZRLfgFTmks4", title: "Help me, ERINNNNNN!!", artist: "ビートまりお" },
  { uri: "spotify:track:364IvX1rVGGHQI5NIC8dkx", title: "Bad Apple!! - 2014 Refix", artist: "Alstroemeria Records, nomico" },
  { uri: "spotify:track:6F6DM614sKOZuMFst9xiIb", title: "Night of Knights / Knight of Nights", artist: "ビートまりお" },
  { uri: "spotify:track:5GFf1Vqo8vlb6IUJVmNN9v", title: "A CYBER'S WORLD?", artist: "Toby Fox" },
  { uri: "spotify:track:7mykoq6R3BArsSpNDjFQTm", title: "I Really Want to Stay at Your House", artist: "Rosa Walton, Hallie Coggins" },
  { uri: "spotify:track:3s2YCL5LHLzXWbw7ezQru3", title: "Know My Name", artist: "True Damage, League of Legends, Sofía Reyes, VIC MENSA, Coco Jones, SOYEON, i-dle" },
];

/**
 * Tracks in the Spotify playlist, read from Spotify's public embed page
 * (no API key needed) and cached for a day, so edits to the playlist show up.
 */
export async function getPlaylist(): Promise<Track[]> {
  "use cache";
  cacheLife("days");

  try {
    const res = await fetch(`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`, {
      headers: { "user-agent": "Mozilla/5.0" },
    });
    const html = await res.text();
    const json = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)?.[1];
    const list: { uri?: string; title?: string; subtitle?: string }[] | undefined =
      json && JSON.parse(json).props?.pageProps?.state?.data?.entity?.trackList;
    const tracks = (list ?? [])
      .filter((t) => t.uri?.startsWith("spotify:track:") && t.title)
      .map((t) => ({ uri: t.uri!, title: t.title!, artist: t.subtitle ?? "" }));
    return tracks.length ? tracks : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

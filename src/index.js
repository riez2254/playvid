export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const id = url.searchParams.get("id");
    const type = url.searchParams.get("type") || "dash";

    if (pathname === "/" && id) {
      return Response.redirect(`${url.origin}/play.mpd?id=${id}&type=${type}`, 302);
    }

    if (pathname === "/play.mpd" && id) {
      const apiUrl = `https://api.vidio.com/livestreamings/${id}/stream?initialize=true`;

      const headers = {
        "User-Agent": "tv-android/2.42.6 (704)",
        "x-client": "1754045001",
        "x-signature": "93659399a6777707af461acf51f50e958f14cb5e1710caf389d731f1379eb701",
        "referer": "androidtv-app://com.vidio.android.tv",
        "x-api-platform": "tv-android",
        "x-api-auth": "laZOmogezono5ogekaso5oz4Mezimew1",
        "x-api-app-info": "tv-android/9/2.42.6-704",
        "accept-language": "id",
        "x-user-email": "salmahayuk@gmail.com",
        "x-user-token": "xevCH8Aj5SRJDBN6k5Ym",
        "x-visitor-id": "41c88d80-185f-45ad-ab95-f06002f9fef8",
        "content-type": "application/vnd.api+json",
      };

      const response = await fetch(apiUrl, { headers });
      const text = await response.text();

      // Coba parse JSON
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        return new Response("Gagal parse JSON: " + e.message, { status: 500 });
      }

      // Ambil link MPD dari beberapa kemungkinan field
      let mpdUrl =
        json?.data?.sources?.dash ||
        json?.data?.sources?.drm_stream_dash_url ||
        json?.data?.drm_stream_dash_url ||
        json?.data?.dash ||
        getBetween(text, '"dash":"', '"') ||
        getBetween(text, '"drm_stream_dash_url":"', '"');

      if (!mpdUrl) {
        return new Response("MPD URL tidak ditemukan\n\n" + text, {
          status: 404,
          headers: { "content-type": "text/plain" },
        });
      }

      return Response.redirect(mpdUrl, 302);
    }

    return new Response("Gunakan format ?id=xxxx&type=dash", { status: 400 });
  },
};

function getBetween(str, start, end) {
  const s = str.indexOf(start);
  if (s === -1) return "";
  const e = str.indexOf(end, s + start.length);
  return e === -1 ? "" : str.substring(s + start.length, e);
}

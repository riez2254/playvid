export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const id = url.searchParams.get("id");

    if (pathname === "/" && id) {
      return Response.redirect(`${url.origin}/play.mpd?id=${id}`, 302);
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
        "content-type": "application/vnd.api+json"
      };

      const response = await fetch(apiUrl, { headers });
      const text = await response.text();
      const match = text.match(/https:[^"]+\.mpd/);
      const dashUrl = match ? match[0].replace(/\\/g, "") : null;

      if (!dashUrl) {
        return new Response("MPD URL not found", { status: 404 });
      }

      return Response.redirect(dashUrl, 302);
    }

    return new Response("Invalid request", { status: 400 });
  },
};

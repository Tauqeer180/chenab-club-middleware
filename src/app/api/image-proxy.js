export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing image URL");
  }

  try {
    const response = await fetch(decodeURIComponent(url));
    const contentType = response.headers.get("content-type");

    if (!response.ok || !contentType.startsWith("image")) {
      return res.status(400).send("Invalid image URL");
    }

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

    return res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    return res.status(500).send("Image fetch failed", error);
  }
}

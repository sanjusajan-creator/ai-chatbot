const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: "Missing NVIDIA_API_KEY" })
    return
  }

  let payload = req.body
  if (!payload || typeof payload === "string") {
    try {
      payload = JSON.parse(payload || "{}")
    } catch {
      res.status(400).json({ error: "Invalid JSON body" })
      return
    }
  }

  const response = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  res.status(response.status)
  res.setHeader(
    "Content-Type",
    response.headers.get("content-type") || "text/event-stream"
  )
  res.setHeader("Cache-Control", "no-cache")

  if (!response.body) {
    const text = await response.text()
    res.end(text)
    return
  }

  const reader = response.body.getReader()
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    res.write(Buffer.from(value))
  }
  res.end()
}

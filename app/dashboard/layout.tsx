const cookie = cookies().get("session")?.value

console.log("SESSION COOKIE RAW:", cookie)

let session = null

try {
  session = cookie ? JSON.parse(cookie) : null
} catch (e) {
  console.log("🔥 JSON PARSE FAILED:", cookie)
}

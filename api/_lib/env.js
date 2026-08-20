// Trims env vars at the point of use — a value pasted from a terminal or a
// multi-line source into Vercel's dashboard can carry a trailing newline that
// looks invisible there but breaks exact-match APIs like Stripe's (a price ID
// with "\n" on the end doesn't match any real price, and fails as
// "No such price" instead of an obviously-env-related error).
export function envVar(name) {
  return process.env[name]?.trim()
}

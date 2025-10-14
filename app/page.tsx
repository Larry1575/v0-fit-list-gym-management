import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to member login by default
  redirect("/member/login")
}

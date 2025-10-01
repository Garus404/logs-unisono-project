import LoginPage from "./login/page";

export default function Home() {
  // For now, we'll just render the login page.
  // In the future, this could be a redirect logic based on auth state.
  return <LoginPage />;
}

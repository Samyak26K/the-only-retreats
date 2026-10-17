import { redirect } from "next/navigation";

export default function StayFoodPage() {
  redirect("/");
}

export const metadata = {
  robots: { index: false, follow: false },
};

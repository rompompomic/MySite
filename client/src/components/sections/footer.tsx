import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@shared/schema";

export default function Footer() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="text-15 font-regular text-gray-600">
          © 2024{" "}
          <span>{profile?.firstName || "John"}</span>{" "}
          <span>{profile?.lastName || "Wayne"}</span>.{" "}
          Все права защищены.
        </p>
      </div>
    </footer>
  );
}

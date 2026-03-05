import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPublicOemProfile,
  getPublicOemReviews,
} from "@/lib/supabase/queries/public-oem";
import { PublicProfileCard } from "@/components/oem/public-profile-card";
import { ReviewList } from "@/components/oem/review-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { generateOemProfileLD } from "@/lib/seo/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getPublicOemProfile(id);

  if (!data) {
    return { title: "工場が見つかりません | FoodOEM Connect" };
  }

  return {
    title: `${data.companyName} | FoodOEM Connect`,
    description: data.profile.description
      ? data.profile.description.slice(0, 160)
      : `${data.companyName}のOEM工場プロフィール - FoodOEM Connect`,
    openGraph: {
      title: `${data.companyName} | FoodOEM Connect`,
      description: data.profile.description?.slice(0, 160) ?? "",
      type: "profile",
    },
  };
}

export default async function PublicOemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPublicOemProfile(id);

  if (!data) {
    notFound();
  }

  const reviews = await getPublicOemReviews(data.profile.user_id);

  const jsonLd = generateOemProfileLD(
    data.companyName,
    data.profile.description ?? "",
    data.averageRating,
    data.reviewCount,
    id
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PublicProfileCard data={data} />

      {/* レビュー */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4 text-orange-600" />
            レビュー ({reviews.length}件)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewList reviews={reviews} />
        </CardContent>
      </Card>
    </>
  );
}

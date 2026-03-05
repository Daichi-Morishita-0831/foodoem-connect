import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Award,
  Package,
  Factory,
  Star,
} from "lucide-react";
import type { PublicOemData } from "@/lib/supabase/queries/public-oem";

export function PublicProfileCard({ data }: { data: PublicOemData }) {
  const { profile, companyName, averageRating, reviewCount } = data;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{companyName}</h1>
          {profile.description && (
            <p className="mt-2 text-sm text-gray-600">{profile.description}</p>
          )}
        </div>
        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-2">
            <Star className="h-5 w-5 fill-orange-400 text-orange-400" />
            <span className="text-lg font-bold text-gray-900">
              {averageRating}
            </span>
            <span className="text-sm text-gray-500">({reviewCount}件)</span>
          </div>
        )}
      </div>

      {/* 詳細 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 得意分野 */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Factory className="h-4 w-4 text-orange-600" />
              得意分野
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(profile.specialties as string[])?.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
              {(!profile.specialties ||
                (profile.specialties as string[]).length === 0) && (
                <span className="text-sm text-gray-400">未設定</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 認証 */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Award className="h-4 w-4 text-green-600" />
              取得認証
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(profile.certifications as string[])?.map((c) => (
                <Badge
                  key={c}
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-700"
                >
                  {c}
                </Badge>
              ))}
              {(!profile.certifications ||
                (profile.certifications as string[]).length === 0) && (
                <span className="text-sm text-gray-400">未設定</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ロット */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Package className="h-4 w-4 text-blue-600" />
              対応ロット
            </div>
            <p className="text-sm text-gray-700">
              {profile.min_lot_size
                ? `${profile.min_lot_size.toLocaleString()}個〜`
                : "下限なし"}
              {profile.max_lot_size
                ? ` ${profile.max_lot_size.toLocaleString()}個`
                : ""}
            </p>
          </CardContent>
        </Card>

        {/* 配送エリア */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4 text-red-500" />
              配送エリア
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(profile.delivery_areas as string[])?.map((a) => (
                <Badge key={a} variant="outline">
                  {a}
                </Badge>
              ))}
              {(!profile.delivery_areas ||
                (profile.delivery_areas as string[]).length === 0) && (
                <span className="text-sm text-gray-400">未設定</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Plus } from "lucide-react";
import { updateOemProfile } from "@/lib/supabase/actions/oem-profile";
import {
  specialtyOptions,
  certificationOptions,
  deliveryAreaOptions,
} from "@/lib/schemas/oem-profile";
import type { OemProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OemProfileForm({ profile }: { profile: OemProfile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>(profile.specialties);
  const [certifications, setCertifications] = useState<string[]>(profile.certifications);
  const [deliveryAreas, setDeliveryAreas] = useState<string[]>(profile.delivery_areas);
  const [minLot, setMinLot] = useState(profile.min_lot_size?.toString() ?? "");
  const [maxLot, setMaxLot] = useState(profile.max_lot_size?.toString() ?? "");
  const [productionArea, setProductionArea] = useState(profile.production_area ?? "");
  const [description, setDescription] = useState(profile.description ?? "");

  const handleSubmit = async () => {
    setLoading(true);
    const result = await updateOemProfile({
      specialties,
      certifications,
      min_lot_size: Number(minLot) || 0,
      max_lot_size: Number(maxLot) || 0,
      production_area: productionArea,
      delivery_areas: deliveryAreas,
      description,
    });
    setLoading(false);
    if ("error" in result) {
      alert(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* 得意分野 */}
      <Card>
        <CardHeader>
          <CardTitle>得意分野</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {specialtyOptions.map((opt) => {
              const selected = specialties.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setSpecialties(
                      selected
                        ? specialties.filter((s) => s !== opt)
                        : [...specialties, opt]
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selected
                      ? "border-orange-300 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {selected && <span className="mr-1">&#10003;</span>}
                  {opt}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 認証 */}
      <Card>
        <CardHeader>
          <CardTitle>取得認証</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {certificationOptions.map((opt) => {
              const selected = certifications.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setCertifications(
                      selected
                        ? certifications.filter((c) => c !== opt)
                        : [...certifications, opt]
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selected
                      ? "border-green-300 bg-green-50 text-green-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {selected && <span className="mr-1">&#10003;</span>}
                  {opt}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ロット・製造拠点 */}
      <Card>
        <CardHeader>
          <CardTitle>製造能力</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="minLot">最小ロット数</Label>
              <Input
                id="minLot"
                type="number"
                value={minLot}
                onChange={(e) => setMinLot(e.target.value)}
                placeholder="例: 100"
              />
            </div>
            <div>
              <Label htmlFor="maxLot">最大ロット数</Label>
              <Input
                id="maxLot"
                type="number"
                value={maxLot}
                onChange={(e) => setMaxLot(e.target.value)}
                placeholder="例: 50000"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="productionArea">製造拠点</Label>
            <Input
              id="productionArea"
              value={productionArea}
              onChange={(e) => setProductionArea(e.target.value)}
              placeholder="例: 埼玉県川越市"
            />
          </div>
        </CardContent>
      </Card>

      {/* 配送エリア */}
      <Card>
        <CardHeader>
          <CardTitle>配送エリア</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {deliveryAreaOptions.map((opt) => {
              const selected = deliveryAreas.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setDeliveryAreas(
                      selected
                        ? deliveryAreas.filter((a) => a !== opt)
                        : [...deliveryAreas, opt]
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selected
                      ? "border-blue-300 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {selected && <span className="mr-1">&#10003;</span>}
                  {opt}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 工場紹介 */}
      <Card>
        <CardHeader>
          <CardTitle>工場紹介</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="工場の特徴、強み、こだわりなどを記入してください..."
          />
        </CardContent>
      </Card>

      {/* 保存ボタン */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700"
        size="lg"
      >
        <Save className="mr-2 h-4 w-4" />
        {loading ? "保存中..." : "プロフィールを保存"}
      </Button>
    </div>
  );
}

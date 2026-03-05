"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-orange-600" />
          <span className="text-xl font-bold text-gray-900">
            FoodOEM <span className="text-orange-600">Connect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#how-it-works"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            使い方
          </Link>
          <Link
            href="#features"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            特徴
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              ログイン
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              無料で始める
            </Button>
          </Link>
        </nav>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="#how-it-works"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                使い方
              </Link>
              <Link
                href="#features"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                特徴
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  ログイン
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  無料で始める
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { loyaltyTiers, pointRules, redemptionOptions } from "@/constants/loyalGuest";

export default function LoyalGuestPage() {
  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="w-full max-w-5xl px-4 pb-8">
          <h1 className="playfair text-3xl py-6 text-center">LOYAL GUEST PROGRAM</h1>

          <p className="font-light text-[14px] text-center max-w-2xl mx-auto mb-10">
            At La Siesta Premium Saigon, we believe every return deserves recognition. Our Loyal
            Guest program rewards you for every stay — from your first night to a lifetime of
            memories.
          </p>

          <h2 className="playfair text-[24px] text-[#081746] text-center mb-6">
            Membership Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {loyaltyTiers.map((tier) => (
              <div key={tier.name} className="border-t-4 p-6" style={{ borderColor: tier.color }}>
                <h3 className="playfair text-[24px] mb-1" style={{ color: tier.color }}>
                  {tier.name}
                </h3>
                <p className="font-light text-[13px] text-gray-500 mb-4">
                  {tier.maxNights
                    ? `${tier.minNights}–${tier.maxNights} nights / year`
                    : `${tier.minNights}+ nights / year`}
                </p>
                <ul className="list-disc list-inside space-y-1 font-light text-[14px]">
                  {tier.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="playfair text-[24px] text-[#081746] text-center mb-4 mt-8">
            How to Earn Points
          </h2>
          <div className="max-w-2xl mx-auto mb-12">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-[14px]">Activity</TableHead>
                  <TableHead className="font-medium text-[14px]">Points Earned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pointRules.map((rule) => (
                  <TableRow key={rule.action}>
                    <TableCell className="font-light text-[14px]">{rule.action}</TableCell>
                    <TableCell className="font-light text-[14px]">{rule.pointsEarned}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <h2 className="playfair text-[24px] text-[#081746] text-center mb-6 mt-8">
            Redeem Your Points
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {redemptionOptions.map((option) => (
              <div key={option.name} className="border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-[15px]">{option.name}</h4>
                  <span className="text-[13px] text-[#BF882E] font-medium">
                    {option.pointsRequired}
                  </span>
                </div>
                <p className="font-light text-[13px] text-gray-600">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="w-full bg-[#BF882E] py-12 text-center text-white mt-4">
        <h2 className="playfair text-[28px] mb-3">Start Earning Rewards Today</h2>
        <p className="font-light text-[15px] mb-6 max-w-md mx-auto">
          Create your account and automatically enroll in the Loyal Guest program.
        </p>
        <Link href="/sign-up">
          <Button className="bg-white text-[#BF882E] hover:bg-gray-100 rounded-none px-8 font-medium text-[14px]">
            Become a Loyal Guest
          </Button>
        </Link>
      </section>
    </div>
  );
}

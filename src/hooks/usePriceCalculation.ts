"use client";

import { useState, useMemo, useEffect } from "react";
import { calculatePatchPrice, getUpsellTiers } from "@/lib/pricingCalculator";
import { applyVelcroPricing, getRushSurcharge } from "@/lib/checkoutConfig";

interface UsePriceCalculationProps {
  productType: string;
  width: number;
  height: number;
  quantity: number;
  deliveryOption: "rush" | "standard" | "economy";
  backing?: string;
}

export function usePriceCalculation({
  productType,
  width,
  height,
  quantity,
  deliveryOption,
  backing,
}: UsePriceCalculationProps) {
  const [pricePulse, setPricePulse] = useState(false);

  const priceResult = useMemo(() => {
    return calculatePatchPrice(productType, width, height, quantity);
  }, [productType, width, height, quantity]);

  const upsellTiers = useMemo(() => {
    return getUpsellTiers(productType, width, height, quantity);
  }, [productType, width, height, quantity]);

  useEffect(() => {
    setPricePulse(true);
    const timer = setTimeout(() => setPricePulse(false), 300);
    return () => clearTimeout(timer);
  }, [width, height, quantity, deliveryOption, backing]);

  const rushSurcharge = deliveryOption === "rush" ? getRushSurcharge(quantity) : 0;
  const discount = deliveryOption === "economy" ? 0.05 : 0;

  const baseFromCalculator = priceResult.totalPrice;
  const originalPrice = applyVelcroPricing(baseFromCalculator, backing, quantity);
  const velcroFee = Math.round((originalPrice - baseFromCalculator) * 100) / 100;
  const discountAmount = Math.round(originalPrice * discount * 100) / 100;
  const basePrice = Math.round((originalPrice - discountAmount + rushSurcharge) * 100) / 100;
  const unitPrice = quantity > 0 ? originalPrice / quantity : priceResult.unitPrice;

  return { priceResult, upsellTiers, discount, originalPrice, discountAmount, basePrice, unitPrice, pricePulse, rushSurcharge, velcroFee };
}

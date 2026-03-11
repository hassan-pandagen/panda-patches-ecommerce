"use client";

import { useState, useMemo, useEffect } from "react";
import { calculatePatchPrice, getUpsellTiers } from "@/lib/pricingCalculator";

interface UsePriceCalculationProps {
  productType: string;
  width: number;
  height: number;
  quantity: number;
  deliveryOption: "rush" | "standard" | "economy";
}

function getRushSurcharge(quantity: number): number {
  if (quantity <= 50) return 100;
  if (quantity <= 250) return 150;
  if (quantity <= 1000) return 200;
  return 300;
}

export function usePriceCalculation({
  productType,
  width,
  height,
  quantity,
  deliveryOption,
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
  }, [width, height, quantity, deliveryOption]);

  const rushSurcharge = deliveryOption === "rush" ? getRushSurcharge(quantity) : 0;
  const discount = deliveryOption === "economy" ? 0.1 : 0;
  const originalPrice = priceResult.totalPrice;
  const discountAmount = originalPrice * discount;
  const basePrice = originalPrice - discountAmount + rushSurcharge;
  const unitPrice = priceResult.unitPrice;

  return { priceResult, upsellTiers, discount, originalPrice, discountAmount, basePrice, unitPrice, pricePulse, rushSurcharge };
}

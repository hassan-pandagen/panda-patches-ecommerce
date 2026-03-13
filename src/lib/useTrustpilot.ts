'use client';

import { useState, useEffect } from 'react';
import { TRUSTPILOT_RATING, TRUSTPILOT_REVIEW_COUNT } from './reviewConstants';

interface TrustpilotData {
  rating: string;
  reviewCount: number;
}

export function useTrustpilot(): TrustpilotData {
  const [data, setData] = useState<TrustpilotData>({
    rating: TRUSTPILOT_RATING,
    reviewCount: TRUSTPILOT_REVIEW_COUNT,
  });

  useEffect(() => {
    fetch('/api/trustpilot-rating')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json?.rating && json?.reviewCount) {
          setData({ rating: json.rating, reviewCount: json.reviewCount });
        }
      })
      .catch(() => {});
  }, []);

  return data;
}

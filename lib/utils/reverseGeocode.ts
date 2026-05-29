type ReverseGeocodeResult = {
  label: string | null;
};

export async function reverseGeocode(
  latitude: number | null,
  longitude: number | null
): Promise<ReverseGeocodeResult> {
  if (latitude === null || longitude === null) {
    return { label: null };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          "User-Agent": "BaluBalu Traceability MVP"
        },
        signal: controller.signal,
        next: { revalidate: 0 }
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      return { label: null };
    }

    const data = (await response.json()) as {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        country?: string;
      };
    };

    const locality = data.address?.city ?? data.address?.town ?? data.address?.village;
    const state = data.address?.state;
    const country = data.address?.country;
    const parts = [locality, state, country].filter(Boolean);

    return { label: parts.length ? parts.join(", ") : null };
  } catch {
    return { label: null };
  }
}

"use client";

import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

export function PlantGrowthScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const soilRise = spring({ fps, frame, config: { damping: 14 } });
  const sprout = spring({ fps, frame: frame - 22, config: { damping: 12 } });
  const stemGrowth = spring({ fps, frame: frame - 42, config: { damping: 14 } });
  const leafGrowth = spring({ fps, frame: frame - 64, config: { damping: 12 } });
  const bunchGrowth = spring({ fps, frame: frame - 92, config: { damping: 10 } });
  const boxReveal = spring({ fps, frame: frame - 132, config: { damping: 10 } });

  const ambientOpacity = interpolate(frame, [0, 50, 180], [0.35, 0.9, 1], {
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at top, rgba(86,163,92,0.25), transparent 28%), linear-gradient(180deg, #07141d 0%, #0c2631 42%, #173822 100%)",
        color: "white"
      }}
    >
      <AbsoluteFill
        style={{
          opacity: ambientOpacity,
          background:
            "radial-gradient(circle at 15% 25%, rgba(167,217,72,0.12), transparent 20%), radial-gradient(circle at 80% 15%, rgba(242,140,40,0.12), transparent 18%)"
        }}
      />

      <Sequence from={0}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 60,
            width: 740,
            height: 220,
            transform: `translateX(-50%) scaleY(${0.65 + soilRise * 0.35})`,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 40%, rgba(108,78,49,0.9), rgba(75,53,42,1) 60%, rgba(36,24,18,1) 100%)",
            boxShadow: "0 40px 80px rgba(0, 0, 0, 0.4)"
          }}
        />
      </Sequence>

      <Sequence from={18}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 200,
            width: 24,
            height: 24,
            transform: `translateX(-50%) scale(${0.4 + sprout * 0.7})`,
            borderRadius: "9999px",
            background: "#A7D948",
            boxShadow: "0 0 20px rgba(167,217,72,0.55)"
          }}
        />
      </Sequence>

      <Sequence from={30}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 196,
            width: 18,
            height: 240 * stemGrowth,
            transform: "translateX(-50%)",
            transformOrigin: "bottom center",
            borderRadius: 999,
            background: "linear-gradient(180deg, #7ECE58 0%, #0D5C3F 100%)"
          }}
        />
      </Sequence>

      <Sequence from={54}>
        {[
          { rotate: -42, bottom: 290, left: "calc(50% - 12px)" },
          { rotate: 34, bottom: 315, left: "calc(50% - 6px)" },
          { rotate: -18, bottom: 375, left: "50%" },
          { rotate: 22, bottom: 420, left: "50%" }
        ].map((leaf, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: leaf.left,
              bottom: leaf.bottom,
              width: 70 + index * 18,
              height: 180 + index * 20,
              transform: `translateX(-50%) rotate(${leaf.rotate}deg) scale(${0.3 + leafGrowth * 0.7})`,
              transformOrigin: "bottom center",
              borderRadius: "100% 0 100% 0",
              background:
                "linear-gradient(180deg, rgba(167,217,72,0.96) 0%, rgba(33,114,67,1) 80%)",
              boxShadow: "0 18px 40px rgba(0, 0, 0, 0.18)"
            }}
          />
        ))}
      </Sequence>

      <Sequence from={88}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 214,
            width: 130,
            height: 180,
            transform: `translateX(-50%) translateX(${40 - bunchGrowth * 40}px) scale(${0.4 + bunchGrowth * 0.6})`,
            transformOrigin: "top center"
          }}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: 30 + (index % 2) * 28,
                top: 20 + Math.floor(index / 2) * 34,
                width: 48,
                height: 22,
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, rgba(167,217,72,1) 0%, rgba(123,191,56,1) 100%)",
                transform: `rotate(${index % 2 === 0 ? -18 : 18}deg)`,
                boxShadow: "0 8px 18px rgba(0,0,0,0.2)"
              }}
            />
          ))}
        </div>
      </Sequence>

      <Sequence from={126}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 160,
            width: 300,
            height: 200,
            transform: `translateX(-50%) scale(${0.5 + boxReveal * 0.5})`,
            opacity: boxReveal
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              background:
                "linear-gradient(180deg, rgba(241,229,197,1) 0%, rgba(214,187,138,1) 100%)",
              border: "2px solid rgba(255,255,255,0.18)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.28)"
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 26,
              right: 26,
              top: 34,
              bottom: 34,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, rgba(13,92,63,1) 0%, rgba(16,61,96,1) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "#F1E5C5"
            }}
          >
            BALÚ
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
}

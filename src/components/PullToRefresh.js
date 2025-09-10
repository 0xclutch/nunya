import React, { useRef, useState } from "react";

const SHOW_ICON_THRESHOLD = 80; // px to start showing icon
const TRIGGER_REFRESH_THRESHOLD = 140; // px to trigger refresh
const ICON_SIZE = 48; // px
const ICON_COLOR = "#eea23f";
// Adjustable variable for pull-to-refresh icon vertical offset
const ICON_TOP_OFFSET = 65; // px from the top of the scroll area
const DURATION = 2000; // ms duration for the refresh icon to appear

// Final release polish: accessibility, performance, and mobile UX
export default function PullToRefresh({ onRefresh, children, onPull  }) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const pulling = useRef(false);
  const startY = useRef(0);
  const scrollerRef = useRef();

  // Only allow pull when scrolled to top
  function canPull(e) {
    // Allow pull if at top, not refreshing, and not already pulling
    // Also allow if scrollTop is undefined (e.g. first touch)
    if (!scrollerRef.current) return false;
    const scrollTop = scrollerRef.current.scrollTop;
    // On some mobile browsers, scrollTop may be fractional or slightly negative
    return (typeof scrollTop === 'number' ? scrollTop <= 2 : true) && !refreshing && !pulling.current;
  }

  // Touch handlers
  function onTouchStart(e) {
    if (canPull(e)) {
      pulling.current = true;
      startY.current = e.touches[0].clientY;
      setPull(0);
    }
  }
  function onTouchMove(e) {
    if (!pulling.current) return;
    const dist = Math.max(0, e.touches[0].clientY - startY.current);
    if (dist > 0) {
      e.preventDefault();
      setPull(dist);
      if(onPull) onPull(dist); // <-- call parent with new pull value
    }
    setPull(dist);
  }
  function onTouchEnd() {
    if (!pulling.current) return;
    pulling.current = false;
    if (pull >= TRIGGER_REFRESH_THRESHOLD) {
      setRefreshing(true);
      Promise.resolve(onRefresh?.())
        .then(() => new Promise((resolve) => setTimeout(resolve, DURATION))) // Use DURATION here
        .finally(() => {
          setRefreshing(false);
          setPull(0);
          if (onPull) onPull(0); // Reset pull value in parent
        });
    } else {
      setPull(0);
      if (onPull) onPull(0); // Reset pull value in parent
    }
  }

  // Keyboard accessibility: allow refresh with Ctrl+R or Cmd+R
  React.useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
        e.preventDefault();
        if (!refreshing) {
          setRefreshing(true);
          Promise.resolve(onRefresh?.())
            .then(() => new Promise((resolve) => setTimeout(resolve, DURATION))) // Use DURATION here
            .finally(() => {
              setRefreshing(false);
              setPull(0);
            });
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [refreshing, onRefresh]);

  // Icon position and rotation logic
  const showIcon = pull > SHOW_ICON_THRESHOLD || refreshing;
  const iconY = refreshing
    ? Math.min(TRIGGER_REFRESH_THRESHOLD, 120) + ICON_TOP_OFFSET
    : Math.min(Math.max(pull, 0), 120) + ICON_TOP_OFFSET;
  const rotateDeg = refreshing
    ? undefined
    : `${Math.round((pull / TRIGGER_REFRESH_THRESHOLD) * 360)}deg`;

  return (
    <div
      ref={scrollerRef}
      style={{
        position: "relative",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        height: "100vh",
        touchAction: "pan-y",
        background: "transparent",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
      role="region"
    >
      {/* Pull-to-refresh icon */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: iconY - ICON_SIZE,
          left: "50%",
          marginLeft: -ICON_SIZE / 2,
          width: ICON_SIZE,
          height: ICON_SIZE,
          opacity: showIcon ? 1 : 0,
          transform: refreshing
            ? `translateY(0)`
            : `rotate(${rotateDeg})`,
          transition: refreshing
            ? "top 0.2s cubic-bezier(.4,0,.2,1)"
            : "opacity 0.1s",
          zIndex: 100,
          pointerEvents: "none",
          willChange: "top, opacity, transform",
        }}
      >
        <div
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            borderRadius: "50%",
            background: ICON_COLOR,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px #0002",
            animation: refreshing ? "spin 1s linear infinite" : undefined,
          }}
        >
          <svg
            width={ICON_SIZE / 2}
            height={ICON_SIZE / 2}
            viewBox="0 0 50 50"
            style={{ display: "block" }}
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#fff"
              strokeWidth="5"
              strokeDasharray="90"
              strokeDashoffset={refreshing ? 60 : 0}
              style={{ transition: refreshing ? undefined : "stroke-dashoffset 0.2s" }}
            />
          </svg>
        </div>
      </div>
      {/* Content, moves down on pull */}
      <div
        style={{
          transition: refreshing ? "transform 0.2s cubic-bezier(.4,0,.2,1)" : "transform 0.1s",
          willChange: "transform",
        }}
      >
        {children}
      </div>
      {/* Keyframes for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}
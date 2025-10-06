// Acts like a css style
// JS-based auto scaling for precise fit - attach the component
// use this whenn you nneed deterministic scale-to-fit for varying lengths


import { useRef, useEffect } from 'react';


function AutoScaleText({ children, min=10, max=20, step=0.5, className}) {

    const elRef = useRef(null);
    useEffect(() => {
        const el = elRef.current;
            if (!el) return;
    // reset size then shrink until fits
    let size = max;
    el.style.fontSize = `${size}px`;
    // small loop; respects min
    while ((el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) && size > min) {
      size = Math.max(min, size - step);
      el.style.fontSize = `${size}px`;
      // avoid tight CPU loop on slow devices
    }
  }, [children, min, max, step]);

  return (
    <div
      ref={elRef}
      className={className}
      style={{
        padding: "8px 10px",
        boxSizing: "border-box",
        textAlign: "center",
        width: "100%",
        height: "58px", // match your caption area; ensures measurement space
        overflow: "hidden",
        lineHeight: 1.08,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}


// import { useEffect } from "react"

// // const state = usePullToRefresh(ref, onTrigger)

// function usePullToRefresh(
//     ref,
//     onTrigger
// ) {
//     useEffect(() => {
//         const el = ref.current;
//         if(!el) return;

//         // attach
//         el.addEventListener("touchstart", handleTouchStart, { passive: true });

//         function handleTouchStart(startEvent) {
//             // You can use startEvent here if needed, or remove it if unused
//             // startEvent must be TouchEvent but for JS not TS
            
//             const initY = startEvent.touches[0].clientY;
//             el.addEventListener("touchmove", handleTouchMove, { passive: true });
//             el.addEventListener("touchend", handleTouchEnd, { passive: true });

//             function handleTouchMove(moveEvent) {
//                 const el = ref.current;
//                 if (!el) return;

//                 // y pos
//                 const y = moveEvent.touches[0].clientY;

//                 // difference
//                 const dy = y - initY;

//                 if (dy < 0) return;

//                 // Update the elements transform
//                 // REDUDANT, COMPATIBILITY MODE : el.style.transform = `translateY(${Math.min(dy, 100)}px)`;
//                 el.style.transform = `translateY(${appr(dy)}px)`;
//             }  


//         const MAX = 128;
//         const k = 0.4;

//         function appr(x) {
//             return MAX * (1 - Math.exp((-k * x) / MAX));
//         }

//         function handleTouchEnd() {
//             const el = ref.current;
//             if (!el) return;


//             // return element to original position
//             el.style.transition = "transform 0.3s ease-out";
//             el.style.transform = "translateY(0px)";

//             // listen for transition end event
//             el.addEventListener("transitionend", onTransitionEnd);

//             // celanup
//             el.removeEventListener("touchmove", handleTouchMove);
//             el.removeEventListener("touchend", handleTouchEnd); 
//         }

//         function onTransitionEnd() {
//             const el = ref.current;
//             if (!el) return;

//             // remove transition
//             el.style.transition = "";

//             // remove event listener
//             el.removeEventListener("transitionend", onTransitionEnd);

//             // trigger the refresh
//             onTrigger();
//         }
//     }

//     return () => {
//         // cleanup
//         el.removeEventListener("touchstart", handleTouchStart);
//         };
//     }, [ref.current]);
// }
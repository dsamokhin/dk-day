import { useEffect, useRef, useState } from "react";
import "./App.css";
import kermit from "./assets/kermit.jpg";
import card from "./assets/card.jpg";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function App() {
  const buttonsRef = useRef(null);
  const noRef = useRef(null);

  const [noPos, setNoPos] = useState({ x: 80, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const box = buttonsRef.current;
    const btn = noRef.current;
    if (!box || !btn) return;

    const handleMove = (e) => {
      const boxRect = box.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();

      const mx = e.clientX;
      const my = e.clientY;

      const cx = btnRect.left + btnRect.width / 2;
      const cy = btnRect.top + btnRect.height / 2;

      const dx = cx - mx;
      const dy = cy - my;

      const dist = Math.hypot(dx, dy);
      const dangerRadius = 120;

      if (dist > dangerRadius) return;

      const len = Math.max(dist, 0.001);
      const ux = dx / len;
      const uy = dy / len;

      const strength = (dangerRadius - dist) / dangerRadius;
      const step = 50 + 120 * strength;

      setNoPos((p) => {
        let x = p.x + ux * step;
        let y = p.y + uy * step;

        // bounds inside buttons container
        const pad = 4;

        const minX = -(btnRect.left - boxRect.left) + pad;
        const maxX = boxRect.right - btnRect.right - pad;

        const minY = -(btnRect.top - boxRect.top) + pad;
        const maxY = boxRect.bottom - btnRect.bottom - pad;

        x = clamp(x, minX, maxX);
        y = clamp(y, minY, maxY);

        return { x, y };
      });

      setYesScale((s) => clamp(s + 0.01, 1, 2.4));
    };

    box.addEventListener("mousemove", handleMove);
    return () => box.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="wrapper">
      <div className="content">
        <img src={kermit} className="img" alt="kermit" />
        <h3 className="title">Will you be my valentine????</h3>
        <div className="buttons" ref={buttonsRef}>
          <button
            className="button yes"
            style={{
              transform: `translate(calc(-50% - 100px), -50%) scale(${yesScale})`,
            }}
            onClick={() => setIsShown(true)}
          >
            Да
          </button>

          <button
            ref={noRef}
            className="button no"
            style={{
              transform: `translate(calc(-50% + 100px + ${noPos.x}px), calc(-50% + ${noPos.y}px))`,
            }}
            disabled
          >
            Ни
          </button>
        </div>
        {isShown && (
          <div className="card">
            YAY!
            <img src={card} className="img cardImg" alt="kermit" />
          </div>
        )}
      </div>
    </div>
  );
}

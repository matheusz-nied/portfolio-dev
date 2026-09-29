import { DitherBlock } from "./DitherBlock";

type Dense = "left" | "right" | "top" | "bottom";

interface Block {
  /** CSS grid-column / grid-row on the 12-column field. */
  col: string;
  row: string;
  dense: Dense;
}

const HERO_BLOCKS: Block[] = [
  { col: "11 / 13", row: "1 / 2", dense: "right" },
  { col: "9 / 13", row: "3 / 4", dense: "right" },
  { col: "10 / 12", row: "5 / 6", dense: "right" },
];

/** Decorative dithered blocks aligned to the frame's dashed grid. */
export function SignalField() {
  return (
    <div className="tl-field" aria-hidden="true">
      {HERO_BLOCKS.map((block, i) => (
        <DitherBlock
          key={`${block.col}-${block.row}`}
          dense={block.dense}
          seed={i + 1}
          style={{ gridColumn: block.col, gridRow: block.row }}
        />
      ))}
    </div>
  );
}

/** Compact strip shown under the hero copy on small screens. */
export function SignalStrip() {
  return (
    <div className="tl-strip" aria-hidden="true">
      <DitherBlock dense="right" seed={3} />
      <DitherBlock dense="right" seed={8} />
    </div>
  );
}

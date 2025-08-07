type Props = {
  direction: "left" | "right";
};

export default function SliderArrow({ direction }: Props) {
  return <span>{direction === "left" ? "<" : ">"}</span>;
}

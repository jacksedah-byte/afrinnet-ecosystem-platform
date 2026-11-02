import { Callout } from "@/components/site/primitives";

export function FeatureUnavailable({
  title,
  children,
}: {
  title: string;
  children: string;
}) {
  return (
    <Callout title={title} className="text-sm leading-6">
      {children}
    </Callout>
  );
}

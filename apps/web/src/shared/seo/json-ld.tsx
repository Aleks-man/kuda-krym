type JsonLdProps = Readonly<{
  data: Readonly<Record<string, unknown>>;
}>;

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      type="application/ld+json"
    />
  );
}

export function serializeJsonLd(data: JsonLdProps["data"]): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

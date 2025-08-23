"use client";

export default function FormattedDescription({
  text,
}: {
  text: string | null;
}) {
  if (!text) {
    return null;
  }
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine === "") {
          return null;
        }

        if (/^\d\.\s/.test(trimmedLine)) {
          return (
            <h4 key={index} className="font-bold text-md pt-2">
              {trimmedLine}
            </h4>
          );
        } else {
          return (
            <p key={index} className="text-sm text-gray-800 leading-relaxed">
              {trimmedLine}
            </p>
          );
        }
      })}
    </div>
  );
}

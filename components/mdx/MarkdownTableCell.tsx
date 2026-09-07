import {
  Children,
  Fragment,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

type MarkdownTableCellProps = ComponentPropsWithoutRef<"td">;

type InlineList =
  | {
      kind: "ordered";
      items: string[];
      start?: number;
    }
  | {
      kind: "unordered";
      items: string[];
    };

const orderedItemPattern = /^(\d+)[.)]\s+(.+)$/;
const unorderedItemPattern = /^[-*•]\s+(.+)$/;
const commaSeparatorPattern = /,\s+/;

function getTextParts(children: ReactNode) {
  const lines = [""];
  let hasBreak = false;

  const appendChildren = (nextChildren: ReactNode): boolean =>
    Children.toArray(nextChildren).every(appendChild);

  const appendChild = (child: ReactNode): boolean => {
    if (child === null || child === undefined || typeof child === "boolean") {
      return true;
    }

    if (typeof child === "string" || typeof child === "number") {
      lines[lines.length - 1] += String(child);
      return true;
    }

    if (isValidElement(child) && child.type === "br") {
      hasBreak = true;
      lines.push("");
      return true;
    }

    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      return appendChildren(child.props.children);
    }

    return false;
  };

  if (!appendChildren(children)) {
    return null;
  }

  if (hasBreak) {
    return lines.map((line) => line.trim()).filter(Boolean);
  }

  const text = lines.join("").trim();

  if (!commaSeparatorPattern.test(text)) {
    return null;
  }

  return text.split(commaSeparatorPattern).map((line) => line.trim()).filter(Boolean);
}

function parseInlineList(children: ReactNode): InlineList | null {
  const lines = getTextParts(children);

  if (!lines || lines.length === 0) {
    return null;
  }

  const orderedMatches = lines.map((line) => line.match(orderedItemPattern));

  if (orderedMatches.every((match): match is RegExpMatchArray => Boolean(match))) {
    const start = Number(orderedMatches[0][1]);

    return {
      kind: "ordered",
      items: orderedMatches.map((match) => match[2]),
      start: start === 1 ? undefined : start,
    };
  }

  const unorderedMatches = lines.map((line) => line.match(unorderedItemPattern));

  if (unorderedMatches.every((match): match is RegExpMatchArray => Boolean(match))) {
    return {
      kind: "unordered",
      items: unorderedMatches.map((match) => match[1]),
    };
  }

  return null;
}

export function MarkdownTableCell({ children, ...props }: MarkdownTableCellProps) {
  const inlineList = parseInlineList(children);

  if (!inlineList) {
    return <td {...props}>{children}</td>;
  }

  if (inlineList.kind === "ordered") {
    return (
      <td {...props}>
        <ol start={inlineList.start}>
          {inlineList.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </td>
    );
  }

  return (
    <td {...props}>
      <ul>
        {inlineList.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </td>
  );
}

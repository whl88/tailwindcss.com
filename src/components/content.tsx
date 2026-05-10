import css from "dedent";
import { getLocale } from "next-intl/server";
import { Fragment } from "react";
import { CodeExample } from "./code-example";

const screens = {
  sm: { en: "small", zh: "小" },
  md: { en: "medium", zh: "中等" },
  lg: { en: "large", zh: "大" },
};

function startsWithVowel(string: string) {
  return ["a", "e", "i", "o", "u"].includes(string[0]);
}

function htmlSnippet({
  elementName,
  attributes,
  featuredClass,
}: {
  elementName: string;
  attributes: Record<string, string>;
  featuredClass: string;
}) {
  let parts = [`<!-- [!code classes:${featuredClass}] -->\n`];

  const attributesString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  parts.push(`<${elementName} ${attributesString}`);

  if (elementName === "img" || elementName === "input") {
    parts.push(" />");
  } else if (elementName === "textarea") {
    parts.push("></textarea>");
  } else if (elementName === "iframe") {
    parts.push("></iframe>");
  } else {
    parts.push(">\n");
    parts.push(elementName === "p" ? "  Lorem ipsum dolor sit amet...\n" : "  <!-- ... -->\n");
    parts.push(`</${elementName}>`);
  }

  return parts.join("");
}

function joinList<T>(items: T[], render: (item: T, index: number) => React.ReactNode, lang: "en" | "zh"): React.ReactNode {
  if (lang === "zh") {
    return items.map((item, index) => (
      <Fragment key={index}>
        {index > 0 && (index === items.length - 1 ? " 和 " : "、")}
        {render(item, index)}
      </Fragment>
    ));
  }
  return items.map((item, index) => (
    <Fragment key={index}>
      {items.length > 1 && index === items.length - 1 ? " and " : ""}
      {render(item, index)}
      {index === items.length - 1 || items.length < 3 ? "" : ","}
    </Fragment>
  ));
}

export async function UsingACustomValue({
  utility,
  utilities,
  name,
  value,
  variable,
  dataType,
  element = "div",
  elementAttributes = {},
  children,
}: {
  utility?: string;
  utilities?: Array<string>;
  name?: string;
  value?: string;
  variable?: string;
  dataType?: string;
  element?: string;
  elementAttributes?: Record<string, string>;
  children?: React.ReactNode;
}) {
  const locale = (await getLocale()) === "zh" ? "zh" : "en";
  let property = `--my-${variable || utility || utilities![0]}`;

  if (dataType) {
    property = `${dataType}:${property}`;
  }

  utility = utility || utilities![0];

  const renderUtilityCode = (name: string) => (
    <code>
      {name}-[<var>{"<value>"}</var>]
    </code>
  );

  return (
    <>
      <p>
        {locale === "zh" ? (
          utilities ? (
            <>
              使用 {joinList(utilities, renderUtilityCode, "zh")} 等工具类，按完全自定义的值设置 {name || utility}：
            </>
          ) : (
            <>
              使用{" "}
              <code>
                {utility}-[<var>{"<value>"}</var>]
              </code>{" "}
              语法，按完全自定义的值设置 {name || utility}：
            </>
          )
        ) : utilities ? (
          <>
            Use utilities like {joinList(utilities, renderUtilityCode, "en")} to set the {name || utility} based on a completely custom value:
          </>
        ) : (
          <>
            Use the{" "}
            <code>
              {utility}-[<var>{"<value>"}</var>]
            </code>{" "}
            syntax to set the {name || utility} based on a completely custom value:
          </>
        )}
      </p>
      {children || (
        <div>
          <div className="not-prose">
            <CodeExample
              example={{
                lang: "html",
                code: htmlSnippet({
                  elementName: element,
                  attributes: {
                    class: `${utility}-[${value}] ...`,
                    ...elementAttributes,
                  },
                  featuredClass: `${utility}-[${value}]`,
                }),
              }}
            />
          </div>
        </div>
      )}
      <p>
        {locale === "zh" ? (
          <>
            如果是 CSS 变量，也可以使用{" "}
            <code>
              {utility}-({dataType ? `${dataType}:` : null}
              <var>{"<custom-property>"}</var>)
            </code>{" "}
            语法：
          </>
        ) : (
          <>
            For CSS variables, you can also use the{" "}
            <code>
              {utility}-({dataType ? `${dataType}:` : null}
              <var>{"<custom-property>"}</var>)
            </code>{" "}
            syntax:
          </>
        )}
      </p>
      <div>
        <div className="not-prose">
          <CodeExample
            example={{
              lang: "html",
              code: htmlSnippet({
                elementName: element,
                attributes: {
                  class: `${utility}-(${property}) ...`,
                  ...elementAttributes,
                },
                featuredClass: `${utility}-(${property})`,
              }),
            }}
          />
        </div>
      </div>
      <p>
        {locale === "zh" ? (
          <>
            它其实是{" "}
            <code>
              {utility}-[{dataType ? `${dataType}:` : null}var(<var>{"<custom-property>"}</var>)]
            </code>{" "}
            的简写，会自动加上 <code>var()</code> 函数。
          </>
        ) : (
          <>
            This is just a shorthand for{" "}
            <code>
              {utility}-[{dataType ? `${dataType}:` : null}var(<var>{"<custom-property>"}</var>)]
            </code>{" "}
            that adds the <code>var()</code> function for you automatically.
          </>
        )}
      </p>
    </>
  );
}

export async function ResponsiveDesign({
  property,
  properties,
  breakpoint = "md",
  defaultClass,
  featuredClass,
  element = "div",
  elementAttributes = {},
  children,
}: {
  property: string;
  properties: Array<string>;
  breakpoint?: keyof typeof screens;
  defaultClass?: string;
  featuredClass: string;
  element?: string;
  elementAttributes?: Record<string, string>;
  children?: React.ReactNode;
}) {
  const locale = (await getLocale()) === "zh" ? "zh" : "en";
  const renderPropertyCode = (name: string) => <code>{name}</code>;

  return (
    <>
      <p>
        {locale === "zh" ? (
          <>
            {properties ? (
              <>给 {joinList(properties, renderPropertyCode, "zh")} 等工具类</>
            ) : (
              <>
                给 <code>{property}</code> 工具类
              </>
            )}
            添加像 <code>{breakpoint}:</code> 这样的断点变体，让样式仅在 {screens[breakpoint].zh}屏及以上生效：
          </>
        ) : (
          <>
            {properties ? (
              <>
                Prefix {joinList(properties, renderPropertyCode, "en")} utilities{" "}
              </>
            ) : (
              <>
                Prefix {startsWithVowel(property) ? "an" : "a"} <code>{property}</code> utility{" "}
              </>
            )}
            with a breakpoint variant like <code>{breakpoint}:</code> to only apply the utility at {screens[breakpoint].en}{" "}
            screen sizes and above:
          </>
        )}
      </p>
      {children || (
        <div>
          <div className="not-prose">
            <CodeExample
              example={{
                lang: "html",
                code: htmlSnippet({
                  elementName: element,
                  attributes: {
                    class: `${defaultClass} ${breakpoint}:${featuredClass} ...`,
                    ...elementAttributes,
                  },
                  featuredClass: `${breakpoint}:${featuredClass}`,
                }),
              }}
            />
          </div>
        </div>
      )}
      <p>
        {locale === "zh" ? (
          <>
            想了解更多关于变体的内容，参见 <a href="/docs/hover-focus-and-other-states">变体文档</a>。
          </>
        ) : (
          <>
            Learn more about using variants in the <a href="/docs/hover-focus-and-other-states">variants documentation</a>.
          </>
        )}
      </p>
    </>
  );
}

export async function TargetingSpecificStates({
  property,
  defaultClass,
  featuredClass,
  variant = "hover",
  element = "div",
  elementAttributes = {},
  children,
}: {
  property: string;
  variant?: string;
  defaultClass?: string;
  featuredClass: string;
  element?: string;
  elementAttributes?: Record<string, string>;
  children?: React.ReactNode;
}) {
  const locale = (await getLocale()) === "zh" ? "zh" : "en";

  return (
    <>
      <p>
        {locale === "zh" ? (
          <>
            给 <code>{property}</code> 工具类加上像 <code>{variant}:*</code> 这样的变体前缀，让样式仅在该状态下生效：
          </>
        ) : (
          <>
            Prefix {startsWithVowel(property) ? "an" : "a"} <code>{property}</code> utility with a variant like{" "}
            <code>{variant}:*</code> to only apply the utility in that state:
          </>
        )}
      </p>
      {children || (
        <div>
          <div className="not-prose">
            <CodeExample
              example={{
                lang: "html",
                code: htmlSnippet({
                  elementName: element,
                  attributes: {
                    class: `${defaultClass} ${variant}:${featuredClass} ...`,
                    ...elementAttributes,
                  },
                  featuredClass: `${variant}:${featuredClass}`,
                }),
              }}
            />
          </div>
        </div>
      )}
      <p>
        {locale === "zh" ? (
          <>
            想了解更多关于变体的内容，参见 <a href="/docs/hover-focus-and-other-states">变体文档</a>。
          </>
        ) : (
          <>
            Learn more about using variants in the <a href="/docs/hover-focus-and-other-states">variants documentation</a>.
          </>
        )}
      </p>
    </>
  );
}

export async function CustomizingYourTheme({
  utility,
  utilities,
  name,
  themeKey,
  customName,
  customValue,
  customCSS,
  includeSpacingNote = false,
  element = "div",
  elementAttributes = {},
  children,
}: {
  utility: string;
  utilities?: Array<string>;
  name: string;
  themeKey?: string;
  customName: string;
  customValue?: string;
  customCSS?: string;
  includeSpacingNote?: boolean;
  element?: string;
  elementAttributes?: Record<string, string>;
  children?: React.ReactNode;
}) {
  const locale = (await getLocale()) === "zh" ? "zh" : "en";
  const renderUtilityCode = (name: string) => (
    <code>
      {name}-{customName}
    </code>
  );

  return (
    <>
      <p>
        {locale === "zh" ? (
          <>
            使用 <code>--{themeKey || utility || utilities![0]}-*</code> 主题变量，自定义项目中的 {name} 工具类：
          </>
        ) : (
          <>
            Use the <code>--{themeKey || utility || utilities![0]}-*</code> theme variables to customize the {name}{" "}
            utilities in your project:
          </>
        )}
      </p>
      <div>
        <div className="not-prose">
          <CodeExample
            example={{
              lang: "css",
              code:
                customCSS ||
                css`
                  @theme {
                    --${themeKey || utility}-${customName}: ${customValue}; /* [!code highlight] */
                  }
                `,
            }}
          />
        </div>
      </div>
      {utilities ? (
        <p>
          {locale === "zh" ? (
            <>现在可以在 HTML 中使用 {joinList(utilities, renderUtilityCode, "zh")} 等工具类：</>
          ) : (
            <>Now utilities like {joinList(utilities, renderUtilityCode, "en")} can be used in your markup:</>
          )}
        </p>
      ) : (
        <p>
          {locale === "zh" ? (
            <>
              现在可以在 HTML 中使用{" "}
              <code>
                {utility}-{customName}
              </code>{" "}
              工具类：
            </>
          ) : (
            <>
              Now the{" "}
              <code>
                {utility}-{customName}
              </code>{" "}
              utility can be used in your markup:
            </>
          )}
        </p>
      )}
      <div>
        <div className="not-prose">
          <CodeExample
            example={{
              lang: "html",
              code: htmlSnippet({
                elementName: element,
                attributes: {
                  class: `${utility || utilities![0]}-${customName}`,
                  ...elementAttributes,
                },
                featuredClass: `${utility || utilities![0]}-${customName}`,
              }),
            }}
          />
        </div>
      </div>
      {includeSpacingNote && (
        <>
          <p>
            {locale === "zh" ? (
              <>
                <code>
                  {utility}-<var>{"<number>"}</var>
                </code>{" "}
                这一系列工具类由 <code>--spacing</code> 主题变量驱动，也可以自定义：
              </>
            ) : (
              <>
                The{" "}
                <code>
                  {utility}-<var>{"<number>"}</var>
                </code>{" "}
                utilities are driven by the <code>--spacing</code> theme variable, which you can also customize:
              </>
            )}
          </p>
          <div>
            <div className="not-prose">
              <CodeExample
                example={{
                  lang: "css",
                  code: css`
                    @theme {
                      --spacing: 1px; /* [!code highlight] */
                    }
                  `,
                }}
              />
            </div>
          </div>
        </>
      )}
      {children}
      {includeSpacingNote ? (
        <p>
          {locale === "zh" ? (
            <>
              想了解更多关于自定义间距比例的内容，参见 <a href="/docs/theme#customizing-your-theme">主题文档</a>。
            </>
          ) : (
            <>
              Learn more about customizing the spacing scale in the{" "}
              <a href="/docs/theme#customizing-your-theme">theme documentation</a>.
            </>
          )}
        </p>
      ) : (
        <p>
          {locale === "zh" ? (
            <>
              想了解更多关于自定义主题的内容，参见 <a href="/docs/theme#customizing-your-theme">主题文档</a>。
            </>
          ) : (
            <>
              Learn more about customizing your theme in the{" "}
              <a href="/docs/theme#customizing-your-theme">theme documentation</a>.
            </>
          )}
        </p>
      )}
    </>
  );
}

export async function CustomizingYourSpacingScale({ utility, utilities }: { utility: string; utilities: Array<string> }) {
  const locale = (await getLocale()) === "zh" ? "zh" : "en";
  utilities = utilities || [utility];
  const renderUtilityCode = (name: string) => (
    <code>
      {name}-<var>{"<number>"}</var>
    </code>
  );

  return (
    <>
      <p>
        {locale === "zh" ? (
          <>
            {joinList(utilities, renderUtilityCode, "zh")} 等工具类由 <code>--spacing</code> 主题变量驱动，可在自己的主题中自定义：
          </>
        ) : (
          <>
            The {joinList(utilities, renderUtilityCode, "en")} utilities are driven by the <code>--spacing</code> theme variable, which can be customized in your own theme:
          </>
        )}
      </p>
      <div>
        <div className="not-prose">
          <CodeExample
            example={{
              lang: "css",
              code: css`
                @theme {
                  --spacing: 1px; /* [!code highlight] */
                }
              `,
            }}
          />
        </div>
      </div>
      <p>
        {locale === "zh" ? (
          <>
            想了解更多关于自定义间距比例的内容，参见 <a href="/docs/theme">主题变量文档</a>。
          </>
        ) : (
          <>
            Learn more about customizing the spacing scale in the <a href="/docs/theme">theme variable documentation</a>.
          </>
        )}
      </p>
    </>
  );
}

export function CustomizingYourThemeColors({
  utility,
  utilities,
  element = "div",
  elementAttributes = {},
}: {
  utility: string;
  utilities?: Array<string>;
  element?: string;
  elementAttributes?: Record<string, string>;
}) {
  return (
    <CustomizingYourTheme
      themeKey="color"
      name="color"
      utility={utility}
      utilities={utilities}
      customName="regal-blue"
      customValue="#243c5a"
      element={element}
      elementAttributes={elementAttributes}
    />
  );
}

import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FullSlug, pathToRoot } from "../util/path"

// The site name in the left panel. Same as Quartz's page title, except the
// first letter is set apart so it can be drawn as a script initial (the T in
// Pinyon Script). Screen readers and search engines still read the whole name.
function SiteName({ fileData, cfg, displayClass }: QuartzComponentProps) {
  const title = cfg?.pageTitle ?? "Temenos"
  const baseDir = pathToRoot(fileData.slug! as FullSlug)
  const [first, ...rest] = [...title]
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir} aria-label={title}>
        <span class="initial" aria-hidden="true">
          {first}
        </span>
        <span aria-hidden="true">{rest.join("")}</span>
      </a>
    </h2>
  )
}

SiteName.css = `
.page-title {
  margin: 0;
}
`

export default (() => SiteName) satisfies QuartzComponentConstructor

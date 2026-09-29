import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FullSlug, resolveRelative } from "../util/path"

// The garden's sections, listed in the left panel beneath search.
// Each entry: the folder name in the vault, and the title shown on the site.
// To rename a section, change its title here and in the folder's index.md.
const SECTIONS: { folder: string; title: string }[] = [
  { folder: "psyche", title: "De Anima" },
  { folder: "alchemy", title: "De Alchymia" },
  { folder: "mysteries", title: "De Mysteriis" },
  { folder: "being", title: "De Ente" },
  { folder: "gothic", title: "De Ruinis" },
  { folder: "beauty", title: "De Forma" },
  { folder: "creation", title: "De Creatione" },
]

function Sections({ fileData, displayClass }: QuartzComponentProps) {
  const current = fileData.slug ?? ""
  return (
    <nav class={classNames(displayClass, "garden-sections")} aria-label="Sections">
      <ul>
        {SECTIONS.map(({ folder, title }) => {
          const active = current === `${folder}/index` || current.startsWith(`${folder}/`)
          return (
            <li>
              <a
                class={active ? "active" : ""}
                href={resolveRelative(fileData.slug! as FullSlug, `${folder}/` as FullSlug)}
              >
                {title}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default (() => Sections) satisfies QuartzComponentConstructor

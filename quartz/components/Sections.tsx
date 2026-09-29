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

// Heading for the list; click it to open or close the sections.
const HEADING = "De Profundis"

function Sections({ fileData, displayClass }: QuartzComponentProps) {
  const current = fileData.slug ?? ""
  const inSection = SECTIONS.some(
    ({ folder }) => current === `${folder}/index` || current.startsWith(`${folder}/`),
  )
  return (
    <nav
      class={classNames(displayClass, "garden-sections", inSection ? "" : "collapsed")}
      aria-label="Sections"
    >
      <button type="button" class="sections-toggle" aria-expanded={inSection ? "true" : "false"}>
        <span>{HEADING}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="fold"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
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

// Open/close on click. The visitor's choice is remembered while they browse.
Sections.afterDOMLoaded = `
function setupGardenSections() {
  for (const nav of document.querySelectorAll(".garden-sections")) {
    const btn = nav.querySelector(".sections-toggle")
    if (!btn) continue
    let saved = null
    try { saved = sessionStorage.getItem("garden-sections-open") } catch (e) {}
    const hasActive = !!nav.querySelector("a.active")
    if (saved !== null && !hasActive) {
      const open = saved === "1"
      nav.classList.toggle("collapsed", !open)
      btn.setAttribute("aria-expanded", open ? "true" : "false")
    }
    btn.onclick = () => {
      const open = nav.classList.toggle("collapsed") === false
      btn.setAttribute("aria-expanded", open ? "true" : "false")
      try { sessionStorage.setItem("garden-sections-open", open ? "1" : "0") } catch (e) {}
    }
  }
}
document.addEventListener("nav", setupGardenSections)
setupGardenSections()
`

export default (() => Sections) satisfies QuartzComponentConstructor

import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FullSlug, pathToRoot, resolveRelative } from "../util/path"

// The front page, listed first under De Profundis.
const PROLOGUE = "Prologue"

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
  return (
    <nav class={classNames(displayClass, "garden-sections")} aria-label="Sections">
      <button type="button" class="sections-toggle" aria-expanded="true">
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
        <li>
          <a
            class={current === "index" ? "active" : ""}
            data-home="true"
            href={pathToRoot(fileData.slug! as FullSlug)}
          >
            {PROLOGUE}
          </a>
        </li>
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

// Open on arrival; a click folds it away. If a reader closes it, it stays closed
// as they move between pages during that visit. The current section is marked
// again after every page change.
Sections.afterDOMLoaded = `
function setupGardenSections() {
  const here = location.pathname.replace(/\\/index(\\.html)?$/, "/").replace(/\\/?$/, "/")
  for (const nav of document.querySelectorAll(".garden-sections")) {
    const btn = nav.querySelector(".sections-toggle")
    if (!btn) continue

    for (const a of nav.querySelectorAll("ul a")) {
      const target = new URL(a.getAttribute("href"), location.href).pathname.replace(/\\/?$/, "/")
      const isHome = a.dataset.home === "true"
      a.classList.toggle("active", isHome ? here === target : here === target || here.startsWith(target))
    }

    let closed = false
    try { closed = sessionStorage.getItem("garden-sections-closed") === "1" } catch (e) {}
    nav.classList.toggle("collapsed", closed)
    btn.setAttribute("aria-expanded", closed ? "false" : "true")

    btn.onclick = () => {
      const nowClosed = nav.classList.toggle("collapsed")
      btn.setAttribute("aria-expanded", nowClosed ? "false" : "true")
      try { sessionStorage.setItem("garden-sections-closed", nowClosed ? "1" : "0") } catch (e) {}
    }
  }
}
document.addEventListener("nav", setupGardenSections)
setupGardenSections()
`

export default (() => Sections) satisfies QuartzComponentConstructor

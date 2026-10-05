import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FullSlug, pathToRoot, resolveRelative } from "../util/path"

// ─────────────────────────────────────────────────────────────────────
// The side-panel menu: a circumpunct (☉) that folds the whole list, and
// folding groups inside it.
//
// Each group has a title and a list of entries. An entry is either:
//   { title: "Prologue", home: true }            → the home page
//   { title: "Psyche", folder: "psyche" }        → a folder in the vault
//   { title: "Notepad", href: "https://…" }      → another site
//   { title: "Daybook" }                         → a name only, not yet linked
//
// The group holding the page you're on opens; the others stay folded
// until clicked. To add an entry, add a line to a group below (and for a
// folder, create it in the vault with an index.md inside).
// ─────────────────────────────────────────────────────────────────────

type Entry = { title: string; folder?: string; home?: boolean; href?: string }
type Group = { title: string; entries: Entry[] }

// The menu has no visible heading: a circumpunct (☉) sits between two
// hairlines instead. HEADING is still read aloud by screen readers.
const HEADING = "In Abyssum"

const GROUPS: Group[] = [
  {
    title: "Threshold",
    // Self-portrait points at the home page for now: swap its href for
    // folder: "…" once its page exists. Inquiries is its own site.
    entries: [
      { title: "Prologue", home: true },
      { title: "Self-portrait", href: "https://garden.abyssata.blog" },
      { title: "Inquiries", href: "https://ask.abyssata.blog" },
    ],
  },
  {
    title: "Interiority",
    entries: [
      { title: "Psyche", folder: "psyche" },
      { title: "Mysteries", folder: "mysteries" },
      { title: "Being", folder: "being" },
      { title: "Gothic", folder: "gothic" },
      { title: "Form", folder: "form" },
      { title: "Creation", folder: "creation" },
      { title: "Media", folder: "media" },
    ],
  },
  {
    title: "Marginalia",
    // To-do isn't linked yet: add folder: "…" once its page exists
    entries: [
      { title: "Diary", href: "https://diary.abyssata.blog" },
      { title: "Notepad", href: "https://misc.abyssata.blog" },
      { title: "To-do" },
    ],
  },
]

// ☉ The circumpunct: a circle around a centre point. Alchemical sign for
// gold and the sun, and the simplest picture of a temenos (bounded ground
// around a centre). Drawn as a shape so every device shows the same one.
const Fleuron = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-6 -6 112 112"
    width="112"
    height="112"
    class="fleuron"
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="8" />
    <circle class="dot" cx="50" cy="50" r="9" fill="currentColor" />
  </svg>
)

// An entry's name, with only its first letter in italic
const Label = ({ title }: { title: string }) => {
  const [first, ...rest] = [...title]
  return (
    <>
      <span class="lead">{first}</span>
      {rest.join("")}
    </>
  )
}

const Chevron = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
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
)

function Sections({ fileData, displayClass }: QuartzComponentProps) {
  const current = fileData.slug ?? ""
  const slug = fileData.slug! as FullSlug

  const isActive = (e: Entry) =>
    e.home
      ? current === "index"
      : !!e.folder && (current === `${e.folder}/index` || current.startsWith(`${e.folder}/`))

  return (
    <nav class={classNames(displayClass, "garden-sections")} aria-label="Sections">
      <button type="button" class="sections-toggle" aria-expanded="true" aria-label={HEADING}>
        <Fleuron />
      </button>
      <ul>
        {GROUPS.map((group) => {
          const open = group.entries.some(isActive)
          return (
            <li class={classNames("group", open ? "" : "closed")}>
              <button
                type="button"
                class="group-toggle"
                aria-expanded={open ? "true" : "false"}
                aria-label={group.title}
              >
                <span class="group-name" aria-hidden="true">
                  {[...group.title].map((ch) => (
                    <span>{ch}</span>
                  ))}
                </span>
                <Chevron size={12} />
              </button>
              <ul>
                {group.entries.map((e) => (
                  <li>
                    {e.href ? (
                      <a class="external-entry" data-external="true" href={e.href}>
                        <Label title={e.title} />
                      </a>
                    ) : e.home || e.folder ? (
                      <a
                        class={isActive(e) ? "active" : ""}
                        data-home={e.home ? "true" : undefined}
                        href={
                          e.home ? pathToRoot(slug) : resolveRelative(slug, `${e.folder}/` as FullSlug)
                        }
                      >
                        <Label title={e.title} />
                      </a>
                    ) : (
                      <a class="unlinked">
                        <Label title={e.title} />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// Behaviour in the browser:
//  · The menu opens on arrival. Clicking the circle folds it (the centre
//    point shows only while folded); once folded, it stays folded as the
//    reader moves between pages during that visit.
//  · After every page change, the current entry is marked, its group opens
//    and the other groups fold. Any group can be opened or folded by clicking,
//    and opening one folds the others, so only one group is open at a time.
//  · Group names are spread to the width of the longest one, so they start
//    and end together and their hairlines match.
Sections.afterDOMLoaded = `
function alignGroupNames() {
  for (const nav of document.querySelectorAll(".garden-sections")) {
    const names = [...nav.querySelectorAll(".group-name")]
    names.forEach((n) => n.classList.add("measuring"))
    const w = Math.max(0, ...names.map((n) => n.getBoundingClientRect().width))
    names.forEach((n) => n.classList.remove("measuring"))
    if (w > 0) names.forEach((n) => (n.style.width = w + "px"))
  }
}
if (!window.__gardenAlignBound) {
  window.__gardenAlignBound = true
  window.addEventListener("resize", alignGroupNames)
  if (document.fonts) document.fonts.ready.then(alignGroupNames)
}

function setupGardenSections() {
  alignGroupNames()
  const norm = (p) => p.replace(/\\/index(\\.html)?$/, "/").replace(/\\/?$/, "/")
  const here = norm(location.pathname)
  for (const nav of document.querySelectorAll(".garden-sections")) {
    const btn = nav.querySelector(".sections-toggle")
    if (!btn) continue

    for (const a of nav.querySelectorAll(".group a[href]")) {
      if (a.dataset.external === "true") continue
      const target = norm(new URL(a.getAttribute("href"), location.href).pathname)
      const isHome = a.dataset.home === "true"
      a.classList.toggle("active", isHome ? here === target : here === target || here.startsWith(target))
    }

    for (const group of nav.querySelectorAll("li.group")) {
      const toggle = group.querySelector(".group-toggle")
      const open = !!group.querySelector("a.active")
      group.classList.toggle("closed", !open)
      toggle.setAttribute("aria-expanded", open ? "true" : "false")
      toggle.onclick = () => {
        const nowClosed = group.classList.toggle("closed")
        toggle.setAttribute("aria-expanded", nowClosed ? "false" : "true")
        // Opening one group folds the others, so only one is open at a time
        if (!nowClosed) {
          for (const other of nav.querySelectorAll("li.group")) {
            if (other === group) continue
            other.classList.add("closed")
            other.querySelector(".group-toggle")?.setAttribute("aria-expanded", "false")
          }
        }
      }
    }

    // On phones the menu starts folded; elsewhere it starts open. Either way,
    // once a reader opens or folds it, that choice holds for the visit.
    let closed = window.matchMedia("(max-width: 800px)").matches
    try {
      const kept = sessionStorage.getItem("garden-sections-closed")
      if (kept !== null) closed = kept === "1"
    } catch (e) {}
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

import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FullSlug, pathToRoot, resolveRelative } from "../util/path"

// ─────────────────────────────────────────────────────────────────────
// The side-panel navigation: "In Abyssum", with folding groups inside.
//
// Each group has a title and a list of entries. An entry is either:
//   { title: "Prologue", home: true }            → the home page
//   { title: "Psyche", folder: "psyche" }        → a folder in the vault
//
// The group holding the page you're on opens; the others stay folded
// until clicked. To add an entry, add a line to a group below (and for a
// folder, create it in the vault with an index.md inside).
// ─────────────────────────────────────────────────────────────────────

type Entry = { title: string; folder?: string; home?: boolean }
type Group = { title: string; entries: Entry[] }

// The menu has no visible heading: a leaf ornament (❧) sits between two
// hairlines instead. HEADING is still read aloud by screen readers.
const HEADING = "In Abyssum"

const GROUPS: Group[] = [
  {
    title: "Threshold",
    entries: [{ title: "Prologue", home: true }],
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
    ],
  },
]

// ❧, drawn as a shape so every device shows the same leaf
const Fleuron = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="160 -1156 1395 810"
    class="fleuron"
    aria-hidden="true"
  >
    <path
      transform="scale(1,-1)"
      fill="currentColor"
      d="M479 830Q416 816 371 780Q305 729 278 626Q357 655 419 713Q480 769 480 821Q480 825 479 830ZM990 346Q617 346 617 600Q617 669 735 735Q687 790 633 818Q595 838 558 838Q558 838 554 838Q556 751 481 671Q385 569 285 554Q310 483 377 483Q420 483 460 526Q468 496 468 447Q468 372 323 372Q216 372 196 543Q196 543 160 543Q160 543 160 615Q160 615 199 615Q229 757 330 837Q407 897 470 899Q455 917 419 935Q384 953 323 967Q251 984 251 1054Q251 1156 349 1156Q337 1127 337 1092Q337 1054 480 970Q546 931 550 906Q611 906 652 887Q695 867 751 819Q720 899 720 942Q720 1007 781 1046Q827 1075 936 1075Q1152 1075 1209 710Q1233 556 1334 556Q1432 556 1432 616Q1432 646 1420 664Q1409 681 1409 708Q1409 768 1489 768Q1555 768 1555 687Q1555 514 1308 416Q1132 346 990 346Z"
    />
  </svg>
)

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
      : current === `${e.folder}/index` || current.startsWith(`${e.folder}/`)

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
                    <a
                      class={isActive(e) ? "active" : ""}
                      data-home={e.home ? "true" : undefined}
                      href={e.home ? pathToRoot(slug) : resolveRelative(slug, `${e.folder}/` as FullSlug)}
                    >
                      {e.title}
                    </a>
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
//  · The menu opens on arrival (clicking the leaf folds it); if a reader closes it, it stays closed
//    as they move between pages during that visit.
//  · After every page change, the current entry is marked, its group opens
//    and the other groups fold. Any group can be opened or folded by clicking.
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

    for (const a of nav.querySelectorAll(".group a")) {
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
      }
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

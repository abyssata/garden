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

// The menu has no visible heading: a floral heart (❦) sits between two
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

// ❦ (floral heart), drawn as a shape so every device shows the same one.
// Outline from Noto Sans Symbols 2 (SIL Open Font License).
const Fleuron = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="51 -686 682 824"
    class="fleuron"
    aria-hidden="true"
  >
    <path
      transform="scale(1,-1)"
      fill="currentColor"
      d="M401 318 391 340 420 397Q427 410 431.0 421.5Q435 433 439 444Q376 465 327 508L289 542Q207 616 167 616Q105 616 105 556Q105 536 115.0 524.0Q125 512 139 512Q150 512 156.5 514.5Q163 517 173 524Q170 496 153.5 480.0Q137 464 109 464Q81 464 66.0 485.5Q51 507 51 536Q51 586 83.0 620.0Q115 654 173 654Q236 654 343 568Q337 588 337 616Q337 645 357.5 665.5Q378 686 413 686Q455 686 481.0 655.0Q507 624 507 576Q507 538 483 478Q497 471 521.5 466.5Q546 462 565 462Q604 462 622.5 478.0Q641 494 641 516Q641 534 626 544Q611 555 611 578Q611 603 628.0 619.5Q645 636 671 636Q698 636 715.5 615.5Q733 595 733 566Q733 542 714.0 509.0Q695 476 656 451Q616 426 559 426Q506 426 465 436Q448 392 401 318ZM455 492Q460 512 462.5 530.0Q465 548 465 564Q465 595 449.5 616.5Q434 638 409 638Q386 638 374.5 626.0Q363 614 363 594Q363 587 364.0 575.5Q365 564 367 550Q391 529 414 516ZM465 -138Q417 -138 363.0 -115.5Q309 -93 260.0 -53.5Q211 -14 177 38Q127 115 127 202Q127 260 144.0 307.0Q161 354 193.5 382.0Q226 410 273 410Q326 410 354.0 377.5Q382 345 385 274H401Q415 324 451.0 354.0Q487 384 539 384Q598 384 631.5 345.0Q665 306 665 240Q665 205 641.5 166.0Q618 127 558 88Q497 48 463.0 20.5Q429 -7 429 -44Q429 -68 449.0 -85.0Q469 -102 493 -102Q520 -102 535.5 -87.5Q551 -73 551 -50Q551 -31 533 2Q551 38 581 38Q629 38 629 -14Q629 -63 587.0 -100.5Q545 -138 465 -138Z"
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
//  · The menu opens on arrival (clicking the heart folds it; it turns upside down while folded); if a reader closes it, it stays closed
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

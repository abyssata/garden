import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"

// The painting beneath the subtitle in the left panel, in a thin frame,
// with a small caption beneath: "ROTHKO, 1964".
// To change it, replace quartz/static/images/rothko.jpg (or point SRC at
// another file in that folder) and update ALT, ARTIST and YEAR.
const SRC = "static/images/rothko.jpg"
const ALT = "A dark, near-black painting by Mark Rothko"
const ARTIST = "Rothko"
const YEAR = "1964"

function Frontispiece({ fileData, displayClass }: QuartzComponentProps) {
  const src = joinSegments(pathToRoot(fileData.slug! as FullSlug), SRC)
  return (
    <figure class={classNames(displayClass, "frontispiece")}>
      <div class="frame">
        <img src={src} alt={ALT} width={599} height={800} />
      </div>
      <figcaption>
        {ARTIST}, <i>{YEAR}</i>
      </figcaption>
    </figure>
  )
}

export default (() => Frontispiece) satisfies QuartzComponentConstructor

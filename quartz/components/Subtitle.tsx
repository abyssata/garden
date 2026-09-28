import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

// The line beneath the site name in the left panel.
function Subtitle({ displayClass }: QuartzComponentProps) {
  return (
    <p class={classNames(displayClass, "site-subtitle")}>
      A digital garden by{" "}
      <a class="external" href="https://theoptia.tumblr.com" target="_blank" rel="noopener">
        THEOPTIA
      </a>
      .
    </p>
  )
}

export default (() => Subtitle) satisfies QuartzComponentConstructor

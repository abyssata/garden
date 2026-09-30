import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes"
import Subtitle from "./quartz/components/Subtitle"
import Sections from "./quartz/components/Sections"
import SiteName from "./quartz/components/SiteName"
import Frontispiece from "./quartz/components/Frontispiece"

const config = await loadQuartzConfig()

// ── Temenos: subtitle beneath the site name, and the sections list beneath search ──
const base = await loadQuartzLayout()
const subtitle = Subtitle()
const sections = Sections()
const siteName = SiteName() // replaces Quartz's page title (script initial)
const frontispiece = Frontispiece() // the framed painting beneath the subtitle
// Left panel order: site name, subtitle, painting, search, sections, then everything else (contents)
const withSubtitle = (left?: any[]) =>
  left && left.length ? [siteName, subtitle, frontispiece, left[1], sections, ...left.slice(2)] : left

const defaults = { ...base.defaults, left: withSubtitle(base.defaults.left) }
const byPageType: Record<string, any> = {}
for (const [pageType, pageLayout] of Object.entries(base.byPageType)) {
  byPageType[pageType] = { ...pageLayout, left: withSubtitle(pageLayout.left) }
}

config.plugins.emitters = config.plugins.emitters.filter(
  (e: any) => e.name !== "PageTypeDispatcher",
)
config.plugins.emitters.push(PageTypeDispatcher({ defaults, byPageType }))

export default config
export const layout = { defaults, byPageType }

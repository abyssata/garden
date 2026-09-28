import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes"
import Subtitle from "./quartz/components/Subtitle"

const config = await loadQuartzConfig()

// ── Viriditas: add the subtitle beneath the site name in the left panel ──
const base = await loadQuartzLayout()
const subtitle = Subtitle()
const withSubtitle = (left?: any[]) =>
  left && left.length ? [left[0], subtitle, ...left.slice(1)] : left

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

import clockworkOrchard from "../examples/clockwork-orchard.json"
import emberHarbor from "../examples/ember-harbor.json"
import starwardCouriers from "../examples/starward-couriers.json"
import type { ProjectProps } from "./types"

// JSON imports type each card's attributes from its own literal keys.
const asProject = (data: unknown) => data as ProjectProps

export const exampleProjects = [
  asProject(emberHarbor),
  asProject(clockworkOrchard),
  asProject(starwardCouriers),
]

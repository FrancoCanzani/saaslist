import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"

export function pricingLabel(model: PublicProduct["pricingModel"]) {
  switch (model) {
    case "free":
      return "Free"
    case "freemium":
      return "Freemium"
    case "premium":
      return "Paid"
    default: {
      const exhaustive: never = model
      return exhaustive
    }
  }
}

export const clean = (obj: object) => Object.fromEntries(Object.entries(obj).filter(
    ([_, value]) => value != null
))
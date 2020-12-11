---
'@prefresh/nollup': patch
---

fix runtime node module resolve error. it's necessary to use an explicit extension when import if there's an exports path field in pacakge.json

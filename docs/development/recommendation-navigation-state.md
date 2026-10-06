# Recommendation navigation state

The recommendation form stores its draft and last successful response in tab-local
`sessionStorage` under `kuda-krym:recommendations:v1`. Browser storage errors fall
back to memory for client-side navigation; reloading with storage blocked cannot
preserve the state. No automatic recommendation request runs on restoration.

Drafts include the origin display text and selected origin object, travel limit,
date, time and priority. The stored calendar date is mapped back to a relative
option on return, preserving the actual trip date across midnight. Past or
unavailable choices use the existing date/time availability rules.

Results are validated with the shared response contract and restored for at most
30 minutes after submission. Returning or editing the draft does not renew that
age. Expired or malformed results are discarded while valid draft values remain.
This is navigation state, not an offline forecast or a replacement for API caching.

Both featured and alternative recommendation links carry the result's calendar
`date` and `from=recommendations`, retaining the existing coast/beach destination.
The hourly forecast selects and scrolls to the available requested day. Invalid or
unavailable dates fall back to the first available forecast day. Hero and forecast
return links point to `/#preferences` for this context. Canonical URLs remain the
plain detail URLs.

Validation: session unit tests plus `recommendation-navigation-state.spec.ts`
cover reload, browser back, contextual return links, selected dates, unfinished
forms and blocked storage. Existing recommendation, forecast navigation and
weather SEO tests remain applicable.

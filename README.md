ko.grid-paginated
============
Just started. It may grow to something usefull the other day. I don't try to make it super powerfull or universal. Just want to solve mine main tasks.

Its a try to solve complexity of making useful paginated grid with separeted binded view and editor using KnockoutJS framework. Most grids are just separated from view & editor. So if you get some 3th party plugin and try to use it with KnockoutJS it will not work the way KnockoutJS are works. It will be hard to bind that plugin true API only. I just need to control every small thing in grid, tiddy couple data & events between grid & view & editor. So making some CRUD control that will be simple to reuse, easy and fast to create. That's the main goal.

Tools:

- ajax by amplifyjs
- ui binding by knockoutjs
- routers by backbonejs

See file ui.view.list.js for main code.

Working example can be run from index.html

Supported:

- API as knockout observables and custom menthods
- local pagination
- sorting by one column
- searching by any column text
- multiple selection (in current page scope)
- view card binded to selected grid item

Plan to support:

- url hash routing by BackboneJS
- grid events API
- server-side pagination option (sorting and search will also be remote in this case)
- external editor for selected grid item
- sorting by any column
- custom bulk methods
- custom filters
- post-load additional data for card view
- cache loaded pages data (optionaly)
- column templates
- latency compensasion on saving
- latency compensasion on paging (preload next pages)
- keyboard navigation in grid
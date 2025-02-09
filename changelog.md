# Changelog

## 0.0.7 (09.02.2025)

### Custom Columns Definition
- Added possibility to set path of column object (auto suggested reference to row object fields)
- Added possibility of defining paths to object nested properties e.g. `row.propertyA.propertyB`
- Added possibility to set manually column cell data type, or stay with automatic detection
- Added possibility to set if column is `sortable` and `visible`
- Added `timestamp` data type formatter

## 0.0.6 (06.02.2025)

### Added component variables
- Exposed `selectedRows` component's variable which keeps an array of currently selected rows (array of data objects).
- Exposed `paginationState` component's variable which keeps an object which represents current state of pagination. It keeps paging metadata.
- Exposed `sortState` component's variable which keeps an array which represents current state of sorting. Columns have theirs sort state.

### Added component events
- Supported `onRowClicked` event. It shares data about clicked row's data and index.
- Supported `onRowDoubleClicked` event. It shares data about clicked row's data and index.
- Supported `onCellClicked` event. It shares data about clicked cell's data and field name. Additionally, it shares corresponding row data.
- Supported `onCellDoubleClicked` event. It shares data about clicked cell's data and field name. Additionally, it shares corresponding row data.
- Supported `onColumnHeaderClicked` event. It shares data about clicked header's name (field name).

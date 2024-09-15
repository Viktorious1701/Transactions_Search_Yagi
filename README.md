<h1>Transaction List App</h1>
A simple web application for managing and displaying a paginated, sortable, and searchable list of financial transactions using Next.js.

<h1>Features</h1>
Search Transactions: Search for transactions using keywords that will highlight matching text within the result list.
Pagination: Browse transactions with pagination to navigate through the list page by page.
Sortable Columns: Click on any column header to sort by date, transaction number, credit, debit, or detail in ascending or descending order.
Loading Indicator: Displays a loading spinner while fetching data from the API.
Debounced Search: Debounced search functionality ensures efficient querying and reduces unnecessary API requests.
Demo
to-be-continued

<h1>Screenshots</h1>
(Include a few screenshots of the app in action)

<h1>Technologies Used</h1>
Next.js: The React framework for server-side rendering and static site generation.
React Hooks: Used for managing state (useState, useEffect) and optimizing performance with useCallback and useMemo.
Lodash Debounce: Debounced search input to reduce the number of API requests.
HighlightText: Custom component to highlight matching text in search results.
Fetch API: For making API requests to fetch transaction data from the server.
TypeScript: Provides static typing to the React components and improves code quality.

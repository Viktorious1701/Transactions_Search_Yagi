<h1>Transaction List App</h1>
A simple web application for managing and displaying a paginated, sortable, and searchable list of financial transactions using Next.js.

<h1>Features</h1>
<ul> <li><strong>🔍 Search Transactions</strong>: Users can search for transactions using keywords, and matching text is highlighted in the result list.</li> <li><strong>⏩ Pagination</strong>: Browse transactions with page navigation controls.</li> <li><strong>🔄 Sortable Columns</strong>: Click column headers to sort by date, transaction number, credit, debit, or details.</li> <li><strong>⌛ Loading Indicator</strong>: A loading spinner is displayed while fetching data from the API.</li> <li><strong>⏳ Debounced Search</strong>: Efficient searching with debounced input to avoid excessive API requests.</li> </ul>
Screenshots
<p style="text-align:center"> <img src="https://via.placeholder.com/400x300" alt="App Screenshot" style="width: 400px;"/> </p> <p style="text-align:center"> <img src="https://via.placeholder.com/400x300" alt="Search Screenshot" style="width: 400px;"/> </p>
<h1>Demo</h1>
<p><strong>Link to live demo:</strong> <a href="#">Live Demo</a> (replace with actual deployment link)</p>
Technologies Used
<ul> <li><strong>Next.js</strong>: The React framework for server-side rendering and static site generation.</li> <li><strong>React Hooks</strong>: Used for managing state (<code>useState</code>, <code>useEffect</code>) and optimizing performance with <code>useCallback</code> and <code>useMemo</code>.</li> <li><strong>Lodash Debounce</strong>: Debounced search input to reduce the number of API requests.</li> <li><strong>HighlightText</strong>: Custom component to highlight matching text in search results.</li> <li><strong>Fetch API</strong>: For making API requests to fetch transaction data from the server.</li> <li><strong>TypeScript</strong>: Provides static typing to the React components and improves code quality.</li> </ul>

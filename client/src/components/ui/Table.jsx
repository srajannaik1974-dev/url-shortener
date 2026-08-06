/**
 * Table.jsx — Design System v2
 *
 * Composable table with consistent typography and spacing.
 * Inspired by GitHub's table design — clean, data-dense, readable.
 *
 * Usage:
 *   <Table>
 *     <Table.Head>
 *       <Table.Row>
 *         <Table.Header>Name</Table.Header>
 *       </Table.Row>
 *     </Table.Head>
 *     <Table.Body>
 *       <Table.Row hoverable>
 *         <Table.Cell>value</Table.Cell>
 *       </Table.Row>
 *     </Table.Body>
 *   </Table>
 */

// ── Table root ────────────────────────────────────────────────────────────────
function Table({ className = '', children, ...rest }) {
  return (
    <div className="w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
      <table
        className={`w-full border-collapse text-[13px] ${className}`}
        {...rest}
      >
        {children}
      </table>
    </div>
  );
}

// ── Table.Head ────────────────────────────────────────────────────────────────
function TableHead({ className = '', children }) {
  return (
    <thead className={`bg-[var(--color-bg-subtle)] ${className}`}>
      {children}
    </thead>
  );
}

// ── Table.Body ────────────────────────────────────────────────────────────────
function TableBody({ className = '', children }) {
  return (
    <tbody className={`divide-y divide-[var(--color-border)] ${className}`}>
      {children}
    </tbody>
  );
}

// ── Table.Row ─────────────────────────────────────────────────────────────────
function TableRow({ hoverable = false, className = '', children, ...rest }) {
  return (
    <tr
      className={[
        'bg-[var(--color-bg-page)]',
        hoverable ? 'hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer' : '',
        className,
      ].join(' ')}
      style={{ transitionDuration: '100ms' }}
      {...rest}
    >
      {children}
    </tr>
  );
}

// ── Table.Header (th) ─────────────────────────────────────────────────────────
function TableHeader({
  className = '',
  align = 'left',
  sortable = false,
  sorted = null, // 'asc' | 'desc' | null
  onSort,
  children,
  ...rest
}) {
  return (
    <th
      scope="col"
      aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : undefined}
      className={[
        'px-4 py-2.5 font-medium text-[11px] uppercase tracking-wider',
        'text-[var(--color-text-tertiary)] whitespace-nowrap',
        'border-b border-[var(--color-border)]',
        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
        sortable ? 'cursor-pointer select-none hover:text-[var(--color-text-secondary)]' : '',
        className,
      ].join(' ')}
      onClick={sortable ? onSort : undefined}
      {...rest}
    >
      {children}
    </th>
  );
}

// ── Table.Cell (td) ───────────────────────────────────────────────────────────
function TableCell({ className = '', align = 'left', children, ...rest }) {
  return (
    <td
      className={[
        'px-4 py-3',
        'text-[var(--color-text-primary)]',
        'align-middle whitespace-nowrap',
        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </td>
  );
}

// ── Table.Empty ───────────────────────────────────────────────────────────────
function TableEmpty({ colSpan = 1, children }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        {children}
      </td>
    </tr>
  );
}

// Attach sub-components
Table.Head   = TableHead;
Table.Body   = TableBody;
Table.Row    = TableRow;
Table.Header = TableHeader;
Table.Cell   = TableCell;
Table.Empty  = TableEmpty;

export default Table;

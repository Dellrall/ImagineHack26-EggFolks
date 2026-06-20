export default function Table({ columns, rows, renderActions }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 font-black">{column.label}</th>
              ))}
              {renderActions && <th className="px-5 py-4 font-black">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100 dark:border-slate-800">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 text-slate-700 dark:text-slate-200">
                    {row[column.key]}
                  </td>
                ))}
                {renderActions && <td className="px-5 py-4">{renderActions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Table, Form, Button, Badge } from 'react-bootstrap';

export default function MedicinesTable({ data, onEdit, onDelete, isAdmin }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  // Определение колонок
  const columns = useMemo(() => {
    const cols = [
      {
        id: 'select',
        header: ({ table }) => (
          <Form.Check
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Form.Check
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        accessorKey: 'id',
        header: 'ID',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'photoUrl',
        header: 'Фото',
        cell: info => (
          <img
            src={info.getValue() || '/photos/medicine1.jpg'}
            alt="фото"
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
            onError={(e) => { e.target.src = '/photos/medicine1.jpg'; }}
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Название',
      },
      {
        accessorKey: 'manufacturer',
        header: 'Производитель',
      },
      {
        accessorKey: 'price',
        header: 'Цена (руб.)',
        cell: info => <Badge bg="success">{parseFloat(info.getValue()).toFixed(2)}</Badge>,
      },
    ];

    if (isAdmin) {
      cols.push({
        id: 'actions',
        header: 'Действия',
        cell: ({ row }) => (
          <div className="d-flex gap-1">
            <Button size="sm" variant="warning" onClick={() => onEdit(row.original)}>✏️</Button>
            <Button size="sm" variant="danger" onClick={() => onDelete(row.original.id, row.original.name)}>🗑️</Button>
          </div>
        ),
      });
    }

    return cols;
  }, [isAdmin, onEdit, onDelete]);

  // Инициализация таблицы
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      {/* Поле глобального поиска (фильтрация) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 Фильтр по всей таблице..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <div className="text-muted">
          Выбрано строк: {Object.keys(rowSelection).length}
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {/* Индикатор сортировки */}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Пагинация */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ← Назад
          </Button>
          <span className="mx-2">
            Страница {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
          </span>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Вперед →
          </Button>
        </div>
      </div>
    </div>
  );
}
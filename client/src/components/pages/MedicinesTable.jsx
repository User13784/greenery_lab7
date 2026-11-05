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

  const columns = useMemo(() => {
    const cols = [
      {
        accessorKey: 'id',
        header: 'ID',
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

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // 👇 Настройка пагинации по 10 записей 👇
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 Фильтр по всей таблице..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          style={{ maxWidth: 300 }}
        />
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
                  {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted()] ?? null}
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
'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockFields = [
  { id: 1, name: 'Lapangan A', venue: 'GOR Senayan Futsal', type: 'Indoor', price: 200000 },
  { id: 2, name: 'Lapangan B', venue: 'GOR Senayan Futsal', type: 'Indoor', price: 200000 },
  { id: 3, name: 'Court 1', venue: 'Futsal Center Jakarta', type: 'Outdoor', price: 150000 },
];

export default function AdminFieldsPage() {
  const [fields, setFields] = useState(mockFields);

  const handleDelete = (id: number) => {
    setFields(fields.filter(f => f.id !== id));
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Field Management</h1>
            <Button>Add Field</Button>
          </div>

          {/* Fields Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map(field => (
                    <tr key={field.id}>
                      <td className="px-6 py-4">{field.id}</td>
                      <td className="px-6 py-4">{field.name}</td>
                      <td className="px-6 py-4">{field.venue}</td>
                      <td className="px-6 py-4">{field.type}</td>
                      <td className="px-6 py-4">Rp {field.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="outline">Edit</Button>
                        <Button variant="destructive" onClick={() => handleDelete(field.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatTime } from '@/lib/utils';

// Mock booking data
const mockBookings = [
  {
    id: 1,
    customerName: 'Ahmad Ridwan',
    customerPhone: '081234567890',
    customerEmail: 'ahmad@email.com',
    venueName: 'GOR Senayan Futsal',
    fieldName: 'Lapangan A',
    bookingDate: '2024-01-15',
    startTime: '19:00',
    endTime: '20:00',
    totalPrice: 200000,
    status: 'confirmed',
    notes: 'Tim kantor, tolong siapkan air minum',
    createdAt: '2024-01-14 10:30:00',
    paymentStatus: 'paid'
  },
  {
    id: 2,
    customerName: 'Sarah Putri',
    customerPhone: '081234567891',
    customerEmail: 'sarah@email.com',
    venueName: 'Arena Mini Soccer Plus',
    fieldName: 'Lapangan 1',
    bookingDate: '2024-01-15',
    startTime: '16:00',
    endTime: '17:00',
    totalPrice: 180000,
    status: 'pending',
    notes: '',
    createdAt: '2024-01-14 15:45:00',
    paymentStatus: 'pending'
  },
  {
    id: 3,
    customerName: 'Budi Santoso',
    customerPhone: '081234567892',
    customerEmail: 'budi@email.com',
    venueName: 'Futsal Center Jakarta',
    fieldName: 'Court 1',
    bookingDate: '2024-01-14',
    startTime: '20:00',
    endTime: '21:00',
    totalPrice: 150000,
    status: 'completed',
    notes: 'Regular customer',
    createdAt: '2024-01-13 09:15:00',
    paymentStatus: 'paid'
  },
  {
    id: 4,
    customerName: 'Lisa Wong',
    customerPhone: '081234567893',
    customerEmail: 'lisa@email.com',
    venueName: 'GOR Senayan Futsal',
    fieldName: 'Lapangan B',
    bookingDate: '2024-01-16',
    startTime: '18:00',
    endTime: '19:00',
    totalPrice: 200000,
    status: 'cancelled',
    notes: 'Cancelled due to rain',
    createdAt: '2024-01-14 16:20:00',
    paymentStatus: 'refunded'
  }
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesDate = dateFilter === 'all' || (() => {
      const bookingDate = new Date(booking.bookingDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(today.getDate() + 7);

      switch (dateFilter) {
        case 'today':
          return bookingDate.toDateString() === today.toDateString();
        case 'tomorrow':
          return bookingDate.toDateString() === tomorrow.toDateString();
        case 'week':
          return bookingDate >= today && bookingDate <= weekFromNow;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = (bookingId: number, newStatus: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));
  };

  const exportCSV = () => {
    const header = Object.keys(bookings[0]).join(',');
    const rows = bookings.map(b => Object.values(b).join(','));
    const csvContent = [header, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'bookings.csv');
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddBooking = (e: any) => {
    e.preventDefault();
    const form = e.target;
    const newBooking = {
      id: bookings.length + 1,
      customerName: form.customerName.value,
      customerPhone: form.customerPhone.value,
      customerEmail: form.customerEmail.value,
      venueName: form.venueName.value,
      fieldName: form.fieldName.value,
      bookingDate: form.bookingDate.value,
      startTime: form.startTime.value,
      endTime: form.endTime.value,
      totalPrice: parseInt(form.totalPrice.value),
      status: 'pending',
      notes: form.notes.value,
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending'
    };
    setBookings([...bookings, newBooking]);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Booking Management</h1>
              <p className="text-gray-600">Kelola semua booking dan reservasi</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
              <Button onClick={() => setShowForm(true)}>Manual Booking</Button>
            </div>
          </div>

          {/* Filters & Stats */}
          {/* ... (sama seperti sebelumnya) */}

          {/* Bookings Table */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Bookings ({filteredBookings.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue & Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">#{booking.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-xs text-gray-500">{booking.customerPhone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{booking.venueName}</p>
                        <p className="text-xs text-gray-500">{booking.fieldName}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatTime(booking.bookingDate)} <br />
                        {booking.startTime} - {booking.endTime}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{formatCurrency(booking.totalPrice)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => {setSelectedBooking(booking); setShowModal(true);}}>View</Button>
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Booking Detail Modal */}
          {showModal && selectedBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <h2 className="text-lg font-bold mb-4">Booking Details</h2>
                <p><strong>Customer:</strong> {selectedBooking.customerName}</p>
                <p><strong>Phone:</strong> {selectedBooking.customerPhone}</p>
                <p><strong>Email:</strong> {selectedBooking.customerEmail}</p>
                <p><strong>Venue:</strong> {selectedBooking.venueName} - {selectedBooking.fieldName}</p>
                <p><strong>Date:</strong> {formatTime(selectedBooking.bookingDate)}</p>
                <p><strong>Time:</strong> {selectedBooking.startTime} - {selectedBooking.endTime}</p>
                <p><strong>Total:</strong> {formatCurrency(selectedBooking.totalPrice)}</p>
                <p><strong>Status:</strong> {selectedBooking.status}</p>
                <p><strong>Payment:</strong> {selectedBooking.paymentStatus}</p>
                <p><strong>Notes:</strong> {selectedBooking.notes || '-'}</p>
                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Close</Button>
                </div>
              </div>
            </div>
          )}

          {/* Manual Booking Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <h2 className="text-lg font-bold mb-4">Manual Booking</h2>
                <form onSubmit={handleAddBooking} className="space-y-3">
                  <input name="customerName" placeholder="Customer Name" className="w-full border p-2 rounded" required />
                  <input name="customerPhone" placeholder="Phone" className="w-full border p-2 rounded" required />
                  <input name="customerEmail" placeholder="Email" className="w-full border p-2 rounded" required />
                  <input name="venueName" placeholder="Venue" className="w-full border p-2 rounded" required />
                  <input name="fieldName" placeholder="Field" className="w-full border p-2 rounded" required />
                  <input type="date" name="bookingDate" className="w-full border p-2 rounded" required />
                  <div className="flex space-x-2">
                    <input type="time" name="startTime" className="w-1/2 border p-2 rounded" required />
                    <input type="time" name="endTime" className="w-1/2 border p-2 rounded" required />
                  </div>
                  <input type="number" name="totalPrice" placeholder="Total Price" className="w-full border p-2 rounded" required />
                  <textarea name="notes" placeholder="Notes" className="w-full border p-2 rounded" />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
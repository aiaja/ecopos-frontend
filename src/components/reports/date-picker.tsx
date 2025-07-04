
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

type DatePickerProps = {
  value?: Date | string | null;
  onChange: (date: string) => void;
  placeholder?: string;
};

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = "Pilih tanggal..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (!value) return null;
    if (value instanceof Date) return value;
    // If value is a string, try to parse it
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  });

  const handleDateSelect = (date: Date) => {
    if (!date) return;
    // convert to 2023-10-01 format
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    setSelectedDate(newDate);
    onChange(newDate.toISOString().split('T')[0]); // Format to YYYY-MM-DD
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const generateCalendarDays = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    // const lastDay = new Date(currentYear, currentMonth + 1, 0); // removed unused variable
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        day: date.getDate()
      });
    }
    
    return days;
  };

  const days = generateCalendarDays();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <Calendar className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-72 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">
                {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day.date)}
                  className={`
                    text-xs py-1 px-1 rounded text-center hover:bg-blue-50 
                    ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                    ${day.isToday ? 'bg-blue-100 text-blue-600 font-medium' : ''}
                    ${day.isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                  `}
                >
                  {day.day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
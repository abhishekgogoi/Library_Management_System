import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { returnBook } from '../store/slices/rentalsSlice';
import { updateBookAvailability } from '../store/slices/booksSlice';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BookOpen, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const RentalCard = ({ rental, onReturn }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  
  useEffect(() => {
    if (rental.returned) return;
    
    const updateTime = () => {
      const now = new Date();
      const due = new Date(rental.dueDate);
      const diff = due - now;
      
      if (diff <= 0) {
        setTimeRemaining('Overdue');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [rental.dueDate, rental.returned]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const isOverdue = !rental.returned && new Date(rental.dueDate) < new Date();
  
  return (
    <Card 
      className={`hover:shadow-lg transition-shadow border-slate-200 ${
        rental.returned ? 'bg-slate-50' : ''
      }`}
      data-testid={`rental-card-${rental.id}`}
    >
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <BookOpen className={`h-5 w-5 ${rental.returned ? 'text-slate-400' : 'text-slate-600'}`} />
          <Badge 
            variant={rental.returned ? "secondary" : isOverdue ? "destructive" : "default"}
            className={
              rental.returned 
                ? "bg-slate-200 text-slate-600" 
                : isOverdue
                ? "bg-red-100 text-red-700 hover:bg-red-100"
                : "bg-blue-100 text-blue-700 hover:bg-blue-100"
            }
            data-testid={`rental-status-${rental.id}`}
          >
            {rental.returned ? 'Returned' : isOverdue ? 'Overdue' : 'Active'}
          </Badge>
        </div>
        <CardTitle className="text-lg font-medium text-slate-800">
          {rental.bookTitle}
        </CardTitle>
        <CardDescription className="text-slate-600">
          Rental ID: {rental.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>Rented: {formatDate(rental.rentalStartTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="h-4 w-4" />
            <span>Due: {formatDate(rental.dueDate)}</span>
          </div>
          {!rental.returned && (
            <div className="flex items-center gap-2 font-medium">
              <Clock className={`h-4 w-4 ${isOverdue ? 'text-red-600' : 'text-blue-600'}`} />
              <span className={isOverdue ? 'text-red-600' : 'text-blue-600'} data-testid={`time-remaining-${rental.id}`}>
                {timeRemaining}
              </span>
            </div>
          )}
          {rental.returned && rental.returnTime && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Returned: {formatDate(rental.returnTime)}</span>
            </div>
          )}
        </div>
        
        {!rental.returned && (
          <Button
            onClick={() => onReturn(rental.id, rental.bookId)}
            className="w-full bg-slate-800 hover:bg-slate-700"
            data-testid={`return-button-${rental.id}`}
          >
            Return Book
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const MyRentals = () => {
  const dispatch = useDispatch();
  const rentals = useSelector((state) => state.rentals.rentals);
  
  const handleReturn = (rentalId, bookId) => {
    dispatch(returnBook(rentalId));
    dispatch(updateBookAvailability({ bookId, available: true }));
    toast.success('Book returned successfully!');
  };
  
  const activeRentals = rentals.filter(r => !r.returned);
  const returnedRentals = rentals.filter(r => r.returned);
  
  return (
    <div className="min-h-screen bg-slate-50" data-testid="my-rentals-page">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-800 mb-2">My Rentals</h1>
          <p className="text-slate-600">Track your rented books and return them on time</p>
        </div>
        
        {rentals.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="py-20 text-center">
              <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">You haven't rented any books yet.</p>
              <p className="text-slate-400 text-sm mt-2">Visit the Books page to start renting!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {activeRentals.length > 0 && (
              <div>
                <h2 className="text-2xl font-medium text-slate-800 mb-4">Active Rentals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeRentals.map((rental) => (
                    <RentalCard 
                      key={rental.id} 
                      rental={rental} 
                      onReturn={handleReturn}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {returnedRentals.length > 0 && (
              <div>
                <h2 className="text-2xl font-medium text-slate-800 mb-4">Rental History</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {returnedRentals.map((rental) => (
                    <RentalCard 
                      key={rental.id} 
                      rental={rental} 
                      onReturn={handleReturn}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
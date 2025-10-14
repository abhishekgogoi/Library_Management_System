import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBooks,
  updateBookAvailability,
  setSearchQuery,
} from "../store/slices/booksSlice";
import { addRental } from "../store/slices/rentalsSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Search, Loader2, BookOpen, User, Heart } from "lucide-react";
import { toast } from "sonner";

export const Books = () => {
  const dispatch = useDispatch();
  const { books, loading, searchQuery, error } = useSelector(
    (state) => state.books
  );
  const rentals = useSelector((state) => state.rentals.rentals);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const user = useSelector((state) => state.auth.user);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [filterView, setFilterView] = useState("all"); // 'all' or 'wishlist'

  useEffect(() => {
    if (books.length === 0 && !loading && !error) {
      dispatch(fetchBooks())
        .unwrap()
        .catch((err) => {
          toast.error(
            `Failed to load books: ${err.message || "Unknown error"}`
          );
        });
    }
  }, [dispatch, books.length, loading, error]);

  const handleRetryFetch = () => {
    dispatch(fetchBooks())
      .unwrap()
      .catch((err) => {
        toast.error(`Failed to load books: ${err.message || "Unknown error"}`);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearch));
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  const handleRentBook = (book) => {
    dispatch(
      addRental({
        bookId: book.id,
        bookTitle: book.title,
        userId: user.id,
      })
    );
    dispatch(updateBookAvailability({ bookId: book.id, available: false }));
    toast.success(`Successfully rented: ${book.title}`);
  };

  const handleToggleWishlist = (bookId, bookTitle) => {
    if (wishlist.includes(bookId)) {
      dispatch(removeFromWishlist(bookId));
      toast.success(`Removed from wishlist`);
    } else {
      dispatch(addToWishlist(bookId));
      toast.success(`Added to wishlist`);
    }
  };

  const isInWishlist = (bookId) => wishlist.includes(bookId);

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query);

    if (filterView === "wishlist") {
      return matchesSearch && wishlist.includes(book.id);
    }

    return matchesSearch;
  });

  const activeRentalsCount = rentals.filter((r) => !r.returned).length;

  return (
    <div className="min-h-screen bg-slate-50" data-testid="books-page">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-800 mb-2">
            Book Catalog
          </h1>
          <p className="text-slate-600">
            Browse and rent books from our collection
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by title, author, or description..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 border-slate-300 focus:border-slate-400"
                data-testid="search-input"
              />
            </div>
            <Badge
              variant="secondary"
              className="bg-slate-200 text-slate-700 px-4 py-2"
            >
              {activeRentalsCount} Active Rentals
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button
              variant={filterView === "all" ? "default" : "outline"}
              onClick={() => setFilterView("all")}
              className={
                filterView === "all"
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "border-slate-300 hover:bg-slate-100"
              }
              data-testid="all-books-filter"
            >
              All Books ({books.length})
            </Button>
            <Button
              variant={filterView === "wishlist" ? "default" : "outline"}
              onClick={() => setFilterView("wishlist")}
              className={
                filterView === "wishlist"
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "border-slate-300 hover:bg-slate-100"
              }
              data-testid="wishlist-filter"
            >
              <Heart className="h-4 w-4 mr-2" />
              Wishlist ({wishlist.length})
            </Button>
          </div>
        </div>

        {error && !loading ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-20 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-red-800 text-lg font-medium mb-2">
                Failed to load books
              </p>
              <p className="text-red-600 text-sm mb-6">{error}</p>
              <Button
                onClick={handleRetryFetch}
                className="bg-red-600 hover:bg-red-700 text-white"
                data-testid="retry-fetch-button"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600 mb-4" />
            <p className="text-slate-600 text-sm">Loading books...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                className="hover:shadow-lg transition-shadow border-slate-200"
                data-testid={`book-card-${book.id}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <BookOpen className="h-5 w-5 text-slate-500" />
                    <Badge
                      variant={book.available ? "default" : "secondary"}
                      className={
                        book.available
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-slate-200 text-slate-600"
                      }
                      data-testid={`book-status-${book.id}`}
                    >
                      {book.available ? "Available" : "Rented"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-medium text-slate-800 line-clamp-2">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-slate-600">
                    <User className="h-3 w-3" />
                    {book.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                    {book.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRentBook(book)}
                      disabled={!book.available}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 disabled:text-slate-500"
                      data-testid={`rent-button-${book.id}`}
                    >
                      {book.available ? "Rent Book" : "Currently Rented"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleWishlist(book.id, book.title)}
                      className={
                        isInWishlist(book.id)
                          ? "border-red-300 bg-red-50 hover:bg-red-100"
                          : "border-slate-300 hover:bg-slate-100"
                      }
                      data-testid={`wishlist-button-${book.id}`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isInWishlist(book.id)
                            ? "fill-red-500 text-red-500"
                            : "text-slate-600"
                        }`}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading &&
          !error &&
          filteredBooks.length === 0 &&
          books.length > 0 && (
            <Card className="border-slate-200">
              <CardContent className="py-20 text-center">
                <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">
                  No books found matching your search.
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Try adjusting your filters or search terms
                </p>
              </CardContent>
            </Card>
          )}

        {!loading && !error && books.length === 0 && (
          <Card className="border-slate-200">
            <CardContent className="py-20 text-center">
              <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No books available</p>
              <p className="text-slate-400 text-sm mt-2">
                Check back later for new additions
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
